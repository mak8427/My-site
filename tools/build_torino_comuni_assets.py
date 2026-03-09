#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
import shutil
import unicodedata
from pathlib import Path

import geopandas as gpd
import pandas as pd


DEFAULT_SIMPLIFY_TOLERANCE = 140.0
DEFAULT_START_PROVINCE_CODE = "001"
PROJECTED_CRS = "EPSG:3035"

# Keep this intentionally small and unambiguous.
MANUAL_ALIASES: dict[str, list[str]] = {}
ALIAS_STOPWORDS = {"d", "da", "de", "dei", "del", "della", "delle", "di", "in", "nel", "sul", "sulla"}


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
        cleaned.append(ch if ch.isalnum() else " ")
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


def build_border_flags(gdf: gpd.GeoDataFrame, province_geometry) -> dict[str, bool]:
    province_boundary = province_geometry.boundary
    flags: dict[str, bool] = {}
    for row in gdf.itertuples(index=False):
        code = str(row.PRO_COM_T)
        shared_boundary_length = row.geometry.boundary.intersection(province_boundary).length
        flags[code] = shared_boundary_length > 0
    return flags


def province_slug(label: str) -> str:
    normalized = normalize_guess(label)
    return normalized.replace(" ", "-")


def build_player_label(info: pd.Series) -> str:
    return fix_mojibake(info["DEN_UTS"]) or str(info["COD_PROV"])


def build_official_scope_label(info: pd.Series) -> str:
    label = build_player_label(info)
    tipo = fix_mojibake(info["TIPO_UTS"]) or "Provincia"
    if "metropolitana" in tipo.lower():
        return f"Città Metropolitana di {label}"
    if label.startswith("Valle d'Aosta"):
        return label
    return f"Provincia di {label}"


def generate_alias_candidates(normalized_name: str) -> set[str]:
    aliases: set[str] = set()
    tokens = normalized_name.split()
    if len(tokens) > 1:
        aliases.add("".join(tokens))
        for length in range(1, len(tokens)):
            prefix_tokens = tokens[:length]
            if prefix_tokens[-1] in ALIAS_STOPWORDS:
                continue
            aliases.add(" ".join(prefix_tokens))
            if length > 1:
                aliases.add("".join(prefix_tokens))
    return {alias for alias in aliases if alias and alias != normalized_name}


def write_json(path: Path, payload: object, *, pretty: bool = False) -> None:
    if pretty:
        text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    else:
        text = json.dumps(payload, ensure_ascii=False) + "\n"
    path.write_text(text, encoding="utf-8")


def build_assets(source: Path, output_dir: Path, simplify_tolerance: float) -> None:
    municipality_gdf = gpd.read_file(f"zip://{source}!Com01012026_g/Com01012026_g_WGS84.shp")
    province_gdf = gpd.read_file(f"zip://{source}!ProvCM01012026_g/ProvCM01012026_g_WGS84.shp")

    municipalities_projected = municipality_gdf.to_crs(PROJECTED_CRS).sort_values(["COD_PROV", "PRO_COM_T"]).copy()
    municipalities_projected["official_name"] = municipalities_projected["COMUNE"].map(fix_mojibake)
    municipalities_projected["area_km2"] = municipalities_projected.geometry.area / 1_000_000
    min_area = float(municipalities_projected["area_km2"].min())
    max_area = float(municipalities_projected["area_km2"].max())
    municipalities_projected["base_chips"] = municipalities_projected["area_km2"].map(
        lambda area: compute_base_chips(float(area), min_area, max_area)
    )
    municipalities_projected["size_quartile"] = pd.qcut(
        municipalities_projected["area_km2"].rank(method="first"),
        4,
        labels=[1, 2, 3, 4],
    ).astype(int)

    province_projected = province_gdf.to_crs(PROJECTED_CRS).sort_values(["COD_PROV"]).copy()
    province_projected["provinceCode"] = province_projected["COD_PROV"].map(lambda value: f"{int(value):03d}")
    province_info = province_projected.copy()
    province_info = province_info.set_index("provinceCode")

    provinces_dir = output_dir / "provinces"
    if provinces_dir.exists():
        shutil.rmtree(provinces_dir)
    provinces_dir.mkdir(parents=True, exist_ok=True)

    manifest_entries: list[dict[str, object]] = []

    for province_code_number, subset_projected in municipalities_projected.groupby("COD_PROV", sort=True):
        province_code = f"{int(province_code_number):03d}"
        subset_projected = subset_projected.sort_values("PRO_COM_T").copy()
        subset_projected["size_decile"] = pd.qcut(
            subset_projected["area_km2"].rank(method="first"),
            10,
            labels=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ).astype(int)
        province_row = province_info.loc[province_code]
        player_label = build_player_label(province_row)
        official_scope_label = build_official_scope_label(province_row)
        slug = province_slug(player_label)
        neighbors = build_neighbors(subset_projected)
        border_flags = build_border_flags(subset_projected, province_row.geometry)

        subset_simplified = subset_projected.copy()
        subset_simplified["geometry"] = subset_simplified["geometry"].simplify(
            simplify_tolerance,
            preserve_topology=True,
        )
        subset_wgs = subset_simplified.to_crs(4326)

        municipalities: list[dict[str, object]] = []
        alias_index: dict[str, str] = {}
        alias_candidates_by_code: dict[str, set[str]] = {}
        alias_owners: dict[str, set[str]] = {}
        geojson_rows: list[dict[str, object]] = []

        for row in subset_wgs.itertuples(index=False):
            code = str(row.PRO_COM_T)
            official_name = str(row.official_name)
            normalized_name = normalize_guess(official_name)
            representative_point = row.geometry.representative_point()
            manual_aliases = {normalize_guess(alias) for alias in MANUAL_ALIASES.get(code, []) if normalize_guess(alias)}
            candidate_aliases = generate_alias_candidates(normalized_name) | manual_aliases
            alias_candidates_by_code[code] = candidate_aliases
            for alias in candidate_aliases:
                alias_owners.setdefault(alias, set()).add(code)

            municipalities.append(
                {
                    "istatCode": code,
                    "officialName": official_name,
                    "normalizedName": normalized_name,
                    "aliases": [],
                    "areaKm2": round(float(row.area_km2), 3),
                    "baseChips": int(row.base_chips),
                    "sizeQuartile": int(row.size_quartile),
                    "sizeDecile": int(row.size_decile),
                    "isBorderMunicipality": bool(border_flags[code]),
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

        for municipality in municipalities:
            code = municipality["istatCode"]
            aliases = sorted(
                alias
                for alias in alias_candidates_by_code.get(code, set())
                if len(alias_owners.get(alias, set())) == 1
            )
            municipality["aliases"] = aliases
            for alias in aliases:
                alias_index[alias] = code

        municipalities_gdf = gpd.GeoDataFrame(geojson_rows, geometry="geometry", crs="EPSG:4326")
        province_outline_projected = province_projected.loc[province_projected["provinceCode"] == province_code, ["geometry"]].copy()
        province_outline_projected["provinceCode"] = province_code
        province_outline_projected["geometry"] = province_outline_projected["geometry"].simplify(
            simplify_tolerance * 2,
            preserve_topology=True,
        )
        outline_gdf = province_outline_projected.to_crs(4326)

        province_dir = provinces_dir / f"{province_code}-{slug}"
        province_dir.mkdir(parents=True, exist_ok=True)
        metadata_path = province_dir / "municipalities.json"
        municipality_geo_path = province_dir / "municipalities.geojson"
        outline_path = province_dir / "outline.geojson"
        alias_path = province_dir / "aliases.json"

        write_json(
            metadata_path,
            {
                "provinceCode": province_code,
                "label": player_label,
                "officialScopeLabel": official_scope_label,
                "sigla": fix_mojibake(province_row["SIGLA"]) or "",
                "slug": slug,
                "sourceYear": 2026,
                "count": len(municipalities),
                "municipalities": municipalities,
            },
            pretty=True,
        )
        write_json(municipality_geo_path, feature_collection(municipalities_gdf))
        write_json(outline_path, feature_collection(outline_gdf))
        write_json(alias_path, alias_index, pretty=True)

        manifest_entries.append(
            {
                "provinceCode": province_code,
                "label": player_label,
                "officialScopeLabel": official_scope_label,
                "sigla": fix_mojibake(province_row["SIGLA"]) or "",
                "slug": slug,
                "count": len(municipalities),
                "assets": {
                    "metadata": f"./data/provinces/{province_code}-{slug}/municipalities.json",
                    "municipalities": f"./data/provinces/{province_code}-{slug}/municipalities.geojson",
                    "outline": f"./data/provinces/{province_code}-{slug}/outline.geojson",
                    "aliases": f"./data/provinces/{province_code}-{slug}/aliases.json",
                },
            }
        )

    manifest_entries.sort(key=lambda entry: entry["label"])
    manifest = {
        "sourceYear": 2026,
        "defaultProvinceCode": DEFAULT_START_PROVINCE_CODE,
        "count": len(manifest_entries),
        "provinces": manifest_entries,
    }
    write_json(output_dir / "provinces-manifest.json", manifest, pretty=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build province-scoped Italian municipality game assets from ISTAT boundaries.")
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
