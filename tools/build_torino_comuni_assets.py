#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
import unicodedata
from pathlib import Path

import geopandas as gpd
import pandas as pd


TORINO_PROVINCE_CODE = 1
DEFAULT_SIMPLIFY_TOLERANCE = 18.0

# Keep this intentionally small and unambiguous.
MANUAL_ALIASES: dict[str, list[str]] = {}


def fix_mojibake(value: str | None) -> str | None:
    if value is None:
        return None
    if "Ã" not in value and "â" not in value:
        return value
    try:
        return value.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return value


def normalize_guess(value: str) -> str:
    value = fix_mojibake(value) or ""
    value = unicodedata.normalize("NFD", value)
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    cleaned = []
    for ch in value.lower():
        if ch.isalnum():
            cleaned.append(ch)
        else:
            cleaned.append(" ")
    return " ".join("".join(cleaned).split())


def feature_collection(gdf: gpd.GeoDataFrame) -> dict[str, object]:
    return json.loads(gdf.to_json(drop_id=True))


def compute_base_chips(area_km2: float, min_area: float, max_area: float) -> int:
    min_area = max(min_area, 0.05)
    max_area = max(max_area, min_area + 0.01)
    log_min = math.log(min_area)
    log_max = math.log(max_area)
    log_area = math.log(max(area_km2, 0.05))
    inverse_scale = 1 - ((log_area - log_min) / (log_max - log_min))
    return int(round(90 + inverse_scale * 210))


def build_neighbors(gdf: gpd.GeoDataFrame) -> dict[str, list[str]]:
    codes = list(gdf["PRO_COM_T"].astype(str))
    geometries = list(gdf.geometry)
    neighbors = {code: set() for code in codes}

    for index, geometry in enumerate(geometries):
        code = codes[index]
        for compare_index in range(index + 1, len(geometries)):
            other_geometry = geometries[compare_index]
            shared_boundary_length = geometry.boundary.intersection(other_geometry.boundary).length
            if shared_boundary_length <= 0:
                continue
            other_code = codes[compare_index]
            neighbors[code].add(other_code)
            neighbors[other_code].add(code)

    return {code: sorted(values) for code, values in neighbors.items()}


def build_assets(source: Path, output_dir: Path, simplify_tolerance: float) -> None:
    gdf = gpd.read_file(f"zip://{source}!Com01012026_g/Com01012026_g_WGS84.shp")
    torino_projected = gdf[gdf["COD_PROV"] == TORINO_PROVINCE_CODE].copy()
    torino_projected = torino_projected.sort_values(["PRO_COM_T"])

    torino_projected["official_name"] = torino_projected["COMUNE"].map(fix_mojibake)
    torino_projected["area_km2"] = torino_projected.geometry.area / 1_000_000
    neighbors = build_neighbors(torino_projected)

    min_area = float(torino_projected["area_km2"].min())
    max_area = float(torino_projected["area_km2"].max())
    torino_projected["base_chips"] = torino_projected["area_km2"].map(
        lambda area: compute_base_chips(float(area), min_area, max_area)
    )
    torino_projected["size_quartile"] = pd.qcut(
        torino_projected["area_km2"].rank(method="first"),
        4,
        labels=[1, 2, 3, 4],
    ).astype(int)

    torino = torino_projected.copy()
    torino["geometry"] = torino["geometry"].simplify(simplify_tolerance, preserve_topology=True)
    torino = torino.to_crs(4326)

    municipalities: list[dict[str, object]] = []
    alias_index: dict[str, str] = {}
    geojson_rows: list[dict[str, object]] = []

    for row in torino.itertuples(index=False):
        code = str(row.PRO_COM_T)
        official_name = str(row.official_name)
        normalized_name = normalize_guess(official_name)
        representative_point = row.geometry.representative_point()

        aliases = sorted({normalize_guess(alias) for alias in MANUAL_ALIASES.get(code, []) if normalize_guess(alias)})
        municipalities.append(
            {
                "istatCode": code,
                "officialName": official_name,
                "normalizedName": normalized_name,
                "aliases": aliases,
                "areaKm2": round(float(row.area_km2), 3),
                "baseChips": int(row.base_chips),
                "sizeQuartile": int(row.size_quartile),
                "neighbors": neighbors[code],
                "focusPoint": {"lat": round(representative_point.y, 6), "lng": round(representative_point.x, 6)},
            }
        )

        geojson_rows.append(
            {
                "istatCode": code,
                "officialName": official_name,
                "geometry": row.geometry,
            }
        )

        for alias in aliases:
            alias_index[alias] = code

    municipalities_gdf = gpd.GeoDataFrame(geojson_rows, geometry="geometry", crs="EPSG:4326")
    outline_gdf = municipalities_gdf[["geometry"]].dissolve().reset_index(drop=True)
    outline_gdf["scope"] = "torino"

    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "torino-municipalities.geojson").write_text(
        json.dumps(feature_collection(municipalities_gdf), ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (output_dir / "torino-outline.geojson").write_text(
        json.dumps(feature_collection(outline_gdf), ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (output_dir / "torino-municipalities.json").write_text(
        json.dumps(
            {
                "label": "Provincia di Torino",
                "officialScopeLabel": "Citta Metropolitana di Torino",
                "sourceYear": 2026,
                "count": len(municipalities),
                "municipalities": municipalities,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (output_dir / "torino-aliases.json").write_text(
        json.dumps(alias_index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Build Torino municipalities SVG and metadata from ISTAT boundaries.")
    parser.add_argument("--source", type=Path, required=True, help="Path to the ISTAT zip archive.")
    parser.add_argument("--output-dir", type=Path, required=True, help="Directory where the generated assets should be written.")
    parser.add_argument(
        "--simplify-tolerance",
        type=float,
        default=DEFAULT_SIMPLIFY_TOLERANCE,
        help="Geometry simplification tolerance in source CRS units.",
    )
    args = parser.parse_args()

    build_assets(args.source, args.output_dir, args.simplify_tolerance)


if __name__ == "__main__":
    main()
