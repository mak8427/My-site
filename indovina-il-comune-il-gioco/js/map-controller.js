function readCssVar(name, fallback) {
    const value = getComputedStyle(document.body).getPropertyValue(name).trim();
    return value || fallback;
}

const DEFAULT_MESSAGES = {
    hoverDefault: 'Borders are visible. Names stay hidden until guessed.',
    hiddenMunicipality: 'Hidden municipality'
};

export class LeafletMapController {
    constructor({ container, hoverLabel }) {
        this.container = container;
        this.hoverLabel = hoverLabel;
        this.map = null;
        this.outlineLayer = null;
        this.municipalityLayer = null;
        this.layerIndex = new Map();
        this.metaIndex = new Map();
        this.foundCodes = new Set();
        this.activeCode = null;
        this.onActivate = null;
        this.messages = { ...DEFAULT_MESSAGES };
    }

    setMessages(messages = {}) {
        this.messages = { ...DEFAULT_MESSAGES, ...messages };
        this.setHoverText(this.messages.hoverDefault);
    }

    destroy() {
        if (this.map) {
            this.map.remove();
        }
        this.map = null;
        this.outlineLayer = null;
        this.municipalityLayer = null;
        this.layerIndex.clear();
        this.metaIndex.clear();
        this.foundCodes = new Set();
        this.activeCode = null;
        this.container.innerHTML = '';
    }

    async load({ municipalityGeoJson, outlineGeoJson, municipalities, onActivate, messages }) {
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet is not available.');
        }

        if (this.map) {
            this.destroy();
        }

        this.setMessages(messages);
        this.onActivate = onActivate;
        this.metaIndex = new Map(municipalities.map(entry => [entry.istatCode, entry]));
        this.layerIndex.clear();

        this.map = window.L.map(this.container, {
            attributionControl: true,
            preferCanvas: true,
            scrollWheelZoom: true,
            zoomControl: false,
            zoomSnap: 0.25,
            zoomDelta: 0.5
        });

        window.L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        this.outlineLayer = window.L.geoJSON(outlineGeoJson, {
            interactive: false,
            style: () => this.getOutlineStyle()
        }).addTo(this.map);

        this.municipalityLayer = window.L.geoJSON(municipalityGeoJson, {
            style: feature => this.getMunicipalityStyle(feature.properties.istatCode),
            onEachFeature: (feature, layer) => this.bindFeature(feature, layer)
        }).addTo(this.map);

        const bounds = this.outlineLayer.getBounds();
        if (bounds.isValid()) {
            this.map.fitBounds(bounds.pad(0.04), { animate: false });
            this.map.setMaxBounds(bounds.pad(0.22));
        }

        this.setHoverText(this.messages.hoverDefault);
    }

    bindFeature(feature, layer) {
        const code = feature.properties.istatCode;
        this.layerIndex.set(code, layer);

        layer.on('mouseover', () => {
            const isFound = this.foundCodes.has(code);
            this.setHoverText(isFound ? this.metaIndex.get(code).officialName : this.messages.hiddenMunicipality);
            layer.setStyle(this.getMunicipalityStyle(code, { hovered: true }));
            if (!window.L.Browser.ie && !window.L.Browser.opera && !window.L.Browser.edge) {
                layer.bringToFront();
            }
        });

        layer.on('mouseout', () => {
            this.setHoverText(this.messages.hoverDefault);
            this.applyStyle(code);
        });

        layer.on('click', () => {
            if (this.onActivate) {
                this.onActivate(code);
            }
        });
    }

    getThemeColors() {
        return {
            surface: readCssVar('--map-surface', '#f7f2e8'),
            boundaryStrong: readCssVar('--map-boundary-strong', '#4e4334'),
            boundarySoft: readCssVar('--map-boundary-soft', 'rgba(141, 131, 114, 0.55)'),
            unknownFill: readCssVar('--map-unknown-fill', 'rgba(255, 251, 243, 0.65)'),
            foundFill: readCssVar('--found', '#b45309'),
            activeFill: readCssVar('--active', '#dc2626')
        };
    }

    getOutlineStyle() {
        const colors = this.getThemeColors();
        return {
            color: colors.boundaryStrong,
            weight: 2.4,
            opacity: 0.95,
            fill: false,
            lineJoin: 'round'
        };
    }

    getMunicipalityStyle(code, { hovered = false } = {}) {
        const colors = this.getThemeColors();
        const isFound = this.foundCodes.has(code);
        const isActive = this.activeCode === code;

        if (isActive) {
            return {
                color: colors.boundaryStrong,
                weight: hovered ? 2.3 : 2,
                opacity: 1,
                fillColor: colors.activeFill,
                fillOpacity: 0.82
            };
        }

        if (isFound) {
            return {
                color: colors.boundaryStrong,
                weight: hovered ? 1.8 : 1.5,
                opacity: 0.95,
                fillColor: colors.foundFill,
                fillOpacity: hovered ? 0.88 : 0.76
            };
        }

        return {
            color: hovered ? colors.boundaryStrong : colors.boundarySoft,
            weight: hovered ? 1.4 : 1,
            opacity: hovered ? 0.95 : 0.9,
            fillColor: colors.unknownFill,
            fillOpacity: hovered ? 0.24 : 0.12
        };
    }

    setHoverText(value) {
        if (this.hoverLabel) {
            this.hoverLabel.textContent = value;
        }
    }

    setFoundCodes(codes) {
        this.foundCodes = new Set(codes);
        this.refreshTheme();
    }

    markFound(code) {
        this.foundCodes.add(code);
        this.applyStyle(code);
    }

    setActive(code) {
        const previous = this.activeCode;
        this.activeCode = code;
        if (previous && previous !== code) {
            this.applyStyle(previous);
        }
        this.applyStyle(code);
    }

    applyStyle(code) {
        const layer = this.layerIndex.get(code);
        if (layer) {
            layer.setStyle(this.getMunicipalityStyle(code));
        }
    }

    focusCode(code) {
        const layer = this.layerIndex.get(code);
        if (!layer || !this.map) {
            return;
        }

        this.setActive(code);
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
            this.map.fitBounds(bounds.pad(1.4), {
                animate: true,
                duration: 0.5,
                maxZoom: 12.5
            });
        }
    }

    resetView() {
        if (!this.outlineLayer || !this.map) {
            return;
        }
        const bounds = this.outlineLayer.getBounds();
        if (bounds.isValid()) {
            this.map.fitBounds(bounds.pad(0.04), {
                animate: true,
                duration: 0.5
            });
        }
    }

    refreshTheme() {
        if (!this.map) {
            return;
        }

        this.container.style.backgroundColor = this.getThemeColors().surface;

        if (this.outlineLayer) {
            this.outlineLayer.setStyle(this.getOutlineStyle());
        }

        this.layerIndex.forEach((_layer, code) => {
            this.applyStyle(code);
        });
    }
}
