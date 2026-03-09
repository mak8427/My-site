import { normalizeGuess, formatElapsed } from './js/normalize.js';
import { loadSession, saveSession, clearSession, loadBestTime, saveBestTime, loadBestScore, saveBestScore } from './js/storage.js';
import { LeafletMapController } from './js/map-controller.js';
import {
    createEmptyState,
    restoreState,
    registerCorrectGuess,
    registerMiss,
    completeIfNeeded,
    getElapsedMs
} from './js/game-state.js';
import {
    MODIFIER_POOL,
    formatMultiplier,
    getLiveMultiplier,
    getLiveStreak,
    getModifiersById,
    pickRunModifiers,
    scoreGuess
} from './js/scoring.js';

const numberFormatter = new Intl.NumberFormat('en-US');

const els = {
    scoreValue: document.getElementById('score-value'),
    multiplierValue: document.getElementById('multiplier-value'),
    streakValue: document.getElementById('streak-value'),
    foundCount: document.getElementById('found-count'),
    remainingCount: document.getElementById('remaining-count'),
    progressPercent: document.getElementById('progress-percent'),
    timerValue: document.getElementById('timer-value'),
    bestScore: document.getElementById('best-score'),
    bestTime: document.getElementById('best-time'),
    modifierTray: document.getElementById('modifier-tray'),
    modifierCount: document.getElementById('modifier-count'),
    modifierHelp: document.getElementById('modifier-help'),
    momentumLabel: document.getElementById('momentum-label'),
    scoreBreakdown: document.getElementById('score-breakdown'),
    foundList: document.getElementById('found-list'),
    foundListSummary: document.getElementById('found-list-summary'),
    feedback: document.getElementById('feedback'),
    guessForm: document.getElementById('guess-form'),
    guessInput: document.getElementById('guess-input'),
    resetButton: document.getElementById('reset-button'),
    resetViewButton: document.getElementById('reset-view-button'),
    mapCanvas: document.getElementById('map-canvas'),
    mapLoading: document.getElementById('map-loading'),
    mapHoverLabel: document.getElementById('map-hover-label'),
    scopeCopy: document.getElementById('scope-copy'),
    themeToggle: document.getElementById('theme-toggle'),
    scoreBurstLayer: document.getElementById('score-burst-layer'),
    runSummary: document.getElementById('run-summary'),
    summaryRank: document.getElementById('summary-rank'),
    summaryScore: document.getElementById('summary-score'),
    summaryMultiplier: document.getElementById('summary-multiplier'),
    summaryStreak: document.getElementById('summary-streak'),
    summaryTime: document.getElementById('summary-time')
};

const mapController = new LeafletMapController({
    container: els.mapCanvas,
    hoverLabel: els.mapHoverLabel
});

let dataset;
let municipalities;
let codeIndex;
let answerIndex;
let state = createEmptyState();
let bestTime = loadBestTime();
let bestScore = loadBestScore();
let lastScoreEvent = null;

function formatPoints(value) {
    return numberFormatter.format(Math.round(value));
}

function setThemeFromStorage() {
    const saved = window.localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
}

function bindThemeToggle() {
    setThemeFromStorage();
    els.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
        mapController.refreshTheme();
    });
}

function setFeedback(message, stateName = '') {
    els.feedback.textContent = message;
    if (stateName) {
        els.feedback.dataset.state = stateName;
    } else {
        delete els.feedback.dataset.state;
    }
}

function buildAnswerIndex(metadata, aliases) {
    const index = new Map();
    metadata.forEach(entry => {
        index.set(entry.normalizedName, entry.istatCode);
        entry.aliases.forEach(alias => index.set(alias, entry.istatCode));
    });
    Object.entries(aliases).forEach(([alias, code]) => {
        index.set(alias, code);
    });
    return index;
}

function persistState() {
    saveSession(state);
}

function ensureRunModifiers() {
    const validIds = new Set(MODIFIER_POOL.map(modifier => modifier.id));
    const current = Array.isArray(state.activeModifiers) ? state.activeModifiers.filter(id => validIds.has(id)) : [];
    if (current.length === 3) {
        state.activeModifiers = current;
        return;
    }
    state.activeModifiers = pickRunModifiers();
    persistState();
}

function renderModifiers() {
    const modifiers = getModifiersById(state.activeModifiers);
    els.modifierTray.innerHTML = '';
    modifiers.forEach(modifier => {
        const card = document.createElement('article');
        card.className = 'modifier-chip';
        card.innerHTML = `
            <span class="modifier-chip__name">${modifier.name}</span>
            <span class="modifier-chip__description">${modifier.description}</span>
        `;
        els.modifierTray.appendChild(card);
    });
    els.modifierCount.textContent = `${modifiers.length} active`;
}

function renderStats() {
    const found = state.foundCodes.length;
    const total = municipalities.length;
    const remaining = total - found;
    const progress = total === 0 ? 0 : Math.round((found / total) * 100);
    els.scoreValue.textContent = formatPoints(state.score);
    els.multiplierValue.textContent = formatMultiplier(getLiveMultiplier(state));
    els.streakValue.textContent = String(getLiveStreak(state));
    els.foundCount.textContent = String(found);
    els.remainingCount.textContent = String(remaining);
    els.progressPercent.textContent = `${progress}%`;
    els.foundListSummary.textContent = `${found} guessed`;
    els.bestScore.textContent = bestScore ? formatPoints(bestScore.score) : '0';
    els.bestTime.textContent = bestTime ? formatElapsed(bestTime.elapsedMs) : 'None yet';
}

function renderTimer() {
    els.timerValue.textContent = formatElapsed(getElapsedMs(state));
    els.multiplierValue.textContent = formatMultiplier(getLiveMultiplier(state));
    els.streakValue.textContent = String(getLiveStreak(state));
}

function renderMomentum() {
    if (!lastScoreEvent) {
        els.momentumLabel.textContent = 'Build the first chain';
        els.scoreBreakdown.textContent = 'Small municipalities are worth more chips. Fast guesses keep the multiplier alive.';
        return;
    }

    els.momentumLabel.textContent = `+${formatPoints(lastScoreEvent.points)} at ${formatMultiplier(lastScoreEvent.multiplier)}`;
    els.scoreBreakdown.textContent = lastScoreEvent.tags.join(' · ');
}

function renderFoundList() {
    els.foundList.innerHTML = '';
    state.foundCodes.forEach((code, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        const name = codeIndex.get(code).officialName;
        button.type = 'button';
        button.innerHTML = `<span class="list-index">${String(index + 1).padStart(3, '0')}</span><span>${name}</span>`;
        button.addEventListener('click', () => {
            mapController.focusCode(code);
        });
        item.appendChild(button);
        els.foundList.appendChild(item);
    });
}

function renderFoundMapState() {
    mapController.setFoundCodes(state.foundCodes);
    if (state.lastFoundCode) {
        mapController.focusCode(state.lastFoundCode);
    }
}

function renderSummary() {
    if (!state.completedAt) {
        els.runSummary.hidden = true;
        return;
    }

    els.runSummary.hidden = false;
    els.summaryScore.textContent = formatPoints(state.score);
    els.summaryMultiplier.textContent = formatMultiplier(state.highestMultiplier);
    els.summaryStreak.textContent = String(state.longestStreak);
    els.summaryTime.textContent = formatElapsed(getElapsedMs(state));
    els.summaryRank.textContent = bestScore && bestScore.score === state.score ? 'New high score' : 'Complete';
}

function renderAll() {
    renderStats();
    renderFoundList();
    renderTimer();
    renderModifiers();
    renderMomentum();
    renderSummary();
}

function spawnScoreBurst(event, municipalityName) {
    const burst = document.createElement('div');
    burst.className = 'score-burst';
    burst.innerHTML = `
        <span class="score-burst__points">+${formatPoints(event.points)} ${formatMultiplier(event.multiplier)}</span>
        <span class="score-burst__meta">${municipalityName} · ${event.tags.slice(0, 3).join(' · ')}</span>
    `;
    els.scoreBurstLayer.appendChild(burst);
    window.setTimeout(() => burst.remove(), 1900);
}

function handleCompletion() {
    const elapsedMs = getElapsedMs(state);
    if (!bestTime || elapsedMs < bestTime.elapsedMs) {
        bestTime = {
            elapsedMs,
            completedAt: state.completedAt
        };
        saveBestTime(bestTime);
    }

    if (!bestScore || state.score > bestScore.score) {
        bestScore = {
            score: state.score,
            completedAt: state.completedAt
        };
        saveBestScore(bestScore);
    }
}

function submitGuess(rawGuess) {
    const guess = normalizeGuess(rawGuess);
    if (!guess) {
        setFeedback('Type a municipality name first.', 'error');
        return;
    }

    const code = answerIndex.get(guess);
    if (!code) {
        registerMiss(state);
        persistState();
        renderStats();
        setFeedback(`"${rawGuess}" is not in the current scope. Streak broken.`, 'error');
        return;
    }

    if (state.foundCodes.includes(code)) {
        setFeedback(`${codeIndex.get(code).officialName} was already found.`, 'duplicate');
        mapController.focusCode(code);
        return;
    }

    const entry = codeIndex.get(code);
    const lastEntry = state.lastFoundCode ? codeIndex.get(state.lastFoundCode) : null;
    const timestamp = Date.now();
    const scoreEvent = scoreGuess({
        state,
        entry,
        lastEntry,
        timestamp
    });

    registerCorrectGuess(state, {
        code,
        points: scoreEvent.points,
        streak: scoreEvent.streak,
        multiplier: scoreEvent.multiplier,
        timestamp
    });
    completeIfNeeded(state, municipalities.length);
    persistState();

    lastScoreEvent = scoreEvent;
    mapController.markFound(code);
    mapController.focusCode(code);
    renderAll();
    spawnScoreBurst(scoreEvent, entry.officialName);

    if (state.completedAt) {
        handleCompletion();
        renderStats();
        renderSummary();
        setFeedback(`You found ${entry.officialName} and finished with ${formatPoints(state.score)} points.`, 'success');
    } else {
        setFeedback(
            `Correct: ${entry.officialName}. +${formatPoints(scoreEvent.points)} at ${formatMultiplier(scoreEvent.multiplier)}.`,
            'success'
        );
    }
}

function bindUi() {
    els.guessForm.addEventListener('submit', event => {
        event.preventDefault();
        const rawGuess = els.guessInput.value.trim();
        submitGuess(rawGuess);
        els.guessInput.value = '';
        els.guessInput.focus();
    });

    els.resetButton.addEventListener('click', () => {
        const shouldReset = window.confirm('Reset your current progress, score, modifiers, and timer for Provincia di Torino?');
        if (!shouldReset) {
            return;
        }
        clearSession();
        state = createEmptyState();
        lastScoreEvent = null;
        window.location.reload();
    });

    els.resetViewButton.addEventListener('click', () => {
        mapController.resetView();
    });
}

function startTimerLoop() {
    window.setInterval(() => {
        renderTimer();
    }, 250);
}

async function loadAssets() {
    const [datasetResponse, aliasesResponse, municipalityGeoJsonResponse, outlineGeoJsonResponse] = await Promise.all([
        fetch('./data/torino-municipalities.json'),
        fetch('./data/torino-aliases.json'),
        fetch('./data/torino-municipalities.geojson'),
        fetch('./data/torino-outline.geojson')
    ]);

    if (!datasetResponse.ok || !aliasesResponse.ok || !municipalityGeoJsonResponse.ok || !outlineGeoJsonResponse.ok) {
        throw new Error('One or more assets failed to load.');
    }

    const [datasetJson, aliasesJson, municipalityGeoJson, outlineGeoJson] = await Promise.all([
        datasetResponse.json(),
        aliasesResponse.json(),
        municipalityGeoJsonResponse.json(),
        outlineGeoJsonResponse.json()
    ]);

    return { datasetJson, aliasesJson, municipalityGeoJson, outlineGeoJson };
}

async function init() {
    bindThemeToggle();
    bindUi();
    startTimerLoop();

    try {
        const { datasetJson, aliasesJson, municipalityGeoJson, outlineGeoJson } = await loadAssets();
        dataset = datasetJson;
        municipalities = dataset.municipalities;
        codeIndex = new Map(municipalities.map(entry => [entry.istatCode, entry]));
        answerIndex = buildAnswerIndex(municipalities, aliasesJson);
        state = restoreState(loadSession(), municipalities.map(entry => entry.istatCode));
        ensureRunModifiers();
        els.scopeCopy.textContent = `Official map scope: ${dataset.officialScopeLabel}, ${dataset.count} municipalities. Small municipalities award more chips.`;
        if (state.completedAt) {
            handleCompletion();
        }

        await mapController.load({
            municipalityGeoJson,
            outlineGeoJson,
            municipalities,
            onActivate(code) {
                mapController.focusCode(code);
                const entry = codeIndex.get(code);
                const found = state.foundCodes.includes(code);
                setFeedback(found ? `Focused: ${entry.officialName}.` : 'Borders focused. Name stays hidden until guessed.', found ? 'success' : '');
            }
        });

        renderFoundMapState();
        renderAll();
        mapController.refreshTheme();
        els.mapLoading.remove();
    } catch (error) {
        console.error(error);
        setFeedback('The map assets could not be loaded.', 'error');
        els.mapLoading.textContent = 'Failed to load map assets.';
    }
}

init();
