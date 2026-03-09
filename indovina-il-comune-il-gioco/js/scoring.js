const COMBO_WINDOW_MS = 8000;
const FAST_HANDS_WINDOW_MS = 4500;
const BACK_TO_BACK_WINDOW_MS = 3000;
const BASE_MULTIPLIER = 1;
const MULTIPLIER_STEP = 0.35;
const MAX_MULTIPLIER = 5;
const ADJACENT_LAST_BONUS = 70;
const FRONTIER_BONUS = 30;
const VOWEL_PATTERN = /[aeiou]/g;

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
    },
    {
        id: 'crossroads',
        name: 'Crossroads',
        description: 'Municipalities touching 3 or more found neighbors add +110 chips.',
        apply(context) {
            if (context.foundNeighborCount >= 3) {
                return { chips: 110, mult: 0, tags: ['CROSSROADS'] };
            }
            return null;
        }
    },
    {
        id: 'back-to-back',
        name: 'Back-to-Back',
        description: 'Correct guesses within 3 seconds add +0.40 multiplier.',
        apply(context) {
            if (context.timeSinceLastCorrect !== null && context.timeSinceLastCorrect <= BACK_TO_BACK_WINDOW_MS) {
                return { chips: 0, mult: 0.4, tags: ['BACK TO BACK'] };
            }
            return null;
        }
    },
    {
        id: 'needle-eye',
        name: 'Needle Eye',
        description: 'Smallest-decile municipalities add +160 chips.',
        apply(context) {
            if (context.entry.sizeDecile === 1) {
                return { chips: 160, mult: 0, tags: ['NEEDLE'] };
            }
            return null;
        }
    },
    {
        id: 'recovery-line',
        name: 'Recovery Line',
        description: 'The first correct guess after a miss adds +90 chips and +0.25 multiplier.',
        apply(context) {
            if (context.state.lastGuessWasMiss) {
                return { chips: 90, mult: 0.25, tags: ['RECOVERY'] };
            }
            return null;
        }
    },
    {
        id: 'long-name',
        name: 'Long Name',
        description: 'Municipality names with 14 or more letters add +75 chips.',
        apply(context) {
            if (context.letterCount >= 14) {
                return { chips: 75, mult: 0, tags: ['LONG NAME'] };
            }
            return null;
        }
    },
    {
        id: 'sharp-vowels',
        name: 'Sharp Vowels',
        description: 'Names with 4 or fewer vowels add +65 chips.',
        apply(context) {
            if (context.vowelCount <= 4) {
                return { chips: 65, mult: 0, tags: ['SHARP'] };
            }
            return null;
        }
    },
    {
        id: 'outer-ring',
        name: 'Outer Ring',
        description: 'Border municipalities add +85 chips.',
        apply(context) {
            if (context.entry.isBorderMunicipality) {
                return { chips: 85, mult: 0, tags: ['OUTER RING'] };
            }
            return null;
        }
    },
    {
        id: 'central-hit',
        name: 'Central Hit',
        description: 'Interior municipalities add +70 chips.',
        apply(context) {
            if (!context.entry.isBorderMunicipality) {
                return { chips: 70, mult: 0, tags: ['CENTER'] };
            }
            return null;
        }
    },
    {
        id: 'alphabet-climb',
        name: 'Alphabet Climb',
        description: 'A higher starting letter than the previous guess adds +0.30 multiplier.',
        apply(context) {
            if (context.alphabetAscends) {
                return { chips: 0, mult: 0.3, tags: ['ASCEND'] };
            }
            return null;
        }
    },
    {
        id: 'island-hop',
        name: 'Island Hop',
        description: 'Correct isolated guesses add +120 chips.',
        apply(context) {
            if (context.state.foundCodes.length > 0 && context.foundNeighborCount === 0) {
                return { chips: 120, mult: 0, tags: ['ISLAND'] };
            }
            return null;
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
    const alphabetAscends = Boolean(
        lastEntry && entry.officialName.charAt(0).toLowerCase() > lastEntry.officialName.charAt(0).toLowerCase()
    );
    const normalizedLabel = entry.normalizedName.replace(/\s+/g, '');
    const letterCount = normalizedLabel.length;
    const vowelCount = (normalizedLabel.match(VOWEL_PATTERN) || []).length;

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
            sameInitialAsLast,
            alphabetAscends,
            letterCount,
            vowelCount
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
