const SESSION_KEY = 'torino-comuni:v1:session';
const BEST_TIME_KEY = 'torino-comuni:v1:best-time';
const BEST_SCORE_KEY = 'torino-comuni:v1:best-score';
const LEGACY_BEST_KEY = 'torino-comuni:v1:best';

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

export function loadSession() {
    return readJson(SESSION_KEY, null);
}

export function saveSession(value) {
    writeJson(SESSION_KEY, value);
}

export function clearSession() {
    window.localStorage.removeItem(SESSION_KEY);
}

export function loadBestTime() {
    return readJson(BEST_TIME_KEY, readJson(LEGACY_BEST_KEY, null));
}

export function saveBestTime(value) {
    writeJson(BEST_TIME_KEY, value);
}

export function loadBestScore() {
    return readJson(BEST_SCORE_KEY, null);
}

export function saveBestScore(value) {
    writeJson(BEST_SCORE_KEY, value);
}
