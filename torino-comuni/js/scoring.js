const COMBO_WINDOW_MS = 8000;
const FAST_HANDS_WINDOW_MS = 4500;
const BASE_MULTIPLIER = 1;
const MULTIPLIER_STEP = 0.35;
const MAX_MULTIPLIER = 5;
const ADJACENT_LAST_BONUS = 70;
const FRONTIER_BONUS = 30;

export const MODIFIER_POOL = [
    {
        id: 'small-town-fever',
        name: 'Small Town Fever',
        description: 'Smallest-quartile municipalities add +120 chips.',
        apply(context) {
            if (context.entry.sizeQuartile === 1) {
                return { chips: 120, mult: 0, tags: ['SMALL TOWN'] };
            }
            return null;
        }
    },
    {
        id: 'neighbor-chain',
        name: 'Neighbor Chain',
        description: 'Guessing a municipality next to the previous one adds +90 chips.',
        apply(context) {
            if (context.isAdjacentToLast) {
                return { chips: 90, mult: 0, tags: ['NEIGHBOR CHAIN'] };
            }
            return null;
        }
    },
    {
        id: 'frontier-run',
        name: 'Frontier Run',
        description: 'Any municipality touching your frontier adds +45 chips.',
        apply(context) {
            if (context.foundNeighborCount > 0) {
                return { chips: 45, mult: 0, tags: ['FRONTIER'] };
            }
            return null;
        }
    },
    {
        id: 'letter-ladder',
        name: 'Letter Ladder',
        description: 'Matching the previous initial adds +0.45 multiplier.',
        apply(context) {
            if (context.sameInitialAsLast) {
                return { chips: 0, mult: 0.45, tags: ['LETTER'] };
            }
            return null;
        }
    },
    {
        id: 'fast-hands',
        name: 'Fast Hands',
        description: 'Correct guesses inside 4.5 seconds add +0.35 multiplier.',
        apply(context) {
            if (context.timeSinceLastCorrect !== null && context.timeSinceLastCorrect <= FAST_HANDS_WINDOW_MS) {
                return { chips: 0, mult: 0.35, tags: ['FAST'] };
            }
            return null;
        }
    },
    {
        id: 'border-ring',
        name: 'Border Ring',
        description: 'Each neighboring found municipality adds +18 chips, up to +126.',
        apply(context) {
            if (context.foundNeighborCount <= 0) {
                return null;
            }
            return {
                chips: Math.min(126, context.foundNeighborCount * 18),
                mult: 0,
                tags: ['RING']
            };
        }
    }
];

const modifierIndex = new Map(MODIFIER_POOL.map(modifier => [modifier.id, modifier]));

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function formatMultiplier(value) {
    return `x${value.toFixed(2)}`;
}

export function getLiveMultiplier(state, now = Date.now()) {
    if (!state.lastCorrectAt || now - state.lastCorrectAt > COMBO_WINDOW_MS) {
        return BASE_MULTIPLIER;
    }
    return clamp(BASE_MULTIPLIER + Math.max(0, state.activeStreak - 1) * MULTIPLIER_STEP, BASE_MULTIPLIER, MAX_MULTIPLIER);
}

export function getLiveStreak(state, now = Date.now()) {
    if (!state.lastCorrectAt || now - state.lastCorrectAt > COMBO_WINDOW_MS) {
        return 0;
    }
    return state.activeStreak;
}

export function pickRunModifiers(random = Math.random, count = 3) {
    const pool = [...MODIFIER_POOL];
    const picked = [];
    while (picked.length < count && pool.length > 0) {
        const index = Math.floor(random() * pool.length);
        picked.push(pool.splice(index, 1)[0].id);
    }
    return picked;
}

export function getModifiersById(ids) {
    return ids
        .map(id => modifierIndex.get(id))
        .filter(Boolean);
}

export function scoreGuess({ state, entry, lastEntry, timestamp }) {
    const neighbors = new Set(entry.neighbors || []);
    const timeSinceLastCorrect = state.lastCorrectAt ? timestamp - state.lastCorrectAt : null;
    const comboAlive = timeSinceLastCorrect !== null && timeSinceLastCorrect <= COMBO_WINDOW_MS;
    const streak = comboAlive ? state.activeStreak + 1 : 1;
    const foundNeighborCount = state.foundCodes.filter(code => neighbors.has(code)).length;
    const isAdjacentToLast = Boolean(lastEntry && neighbors.has(lastEntry.istatCode));
    const sameInitialAsLast = Boolean(
        lastEntry && entry.officialName.charAt(0).toLowerCase() === lastEntry.officialName.charAt(0).toLowerCase()
    );

    let chips = entry.baseChips;
    const tags = [`AREA ${entry.baseChips}`];

    if (isAdjacentToLast) {
        chips += ADJACENT_LAST_BONUS;
        tags.push('LINK');
    } else if (foundNeighborCount > 0) {
        chips += FRONTIER_BONUS;
        tags.push('TOUCH');
    }

    let multiplier = clamp(
        BASE_MULTIPLIER + Math.max(0, streak - 1) * MULTIPLIER_STEP,
        BASE_MULTIPLIER,
        MAX_MULTIPLIER
    );

    for (const modifier of getModifiersById(state.activeModifiers)) {
        const bonus = modifier.apply({
            state,
            entry,
            lastEntry,
            timeSinceLastCorrect,
            streak,
            foundNeighborCount,
            isAdjacentToLast,
            sameInitialAsLast
        });
        if (!bonus) {
            continue;
        }
        chips += bonus.chips || 0;
        multiplier = clamp(multiplier + (bonus.mult || 0), BASE_MULTIPLIER, MAX_MULTIPLIER);
        if (bonus.tags) {
            tags.push(...bonus.tags);
        }
    }

    const points = Math.round(chips * multiplier);
    return {
        points,
        chips,
        multiplier,
        streak,
        timeSinceLastCorrect,
        tags: Array.from(new Set(tags)),
        isAdjacentToLast,
        foundNeighborCount
    };
}
