export function createEmptyState() {
    return {
        foundCodes: [],
        startedAt: null,
        completedAt: null,
        lastFoundCode: null,
        score: 0,
        activeStreak: 0,
        longestStreak: 0,
        highestMultiplier: 1,
        lastCorrectAt: null,
        activeModifiers: []
    };
}

export function restoreState(rawState, validCodes) {
    const validSet = new Set(validCodes);
    if (!rawState || typeof rawState !== 'object') {
        return createEmptyState();
    }

    const foundCodes = Array.isArray(rawState.foundCodes)
        ? rawState.foundCodes.filter(code => validSet.has(code))
        : [];

    const state = {
        ...createEmptyState(),
        foundCodes: Array.from(new Set(foundCodes)),
        startedAt: foundCodes.length > 0 && Number.isFinite(rawState.startedAt) ? rawState.startedAt : null,
        completedAt:
            foundCodes.length === validSet.size && Number.isFinite(rawState.completedAt) ? rawState.completedAt : null,
        lastFoundCode: validSet.has(rawState.lastFoundCode) ? rawState.lastFoundCode : null,
        score: Number.isFinite(rawState.score) ? Math.max(0, Math.round(rawState.score)) : 0,
        activeStreak: Number.isFinite(rawState.activeStreak) ? Math.max(0, Math.round(rawState.activeStreak)) : 0,
        longestStreak: Number.isFinite(rawState.longestStreak) ? Math.max(0, Math.round(rawState.longestStreak)) : 0,
        highestMultiplier: Number.isFinite(rawState.highestMultiplier)
            ? Math.max(1, Number(rawState.highestMultiplier))
            : 1,
        lastCorrectAt: Number.isFinite(rawState.lastCorrectAt) ? rawState.lastCorrectAt : null,
        activeModifiers: Array.isArray(rawState.activeModifiers) ? rawState.activeModifiers.slice(0, 3) : []
    };

    return state;
}

export function getElapsedMs(state, now = Date.now()) {
    if (!state.startedAt) {
        return 0;
    }
    const end = state.completedAt || now;
    return Math.max(0, end - state.startedAt);
}

export function beginRunIfNeeded(state) {
    if (!state.startedAt) {
        state.startedAt = Date.now();
    }
    return state;
}

export function addFoundCode(state, code) {
    if (!state.foundCodes.includes(code)) {
        state.foundCodes.push(code);
        state.lastFoundCode = code;
    }
    return state;
}

export function registerCorrectGuess(state, { code, points, streak, multiplier, timestamp }) {
    beginRunIfNeeded(state);
    addFoundCode(state, code);
    state.score += Math.max(0, Math.round(points));
    state.activeStreak = Math.max(0, streak);
    state.longestStreak = Math.max(state.longestStreak, state.activeStreak);
    state.highestMultiplier = Math.max(state.highestMultiplier, Number(multiplier) || 1);
    state.lastCorrectAt = timestamp;
    return state;
}

export function registerMiss(state) {
    state.activeStreak = 0;
    state.lastCorrectAt = null;
    return state;
}

export function completeIfNeeded(state, totalCount) {
    if (state.completedAt || state.foundCodes.length !== totalCount) {
        return state;
    }
    state.completedAt = Date.now();
    return state;
}
