const PREFIX = 'guess-prov:v1';
const LEGACY_SESSION_KEY = 'torino-comuni:v1:session';
const LEGACY_BEST_TIME_KEY = 'torino-comuni:v1:best-time';
const LEGACY_BEST_SCORE_KEY = 'torino-comuni:v1:best-score';
const LEGACY_BEST_KEY = 'torino-comuni:v1:best';
const LAST_PROVINCE_KEY = `${PREFIX}:last-province`;
const LANGUAGE_KEY = `${PREFIX}:language`;

function readJson(key, fallback) {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJson(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

function provinceKey(kind, provinceCode) {
    return `${PREFIX}:${kind}:${provinceCode}`;
}

export function loadSession(provinceCode) {
    if (provinceCode === '001') {
        return readJson(provinceKey('session', provinceCode), readJson(LEGACY_SESSION_KEY, null));
    }
    return readJson(provinceKey('session', provinceCode), null);
}

export function saveSession(provinceCode, value) {
    writeJson(provinceKey('session', provinceCode), value);
}

export function clearSession(provinceCode) {
    window.localStorage.removeItem(provinceKey('session', provinceCode));
}

export function loadBestTime(provinceCode) {
    if (provinceCode === '001') {
        return readJson(provinceKey('best-time', provinceCode), readJson(LEGACY_BEST_TIME_KEY, readJson(LEGACY_BEST_KEY, null)));
    }
    return readJson(provinceKey('best-time', provinceCode), null);
}

export function saveBestTime(provinceCode, value) {
    writeJson(provinceKey('best-time', provinceCode), value);
}

export function loadBestScore(provinceCode) {
    if (provinceCode === '001') {
        return readJson(provinceKey('best-score', provinceCode), readJson(LEGACY_BEST_SCORE_KEY, null));
    }
    return readJson(provinceKey('best-score', provinceCode), null);
}

export function saveBestScore(provinceCode, value) {
    writeJson(provinceKey('best-score', provinceCode), value);
}

export function loadLastProvince(defaultProvinceCode) {
    return window.localStorage.getItem(LAST_PROVINCE_KEY) || defaultProvinceCode;
}

export function saveLastProvince(provinceCode) {
    window.localStorage.setItem(LAST_PROVINCE_KEY, provinceCode);
}

export function loadLanguage(defaultLanguage = 'en') {
    return window.localStorage.getItem(LANGUAGE_KEY) || defaultLanguage;
}

export function saveLanguage(language) {
    window.localStorage.setItem(LANGUAGE_KEY, language);
}
