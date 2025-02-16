import {CONSTANTS} from "./constants.js";

export function processMeta(obj) {
    return obj[CONSTANTS.divisions.meta];
}

export function parseCharacteristics(actor, ) {
    return actor.characteristics;
}

export function parseBasicData(newItem, data, metadata) {
    newItem.system.source = parseSource(data, metadata);
    newItem.system.description = cleanDescription(data.description);
    return newItem;
}

function parseReferences(description) {
    Object.values(CONSTANTS.referenceLinks).forEach((regex) => {
        const matches = description.matchAll(regex);
        for (const match of matches) {
            const linkDescription = match[2] !== "" ? match[2] : match[1];
            description = description.replaceAll(match[0], `<span class="link-reference">${linkDescription}</span>`);
        }
    })
    return description;
}

export function getExistingItem(name, type) {
    if (Array.isArray(type)) {
        return game.items.find((item) => item.name.toLowerCase() === name.toLowerCase() && type.includes(item.type));
    } else {
        return game.items.find((item) => item.name.toLowerCase() === name.toLowerCase() && item.type === type);
    }
}

export function getExistingFolder(name, type, source = null) {
    return game.folders.find((folder) => folder.name.toLowerCase() === name.toLowerCase() && folder.type === type && (folder.folder.name === source || source === null));
}


export function cleanDescription(description) {
    let newDescription = "";

    if (typeof description !== 'string' && !(description instanceof String)) {
        description.forEach((paragraph) => {
            if (paragraph.substring(0,1) !== "<") {
                paragraph = `<p>${paragraph}</p>`;
            }
            newDescription += paragraph;
        })
        description = newDescription;
    } else {
        if (description.substring(0,1) !== "<") {
            description = `<p>${description}</p>`;
        }
    }

    description = parseSymbols(description);
    description = parseDifficulty(description);
    description = parseDice(description);
    description = parseReferences(description);
    return description;
}

export function parseDice(description) {
    const diceRegex = /{@dice (\w*)(?:\|*)([0-9]*)(?:\|*)([0-9]*)}/g;

    const matchs = description.matchAll(diceRegex);

    matchs.forEach((match) => {
        description = description.replaceAll(match[0], processDice(match));
    })

    return description
}

export function parseDifficulty(description) {
    const difficultyRegex = /{@difficulty (\w*)\|([\w ()]*)(?:\|*)([0-9]*)}/g;

    const matchs = description.matchAll(difficultyRegex);

    matchs.forEach((match) => {
        description = description.replaceAll(match[0], processDifficulty(match));
    })

    return description
}

export function parseSymbols(description) {
    const symbolRegex = /{@symbols (\w*)(?: or )*(\w*)}/g;

    const matchs = description.matchAll(symbolRegex);
    matchs.forEach((match) => {
        description = description.replaceAll(match[0], processSymbol(match));
    })
    return description;
}

export function parseSource(item, metadata) {
    const book = metadata.source.abbreviation;
    const page = item.page === undefined ? 0 : item.page;

    return `@PDF[${book}|page=${page}]{${book}, ${page}}`;
}

export function processSymbol(match) {
    const group01 = match[1].trim();
    const group02 = match[2].trim();


    let result = `@sym[${group01}]`;

    if (group02 !== "") {
        result += ` or @sym[${group02}]`;
    }

    return result;
}

export function processDifficulty(match) {
    const difficulty = match[1].trim();
    const skill = match[2].trim();
    const upgrade = match[3].trim();

    let dices = CONSTANTS.difficulty[difficulty.toLowerCase()];

    for (let i = 0; i < upgrade ; i++) {
        dices = dices.replace("D", "C");
    }

    return `<b>${difficulty} (${dices}) ${skill} check</b>`;
}

export function processDice(match) {
    const diceName = match[1].trim();
    const amount = match[2].trim();
    const upgrade = match[3].trim();
    let dice = CONSTANTS.dices.find((dice) => dice.names.indexOf(diceName.toLowerCase()) !== -1);

    let dices = dice.value;

    if (!isNaN(amount) && amount > 0) {
        dices = dice.value.repeat(amount)
    }


    if (!isNaN(upgrade) && upgrade > 0) {
        if (dice === CONSTANTS.dices.ability.value) {
            for (let i = 0; i < upgrade ; i++) {
                dices = dices.replace(CONSTANTS.dices.ability.value, CONSTANTS.dices.proficiency.value);
            }
        }

        if (dice === CONSTANTS.dices.difficulty.value) {
            for (let i = 0; i < upgrade ; i++) {
                dices = dices.replace(CONSTANTS.dices.difficulty.value, CONSTANTS.dices.challenge.value);
            }
        }
    }

    return `<b>@dice[${dices}]</b>`;
}