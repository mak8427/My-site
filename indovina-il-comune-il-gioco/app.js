import { normalizeGuess, formatElapsed } from './js/normalize.js';
import {
    loadSession,
    saveSession,
    clearSession,
    loadBestTime,
    saveBestTime,
    loadBestScore,
    saveBestScore,
    loadLastProvince,
    saveLastProvince,
    loadLanguage,
    saveLanguage
} from './js/storage.js';
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

const BRAND_NAME = 'Indovina il comune! Il gioco';
const APP_PATH = '/indovina-il-comune-il-gioco/';

const TRANSLATIONS = {
    en: {
        titlePrefix: BRAND_NAME,
        heroEyebrow: BRAND_NAME,
        heroLede: 'Pick a province, reveal the municipalities on the map, and chase score, multiplier, and speed.',
        backToWebsite: 'Back to website',
        theme: 'Theme',
        resetRun: 'Reset run',
        chooseProvinceEyebrow: 'Choose Province',
        chooseProvinceTitle: 'Which province do you want to play?',
        chooseProvinceCopy: 'Search by province name or abbreviation, then load that province into the map.',
        provincePlaceholder: 'Type a province',
        loadProvince: 'Load province',
        modifiersTitle: 'Run Modifiers',
        modifierHelp: 'Smaller municipalities are worth more chips. Each new run draws three scoring modifiers.',
        momentumEyebrow: 'Momentum',
        initialMomentumLabel: 'Build the first chain',
        initialMomentumCopy: 'Hit quick guesses, link neighboring municipalities, and stack multiplier for bigger scores.',
        found: 'Found',
        remaining: 'Remaining',
        progress: 'Progress',
        timer: 'Timer',
        bestScore: 'Best score',
        bestTime: 'Best local time',
        mapHoverDefault: 'Borders are visible. Names stay hidden until guessed.',
        hiddenMunicipality: 'Hidden municipality',
        resetMapView: 'Reset map view',
        currentProvince: 'Current province',
        scopeCopy: ({ officialScopeLabel, count }) => `Official map scope: ${officialScopeLabel}. ${count} municipalities.`,
        score: 'Score',
        multiplier: 'Multiplier',
        streak: 'Streak',
        guessPlaceholder: 'Type a municipality name',
        guess: 'Guess',
        startTyping: 'Start typing to begin.',
        legendUnguessed: 'Unguessed',
        legendFound: 'Found',
        legendFocused: 'Focused',
        summaryTitle: 'Run Summary',
        summaryComplete: 'Complete',
        summaryNewHighScore: 'New high score',
        summaryFinalScore: 'Final score',
        summaryTopMultiplier: 'Top multiplier',
        summaryLongestStreak: 'Longest streak',
        summaryFinishTime: 'Finish time',
        foundMunicipalities: 'Found municipalities',
        guessedCount: ({ count }) => `${count} guessed`,
        activeModifiers: ({ count }) => `${count} active`,
        noneYet: 'None yet',
        switchLanguageLabel: ({ language }) => `Switch to ${language}`,
        languageButton: ({ language, flag }) => `${language} ${flag}`,
        loadingProvince: ({ label }) => `Loading ${label}…`,
        provinceNotFound: ({ value }) => `Could not match "${value}" to a province.`,
        focusFound: ({ name }) => `Focused: ${name}.`,
        focusHidden: 'Borders focused. Name stays hidden until guessed.',
        invalidGuess: ({ value }) => `"${value}" is not in the current province. Streak broken.`,
        duplicateGuess: ({ name }) => `${name} was already found.`,
        correctGuess: ({ name, points, multiplier }) => `Correct: ${name}. +${points} at ${multiplier}.`,
        completedGuess: ({ name, score }) => `You found ${name} and finished with ${score} points.`,
        resetConfirm: ({ label }) => `Reset your current progress, score, modifiers, and timer for ${label}?`,
        loadFailure: 'Failed to load province data.',
        areaTag: ({ value }) => `AREA ${value}`,
        tag_LINK: 'LINK',
        tag_TOUCH: 'TOUCH',
        tag_SMALL_TOWN: 'SMALL TOWN',
        tag_NEIGHBOR_CHAIN: 'NEIGHBOR CHAIN',
        tag_FRONTIER: 'FRONTIER',
        tag_LETTER: 'LETTER',
        tag_FAST: 'FAST',
        tag_RING: 'RING',
        tag_CROSSROADS: 'CROSSROADS',
        tag_BACK_TO_BACK: 'BACK TO BACK',
        tag_NEEDLE: 'NEEDLE',
        tag_RECOVERY: 'RECOVERY',
        tag_LONG_NAME: 'LONG NAME',
        tag_SHARP: 'SHARP',
        tag_OUTER_RING: 'OUTER RING',
        tag_CENTER: 'CENTER',
        tag_ASCEND: 'ASCEND',
        tag_ISLAND: 'ISLAND',
        modifierNames: {
            'small-town-fever': { name: 'Small Town Fever', description: 'Smallest-quartile municipalities add +120 chips.' },
            'neighbor-chain': { name: 'Neighbor Chain', description: 'Guessing a municipality next to the previous one adds +90 chips.' },
            'frontier-run': { name: 'Frontier Run', description: 'Any municipality touching your frontier adds +45 chips.' },
            'letter-ladder': { name: 'Letter Ladder', description: 'Matching the previous initial adds +0.45 multiplier.' },
            'fast-hands': { name: 'Fast Hands', description: 'Correct guesses inside 4.5 seconds add +0.35 multiplier.' },
            'border-ring': { name: 'Border Ring', description: 'Each neighboring found municipality adds +18 chips, up to +126.' },
            crossroads: { name: 'Crossroads', description: 'Municipalities touching 3 or more found neighbors add +110 chips.' },
            'back-to-back': { name: 'Back-to-Back', description: 'Correct guesses within 3 seconds add +0.40 multiplier.' },
            'needle-eye': { name: 'Needle Eye', description: 'Smallest-decile municipalities add +160 chips.' },
            'recovery-line': { name: 'Recovery Line', description: 'The first correct guess after a miss adds +90 chips and +0.25 multiplier.' },
            'long-name': { name: 'Long Name', description: 'Municipality names with 14 or more letters add +75 chips.' },
            'sharp-vowels': { name: 'Sharp Vowels', description: 'Names with 4 or fewer vowels add +65 chips.' },
            'outer-ring': { name: 'Outer Ring', description: 'Border municipalities add +85 chips.' },
            'central-hit': { name: 'Central Hit', description: 'Interior municipalities add +70 chips.' },
            'alphabet-climb': { name: 'Alphabet Climb', description: 'A higher starting letter than the previous guess adds +0.30 multiplier.' },
            'island-hop': { name: 'Island Hop', description: 'Correct isolated guesses add +120 chips.' }
        }
    },
    it: {
        titlePrefix: BRAND_NAME,
        heroEyebrow: BRAND_NAME,
        heroLede: 'Scegli una provincia, rivela i comuni sulla mappa e punta a punteggio, moltiplicatore e velocità.',
        backToWebsite: 'Torna al sito',
        theme: 'Tema',
        resetRun: 'Reset run',
        chooseProvinceEyebrow: 'Scegli Provincia',
        chooseProvinceTitle: 'Quale provincia vuoi giocare?',
        chooseProvinceCopy: 'Cerca per nome o sigla, poi carica quella provincia nella mappa.',
        provincePlaceholder: 'Scrivi una provincia',
        loadProvince: 'Carica provincia',
        modifiersTitle: 'Modificatori del run',
        modifierHelp: 'I comuni più piccoli valgono più chips. Ogni nuovo run pesca tre modificatori.',
        momentumEyebrow: 'Slancio',
        initialMomentumLabel: 'Costruisci la prima catena',
        initialMomentumCopy: 'Fai guess veloci, collega comuni confinanti e accumula moltiplicatore per salire di punteggio.',
        found: 'Trovati',
        remaining: 'Rimanenti',
        progress: 'Progresso',
        timer: 'Timer',
        bestScore: 'Miglior punteggio',
        bestTime: 'Miglior tempo locale',
        mapHoverDefault: 'I confini sono visibili. I nomi restano nascosti finché non li indovini.',
        hiddenMunicipality: 'Comune nascosto',
        resetMapView: 'Reset mappa',
        currentProvince: 'Provincia attuale',
        scopeCopy: ({ officialScopeLabel, count }) => `Ambito ufficiale della mappa: ${officialScopeLabel}. ${count} comuni.`,
        score: 'Punteggio',
        multiplier: 'Moltiplicatore',
        streak: 'Serie',
        guessPlaceholder: 'Scrivi un comune',
        guess: 'Indovina',
        startTyping: 'Inizia a scrivere per partire.',
        legendUnguessed: 'Non indovinato',
        legendFound: 'Trovato',
        legendFocused: 'Selezionato',
        summaryTitle: 'Riepilogo run',
        summaryComplete: 'Completato',
        summaryNewHighScore: 'Nuovo record',
        summaryFinalScore: 'Punteggio finale',
        summaryTopMultiplier: 'Moltiplicatore max',
        summaryLongestStreak: 'Serie più lunga',
        summaryFinishTime: 'Tempo finale',
        foundMunicipalities: 'Comuni trovati',
        guessedCount: ({ count }) => `${count} trovati`,
        activeModifiers: ({ count }) => `${count} attivi`,
        noneYet: 'Ancora nessuno',
        switchLanguageLabel: ({ language }) => `Passa a ${language}`,
        languageButton: ({ language, flag }) => `${language} ${flag}`,
        loadingProvince: ({ label }) => `Carico ${label}…`,
        provinceNotFound: ({ value }) => `Non riesco ad associare "${value}" a una provincia.`,
        focusFound: ({ name }) => `Selezionato: ${name}.`,
        focusHidden: 'Confini selezionati. Il nome resta nascosto finché non lo indovini.',
        invalidGuess: ({ value }) => `"${value}" non appartiene alla provincia attuale. Serie interrotta.`,
        duplicateGuess: ({ name }) => `${name} era già stato trovato.`,
        correctGuess: ({ name, points, multiplier }) => `Corretto: ${name}. +${points} a ${multiplier}.`,
        completedGuess: ({ name, score }) => `Hai trovato ${name} e chiuso il run con ${score} punti.`,
        resetConfirm: ({ label }) => `Vuoi resettare progresso, punteggio, modificatori e timer per ${label}?`,
        loadFailure: 'Impossibile caricare i dati della provincia.',
        areaTag: ({ value }) => `AREA ${value}`,
        tag_LINK: 'LINK',
        tag_TOUCH: 'BORDO',
        tag_SMALL_TOWN: 'PICCOLO COMUNE',
        tag_NEIGHBOR_CHAIN: 'CATENA VICINA',
        tag_FRONTIER: 'FRONTIERA',
        tag_LETTER: 'LETTERA',
        tag_FAST: 'VELOCE',
        tag_RING: 'ANELLO',
        tag_CROSSROADS: 'INCROCIO',
        tag_BACK_TO_BACK: 'UNO DI FILA',
        tag_NEEDLE: 'AGO',
        tag_RECOVERY: 'RECUPERO',
        tag_LONG_NAME: 'NOME LUNGO',
        tag_SHARP: 'SECCO',
        tag_OUTER_RING: 'BORDO ESTERNO',
        tag_CENTER: 'CENTRO',
        tag_ASCEND: 'ASCESA',
        tag_ISLAND: 'ISOLA',
        modifierNames: {
            'small-town-fever': { name: 'Piccolo Comune', description: 'I comuni nel quartile più piccolo aggiungono +120 chips.' },
            'neighbor-chain': { name: 'Catena Vicina', description: 'Un comune confinante con il precedente aggiunge +90 chips.' },
            'frontier-run': { name: 'Run di Frontiera', description: 'Ogni comune che tocca la tua frontiera aggiunge +45 chips.' },
            'letter-ladder': { name: 'Scala di Lettere', description: 'La stessa iniziale del guess precedente aggiunge +0.45 al moltiplicatore.' },
            'fast-hands': { name: 'Mani Veloci', description: 'Un guess corretto entro 4.5 secondi aggiunge +0.35 al moltiplicatore.' },
            'border-ring': { name: 'Anello di Confine', description: 'Ogni comune confinante già trovato aggiunge +18 chips, fino a +126.' },
            crossroads: { name: 'Incrocio', description: 'I comuni che toccano 3 o più vicini già trovati aggiungono +110 chips.' },
            'back-to-back': { name: 'Doppio Colpo', description: 'Due guess corretti entro 3 secondi aggiungono +0.40 al moltiplicatore.' },
            'needle-eye': { name: 'Cruna dell Ago', description: 'I comuni nel decile più piccolo aggiungono +160 chips.' },
            'recovery-line': { name: 'Linea di Recupero', description: 'Il primo guess corretto dopo un errore aggiunge +90 chips e +0.25 al moltiplicatore.' },
            'long-name': { name: 'Nome Lungo', description: 'I comuni con 14 o più lettere aggiungono +75 chips.' },
            'sharp-vowels': { name: 'Vocali Secche', description: 'I nomi con 4 vocali o meno aggiungono +65 chips.' },
            'outer-ring': { name: 'Anello Esterno', description: 'I comuni sul bordo provinciale aggiungono +85 chips.' },
            'central-hit': { name: 'Colpo al Centro', description: 'I comuni interni aggiungono +70 chips.' },
            'alphabet-climb': { name: 'Salita Alfabetica', description: 'Un iniziale successiva a quella del guess precedente aggiunge +0.30 al moltiplicatore.' },
            'island-hop': { name: 'Salto d Isola', description: 'I guess corretti isolati aggiungono +120 chips.' }
        }
    }
};

const els = {
    heroEyebrow: document.getElementById('hero-eyebrow'),
    heroTitle: document.getElementById('hero-title'),
    heroLede: document.getElementById('hero-lede'),
    backLink: document.getElementById('back-link'),
    languageToggle: document.getElementById('language-toggle'),
    themeToggle: document.getElementById('theme-toggle'),
    resetButton: document.getElementById('reset-button'),
    provincePickerEyebrow: document.getElementById('province-picker-eyebrow'),
    provincePickerTitle: document.getElementById('province-picker-title'),
    provincePickerCopy: document.getElementById('province-picker-copy'),
    provincePickerInput: document.getElementById('province-picker-input'),
    provinceOptions: document.getElementById('province-options'),
    provinceLoadButton: document.getElementById('province-load-button'),
    modifiersTitle: document.getElementById('modifiers-title'),
    modifierTray: document.getElementById('modifier-tray'),
    modifierCount: document.getElementById('modifier-count'),
    modifierHelp: document.getElementById('modifier-help'),
    momentumEyebrow: document.getElementById('momentum-eyebrow'),
    momentumLabel: document.getElementById('momentum-label'),
    scoreBreakdown: document.getElementById('score-breakdown'),
    foundLabel: document.getElementById('found-label'),
    remainingLabel: document.getElementById('remaining-label'),
    progressLabel: document.getElementById('progress-label'),
    timerLabel: document.getElementById('timer-label'),
    bestScoreLabel: document.getElementById('best-score-label'),
    bestTimeLabel: document.getElementById('best-time-label'),
    foundCount: document.getElementById('found-count'),
    remainingCount: document.getElementById('remaining-count'),
    progressPercent: document.getElementById('progress-percent'),
    timerValue: document.getElementById('timer-value'),
    bestScore: document.getElementById('best-score'),
    bestTime: document.getElementById('best-time'),
    mapCanvas: document.getElementById('map-canvas'),
    mapLoading: document.getElementById('map-loading'),
    mapHoverLabel: document.getElementById('map-hover-label'),
    resetViewButton: document.getElementById('reset-view-button'),
    scopeEyebrow: document.getElementById('scope-eyebrow'),
    scopeTitle: document.getElementById('scope-title'),
    scopeCopy: document.getElementById('scope-copy'),
    scoreLabel: document.getElementById('score-label'),
    scoreValue: document.getElementById('score-value'),
    multiplierLabel: document.getElementById('multiplier-label'),
    multiplierValue: document.getElementById('multiplier-value'),
    streakLabel: document.getElementById('streak-label'),
    streakValue: document.getElementById('streak-value'),
    guessForm: document.getElementById('guess-form'),
    guessInput: document.getElementById('guess-input'),
    guessSubmit: document.getElementById('guess-submit'),
    feedback: document.getElementById('feedback'),
    legendUnguessed: document.getElementById('legend-unguessed'),
    legendFound: document.getElementById('legend-found'),
    legendFocused: document.getElementById('legend-focused'),
    runSummary: document.getElementById('run-summary'),
    summaryTitle: document.getElementById('summary-title'),
    summaryRank: document.getElementById('summary-rank'),
    summaryScoreLabel: document.getElementById('summary-score-label'),
    summaryScore: document.getElementById('summary-score'),
    summaryMultiplierLabel: document.getElementById('summary-multiplier-label'),
    summaryMultiplier: document.getElementById('summary-multiplier'),
    summaryStreakLabel: document.getElementById('summary-streak-label'),
    summaryStreak: document.getElementById('summary-streak'),
    summaryTimeLabel: document.getElementById('summary-time-label'),
    summaryTime: document.getElementById('summary-time'),
    foundListTitle: document.getElementById('found-list-title'),
    foundList: document.getElementById('found-list'),
    foundListSummary: document.getElementById('found-list-summary'),
    scoreBurstLayer: document.getElementById('score-burst-layer')
};

const numberFormatters = {
    en: new Intl.NumberFormat('en-US'),
    it: new Intl.NumberFormat('it-IT')
};

const seoEls = {
    description: document.getElementById('meta-description'),
    canonical: document.getElementById('canonical-link'),
    ogTitle: document.getElementById('og-title'),
    ogDescription: document.getElementById('og-description'),
    ogUrl: document.getElementById('og-url'),
    ogImage: document.getElementById('og-image'),
    twitterTitle: document.getElementById('twitter-title'),
    twitterDescription: document.getElementById('twitter-description'),
    twitterImage: document.getElementById('twitter-image'),
    schema: document.getElementById('seo-schema')
};

const mapController = new LeafletMapController({
    container: els.mapCanvas,
    hoverLabel: els.mapHoverLabel
});

let currentLanguage = loadLanguage('en');
let manifest;
let provinceIndex = new Map();
let provinceLookup = new Map();
let activeProvince = null;
let dataset = null;
let municipalities = [];
let codeIndex = new Map();
let answerIndex = new Map();
let state = createEmptyState();
let bestTime = null;
let bestScore = null;
let lastScoreEvent = null;
let feedbackState = { key: 'startTyping', params: {}, stateName: '' };
let filteredProvinceCodes = [];
let activeProvinceOptionIndex = -1;

function tr(key, params = {}) {
    const dictionary = TRANSLATIONS[currentLanguage];
    const entry = dictionary[key];
    if (typeof entry === 'function') {
        return entry(params);
    }
    return entry ?? key;
}

function trModifier(id) {
    return TRANSLATIONS[currentLanguage].modifierNames[id] || { name: id, description: id };
}

function formatPoints(value) {
    return numberFormatters[currentLanguage].format(Math.round(value));
}

function provinceDisplayValue(province) {
    return province.sigla ? `${province.label} (${province.sigla})` : province.label;
}

function provinceLookupKey(value) {
    return normalizeGuess(value);
}

function provinceSearchText(province) {
    return [
        province.label,
        provinceDisplayValue(province),
        province.sigla || '',
        province.officialScopeLabel || ''
    ]
        .map(provinceLookupKey)
        .join(' ');
}

function currentLanguageButton() {
    return currentLanguage === 'en'
        ? tr('languageButton', { language: 'EN', flag: '🇬🇧' })
        : tr('languageButton', { language: 'IT', flag: '🇮🇹' });
}

function nextLanguageLabel() {
    return currentLanguage === 'en' ? 'Italiano' : 'English';
}

function currentCanonicalUrl() {
    return new URL(APP_PATH, window.location.origin).href;
}

function currentShareImage() {
    return new URL('../assets/portal-torino.svg', window.location.href).href;
}

function buildSeoTitle(provinceLabel) {
    return provinceLabel ? `${BRAND_NAME} | ${provinceLabel}` : BRAND_NAME;
}

function buildSeoDescription(provinceLabel) {
    if (provinceLabel) {
        return currentLanguage === 'it'
            ? `${BRAND_NAME}: gioca nella provincia di ${provinceLabel} con mappa interattiva, punteggio, combo e tutti i comuni da trovare.`
            : `${BRAND_NAME}: play in ${provinceLabel} with an interactive map, score multipliers, combos, and every municipality to guess.`;
    }
    return currentLanguage === 'it'
        ? `${BRAND_NAME}: scegli una provincia italiana, usa la mappa interattiva e prova a trovare tutti i comuni.`
        : `${BRAND_NAME}: choose an Italian province, use the interactive map, and try to guess every municipality.`;
}

function updateSeo() {
    const provinceLabel = activeProvince?.label || '';
    const title = buildSeoTitle(provinceLabel);
    const description = buildSeoDescription(provinceLabel);
    const url = currentCanonicalUrl();
    const image = currentShareImage();

    document.title = title;
    seoEls.description?.setAttribute('content', description);
    seoEls.canonical?.setAttribute('href', url);
    seoEls.ogTitle?.setAttribute('content', title);
    seoEls.ogDescription?.setAttribute('content', description);
    seoEls.ogUrl?.setAttribute('content', url);
    seoEls.ogImage?.setAttribute('content', image);
    seoEls.twitterTitle?.setAttribute('content', title);
    seoEls.twitterDescription?.setAttribute('content', description);
    seoEls.twitterImage?.setAttribute('content', image);

    if (seoEls.schema) {
        seoEls.schema.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: BRAND_NAME,
            alternateName: provinceLabel ? `${BRAND_NAME} ${provinceLabel}` : BRAND_NAME,
            applicationCategory: 'Game',
            operatingSystem: 'Web',
            inLanguage: ['it', 'en'],
            url,
            image,
            description,
            about: provinceLabel ? `Comuni della provincia di ${provinceLabel}` : 'Comuni e province d Italia'
        });
    }
}

function setThemeFromStorage() {
    const saved = window.localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
}

function buildProvinceLookup() {
    provinceLookup = new Map();
    manifest.provinces.forEach(province => {
        const display = provinceDisplayValue(province);
        provinceLookup.set(provinceLookupKey(display), province.provinceCode);
        provinceLookup.set(provinceLookupKey(province.label), province.provinceCode);
        provinceLookup.set(province.provinceCode, province.provinceCode);
        if (province.sigla) {
            provinceLookup.set(provinceLookupKey(province.sigla), province.provinceCode);
        }
    });
}

function resolveProvinceCodeFromInput(value) {
    const normalized = provinceLookupKey(value);
    return provinceLookup.get(normalized) || null;
}

function setProvincePickerValue(provinceCode) {
    const province = provinceIndex.get(provinceCode);
    if (province) {
        els.provincePickerInput.value = provinceDisplayValue(province);
    }
}

function getFilteredProvinces(query) {
    const normalized = provinceLookupKey(query);
    const provinces = manifest?.provinces || [];
    if (!normalized) {
        return provinces.slice(0, 10);
    }

    const startsWith = [];
    const contains = [];
    provinces.forEach(province => {
        const haystack = provinceSearchText(province);
        if (!haystack.includes(normalized)) {
            return;
        }
        if (haystack.startsWith(normalized) || provinceLookupKey(province.label).startsWith(normalized)) {
            startsWith.push(province);
            return;
        }
        contains.push(province);
    });
    return [...startsWith, ...contains].slice(0, 12);
}

function closeProvinceMenu() {
    filteredProvinceCodes = [];
    activeProvinceOptionIndex = -1;
    els.provinceOptions.hidden = true;
    els.provincePickerInput.setAttribute('aria-expanded', 'false');
}

function updateProvinceMenuHighlight() {
    const options = els.provinceOptions.querySelectorAll('.province-picker__option');
    options.forEach((option, index) => {
        const isActive = index === activeProvinceOptionIndex;
        option.classList.toggle('is-active', isActive);
        option.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}

function renderProvinceMenu(query = els.provincePickerInput.value) {
    const provinces = getFilteredProvinces(query);
    filteredProvinceCodes = provinces.map(province => province.provinceCode);
    activeProvinceOptionIndex = provinces.length > 0 ? 0 : -1;
    els.provinceOptions.innerHTML = '';

    if (provinces.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'province-picker__empty';
        empty.textContent = tr('provinceNotFound', { value: query.trim() || '?' });
        els.provinceOptions.appendChild(empty);
        els.provinceOptions.hidden = false;
        els.provincePickerInput.setAttribute('aria-expanded', 'true');
        return;
    }

    provinces.forEach((province, index) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'province-picker__option';
        option.setAttribute('role', 'option');
        option.dataset.code = province.provinceCode;
        option.innerHTML = `
            <span class="province-picker__option-name">
                <span>${province.label}</span>
                ${province.sigla ? `<span class="province-picker__option-sigla">${province.sigla}</span>` : ''}
            </span>
            <span class="province-picker__option-meta">${province.count} comuni</span>
        `;
        option.addEventListener('mouseenter', () => {
            activeProvinceOptionIndex = index;
            updateProvinceMenuHighlight();
        });
        option.addEventListener('click', () => {
            els.provincePickerInput.value = provinceDisplayValue(province);
            closeProvinceMenu();
            loadProvince(province.provinceCode).catch(console.error);
        });
        els.provinceOptions.appendChild(option);
    });

    els.provinceOptions.hidden = false;
    els.provincePickerInput.setAttribute('aria-expanded', 'true');
    updateProvinceMenuHighlight();
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
    if (activeProvince) {
        saveSession(activeProvince.provinceCode, state);
    }
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

function setFeedback(key, stateName = '', params = {}) {
    feedbackState = { key, params, stateName };
    els.feedback.textContent = tr(key, params);
    if (stateName) {
        els.feedback.dataset.state = stateName;
    } else {
        delete els.feedback.dataset.state;
    }
}

function translateTag(tag) {
    if (tag.startsWith('AREA ')) {
        return tr('areaTag', { value: tag.slice(5) });
    }
    return tr(`tag_${tag.replace(/\s+/g, '_')}`);
}

function renderStaticCopy() {
    const provinceLabel = activeProvince ? activeProvince.label : 'Torino';
    document.documentElement.lang = currentLanguage;
    els.heroEyebrow.textContent = tr('heroEyebrow');
    els.heroTitle.textContent = currentLanguage === 'it'
        ? `Indovina tutti i comuni di ${provinceLabel}`
        : `Guess all municipalities in ${provinceLabel}`;
    els.heroLede.textContent = tr('heroLede');
    els.backLink.textContent = tr('backToWebsite');
    els.languageToggle.textContent = currentLanguageButton();
    els.languageToggle.setAttribute('aria-label', tr('switchLanguageLabel', { language: nextLanguageLabel() }));
    els.themeToggle.textContent = tr('theme');
    els.resetButton.textContent = tr('resetRun');
    els.provincePickerEyebrow.textContent = tr('chooseProvinceEyebrow');
    els.provincePickerTitle.textContent = tr('chooseProvinceTitle');
    els.provincePickerCopy.textContent = tr('chooseProvinceCopy');
    els.provincePickerInput.placeholder = tr('provincePlaceholder');
    els.provinceLoadButton.textContent = tr('loadProvince');
    els.modifiersTitle.textContent = tr('modifiersTitle');
    els.modifierHelp.textContent = tr('modifierHelp');
    els.momentumEyebrow.textContent = tr('momentumEyebrow');
    els.foundLabel.textContent = tr('found');
    els.remainingLabel.textContent = tr('remaining');
    els.progressLabel.textContent = tr('progress');
    els.timerLabel.textContent = tr('timer');
    els.bestScoreLabel.textContent = tr('bestScore');
    els.bestTimeLabel.textContent = tr('bestTime');
    els.resetViewButton.textContent = tr('resetMapView');
    els.scopeEyebrow.textContent = tr('currentProvince');
    els.scoreLabel.textContent = tr('score');
    els.multiplierLabel.textContent = tr('multiplier');
    els.streakLabel.textContent = tr('streak');
    els.guessInput.placeholder = tr('guessPlaceholder');
    els.guessSubmit.textContent = tr('guess');
    els.legendUnguessed.textContent = tr('legendUnguessed');
    els.legendFound.textContent = tr('legendFound');
    els.legendFocused.textContent = tr('legendFocused');
    els.summaryTitle.textContent = tr('summaryTitle');
    els.summaryScoreLabel.textContent = tr('summaryFinalScore');
    els.summaryMultiplierLabel.textContent = tr('summaryTopMultiplier');
    els.summaryStreakLabel.textContent = tr('summaryLongestStreak');
    els.summaryTimeLabel.textContent = tr('summaryFinishTime');
    els.foundListTitle.textContent = tr('foundMunicipalities');
    if (!lastScoreEvent) {
        els.momentumLabel.textContent = tr('initialMomentumLabel');
        els.scoreBreakdown.textContent = tr('initialMomentumCopy');
    }
}

function renderProvinceCopy() {
    if (!activeProvince || !dataset) {
        return;
    }
    const provinceLabel = activeProvince.label;
    els.heroTitle.textContent = currentLanguage === 'it'
        ? `Indovina tutti i comuni di ${provinceLabel}`
        : `Guess all municipalities in ${provinceLabel}`;
    els.scopeTitle.textContent = currentLanguage === 'it' ? `Indovina ${provinceLabel}` : `Guess ${provinceLabel}`;
    els.scopeCopy.textContent = tr('scopeCopy', {
        officialScopeLabel: dataset.officialScopeLabel,
        count: dataset.count
    });
    els.mapLoading.textContent = tr('loadingProvince', { label: provinceLabel });
}

function renderModifiers() {
    const modifiers = getModifiersById(state.activeModifiers);
    els.modifierTray.innerHTML = '';
    modifiers.forEach(modifier => {
        const localized = trModifier(modifier.id);
        const card = document.createElement('article');
        card.className = 'modifier-chip';
        card.innerHTML = `
            <span class="modifier-chip__name">${localized.name}</span>
            <span class="modifier-chip__description">${localized.description}</span>
        `;
        els.modifierTray.appendChild(card);
    });
    els.modifierCount.textContent = tr('activeModifiers', { count: modifiers.length });
}

function renderStats() {
    const found = state.foundCodes.length;
    const total = municipalities.length;
    const remaining = total - found;
    const progress = total === 0 ? 0 : Math.round((found / total) * 100);
    els.foundCount.textContent = String(found);
    els.remainingCount.textContent = String(remaining);
    els.progressPercent.textContent = `${progress}%`;
    els.timerValue.textContent = formatElapsed(getElapsedMs(state));
    els.bestScore.textContent = bestScore ? formatPoints(bestScore.score) : '0';
    els.bestTime.textContent = bestTime ? formatElapsed(bestTime.elapsedMs) : tr('noneYet');
    els.scoreValue.textContent = formatPoints(state.score);
    els.multiplierValue.textContent = formatMultiplier(getLiveMultiplier(state));
    els.streakValue.textContent = String(getLiveStreak(state));
    els.foundListSummary.textContent = tr('guessedCount', { count: found });
}

function renderMomentum() {
    if (!lastScoreEvent) {
        els.momentumLabel.textContent = tr('initialMomentumLabel');
        els.scoreBreakdown.textContent = tr('initialMomentumCopy');
        return;
    }
    els.momentumLabel.textContent = `+${formatPoints(lastScoreEvent.points)} ${formatMultiplier(lastScoreEvent.multiplier)}`;
    els.scoreBreakdown.textContent = lastScoreEvent.tags.map(translateTag).join(' · ');
}

function renderFoundList() {
    els.foundList.innerHTML = '';
    state.foundCodes.forEach((code, index) => {
        const entry = codeIndex.get(code);
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = `<span class="list-index">${String(index + 1).padStart(3, '0')}</span><span>${entry.officialName}</span>`;
        button.addEventListener('click', () => mapController.focusCode(code));
        item.appendChild(button);
        els.foundList.appendChild(item);
    });
}

function renderFoundMapState() {
    mapController.setFoundCodes(state.foundCodes);
    if (state.lastFoundCode) {
        mapController.focusCode(state.lastFoundCode);
    } else {
        mapController.resetView();
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
    els.summaryRank.textContent = bestScore && bestScore.score === state.score ? tr('summaryNewHighScore') : tr('summaryComplete');
}

function renderFeedback() {
    if (!feedbackState) {
        return;
    }
    els.feedback.textContent = tr(feedbackState.key, feedbackState.params);
}

function renderAll() {
    renderStaticCopy();
    renderProvinceCopy();
    updateSeo();
    renderStats();
    renderModifiers();
    renderMomentum();
    renderFoundList();
    renderSummary();
    renderFeedback();
}

function spawnScoreBurst(event, municipalityName) {
    const burst = document.createElement('div');
    burst.className = 'score-burst';
    const tagSummary = event.tags.slice(0, 3).map(translateTag).join(' · ');
    burst.innerHTML = `
        <span class="score-burst__points">+${formatPoints(event.points)} ${formatMultiplier(event.multiplier)}</span>
        <span class="score-burst__meta">${municipalityName}${tagSummary ? ` · ${tagSummary}` : ''}</span>
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
        saveBestTime(activeProvince.provinceCode, bestTime);
    }
    if (!bestScore || state.score > bestScore.score) {
        bestScore = {
            score: state.score,
            completedAt: state.completedAt
        };
        saveBestScore(activeProvince.provinceCode, bestScore);
    }
}

function applyLanguage(language) {
    currentLanguage = language;
    saveLanguage(language);
    mapController.setMessages({
        hoverDefault: tr('mapHoverDefault'),
        hiddenMunicipality: tr('hiddenMunicipality')
    });
    renderAll();
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

function bindLanguageToggle() {
    els.languageToggle.addEventListener('click', () => {
        applyLanguage(currentLanguage === 'en' ? 'it' : 'en');
    });
}

function submitGuess(rawGuess) {
    const guess = normalizeGuess(rawGuess);
    if (!guess) {
        setFeedback('startTyping');
        return;
    }

    const code = answerIndex.get(guess);
    if (!code) {
        registerMiss(state);
        persistState();
        renderStats();
        setFeedback('invalidGuess', 'error', { value: rawGuess });
        return;
    }

    if (state.foundCodes.includes(code)) {
        const entry = codeIndex.get(code);
        setFeedback('duplicateGuess', 'duplicate', { name: entry.officialName });
        mapController.focusCode(code);
        return;
    }

    const entry = codeIndex.get(code);
    const lastEntry = state.lastFoundCode ? codeIndex.get(state.lastFoundCode) : null;
    const timestamp = Date.now();
    const scoreEvent = scoreGuess({ state, entry, lastEntry, timestamp });

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
        renderAll();
        setFeedback('completedGuess', 'success', { name: entry.officialName, score: formatPoints(state.score) });
    } else {
        setFeedback('correctGuess', 'success', {
            name: entry.officialName,
            points: formatPoints(scoreEvent.points),
            multiplier: formatMultiplier(scoreEvent.multiplier)
        });
    }
}

async function loadManifest() {
    const response = await fetch('./data/provinces-manifest.json');
    if (!response.ok) {
        throw new Error('Could not load provinces manifest.');
    }
    manifest = await response.json();
    provinceIndex = new Map(manifest.provinces.map(province => [province.provinceCode, province]));
    buildProvinceLookup();
}

async function loadProvince(provinceCode) {
    const province = provinceIndex.get(provinceCode);
    if (!province) {
        return false;
    }

    activeProvince = province;
    saveLastProvince(provinceCode);
    setProvincePickerValue(provinceCode);
    lastScoreEvent = null;
    els.mapLoading.hidden = false;
        els.mapLoading.textContent = tr('loadingProvince', { label: province.label });

    const [metadataResponse, aliasesResponse, municipalityResponse, outlineResponse] = await Promise.all([
        fetch(province.assets.metadata),
        fetch(province.assets.aliases),
        fetch(province.assets.municipalities),
        fetch(province.assets.outline)
    ]);

    if (!metadataResponse.ok || !aliasesResponse.ok || !municipalityResponse.ok || !outlineResponse.ok) {
        throw new Error(`Could not load assets for province ${provinceCode}.`);
    }

    const [metadata, aliases, municipalityGeoJson, outlineGeoJson] = await Promise.all([
        metadataResponse.json(),
        aliasesResponse.json(),
        municipalityResponse.json(),
        outlineResponse.json()
    ]);

    dataset = metadata;
    municipalities = metadata.municipalities;
    codeIndex = new Map(municipalities.map(entry => [entry.istatCode, entry]));
    answerIndex = buildAnswerIndex(municipalities, aliases);
    state = restoreState(loadSession(provinceCode), municipalities.map(entry => entry.istatCode));
    bestTime = loadBestTime(provinceCode);
    bestScore = loadBestScore(provinceCode);
    ensureRunModifiers();

    await mapController.load({
        municipalityGeoJson,
        outlineGeoJson,
        municipalities,
        messages: {
            hoverDefault: tr('mapHoverDefault'),
            hiddenMunicipality: tr('hiddenMunicipality')
        },
        onActivate(code) {
            mapController.focusCode(code);
            const entry = codeIndex.get(code);
            if (state.foundCodes.includes(code)) {
                setFeedback('focusFound', 'success', { name: entry.officialName });
            } else {
                setFeedback('focusHidden', '', {});
            }
        }
    });

    renderFoundMapState();
    renderAll();
    mapController.refreshTheme();
    els.mapLoading.hidden = true;
    setFeedback('startTyping');
    return true;
}

function tryLoadProvinceFromInput() {
    const provinceCode = resolveProvinceCodeFromInput(els.provincePickerInput.value);
    if (!provinceCode) {
        renderProvinceMenu(els.provincePickerInput.value);
        setFeedback('provinceNotFound', 'error', { value: els.provincePickerInput.value.trim() || '?' });
        return;
    }
    closeProvinceMenu();
    loadProvince(provinceCode).catch(error => {
        console.error(error);
        setFeedback('provinceNotFound', 'error', { value: els.provincePickerInput.value.trim() || provinceCode });
    });
}

function bindUi() {
    els.guessForm.addEventListener('submit', event => {
        event.preventDefault();
        submitGuess(els.guessInput.value.trim());
        els.guessInput.value = '';
        els.guessInput.focus();
    });

    els.resetButton.addEventListener('click', () => {
        if (!activeProvince) {
            return;
        }
        const shouldReset = window.confirm(tr('resetConfirm', { label: activeProvince.label }));
        if (!shouldReset) {
            return;
        }
        clearSession(activeProvince.provinceCode);
        state = createEmptyState();
        lastScoreEvent = null;
        loadProvince(activeProvince.provinceCode).catch(console.error);
    });

    els.resetViewButton.addEventListener('click', () => {
        mapController.resetView();
    });

    els.provinceLoadButton.addEventListener('click', () => {
        tryLoadProvinceFromInput();
    });

    els.provincePickerInput.addEventListener('focus', () => {
        renderProvinceMenu();
    });

    els.provincePickerInput.addEventListener('input', () => {
        renderProvinceMenu();
    });

    els.provincePickerInput.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeProvinceMenu();
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (filteredProvinceCodes.length === 0) {
                renderProvinceMenu();
                return;
            }
            event.preventDefault();
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            activeProvinceOptionIndex = (activeProvinceOptionIndex + direction + filteredProvinceCodes.length) % filteredProvinceCodes.length;
            updateProvinceMenuHighlight();
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            if (filteredProvinceCodes.length > 0 && activeProvinceOptionIndex >= 0) {
                const provinceCode = filteredProvinceCodes[activeProvinceOptionIndex];
                const province = provinceIndex.get(provinceCode);
                if (province) {
                    els.provincePickerInput.value = provinceDisplayValue(province);
                    closeProvinceMenu();
                    loadProvince(provinceCode).catch(console.error);
                    return;
                }
            }
            tryLoadProvinceFromInput();
        }
    });

    document.addEventListener('click', event => {
        if (
            event.target !== els.provincePickerInput
            && !els.provinceOptions.contains(event.target)
            && event.target !== els.provinceLoadButton
        ) {
            closeProvinceMenu();
        }
    });
}

function startTimerLoop() {
    window.setInterval(() => {
        renderStats();
        renderMomentum();
        renderSummary();
    }, 250);
}

async function init() {
    setThemeFromStorage();
    bindThemeToggle();
    bindLanguageToggle();
    bindUi();
    startTimerLoop();

    try {
        await loadManifest();
        const defaultProvinceCode = manifest.defaultProvinceCode;
        const startupProvince = provinceIndex.has(loadLastProvince(defaultProvinceCode))
            ? loadLastProvince(defaultProvinceCode)
            : defaultProvinceCode;
        applyLanguage(currentLanguage);
        await loadProvince(startupProvince);
    } catch (error) {
        console.error(error);
        els.mapLoading.hidden = false;
        els.mapLoading.textContent = tr('loadFailure');
    }
}

init();
