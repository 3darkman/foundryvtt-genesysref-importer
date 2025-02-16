import {CONSTANTS} from "./constants.js";
import {parseBasicData} from "./utils.js";

function parseActivationType(ability) {
    const tags = ability.tags;

    if (tags === undefined) {
        return { type: CONSTANTS.activationType.passive, detail: "" };
    }

    const activeTagIndex = tags.indexOf(CONSTANTS.activationType.active)

    if (activeTagIndex >= 0) {
        return { type: CONSTANTS.activationType.active, detail: tags[activeTagIndex+1] };
    }

    return { type: CONSTANTS.activationType.passive, detail: "" };
}

export function buildNewAbility(ability, metadata, folder = null) {
    const newAbility = {
        name: ability.name,
        type: CONSTANTS.types.ability,
        img: "icons/svg/angel.svg",
        folder: folder === null ? metadata.folders[CONSTANTS.types.ability]._id : folder,
        system: {
            activation: parseActivationType(ability),
        }
    };
    parseBasicData(newAbility, ability, metadata);
    return newAbility;
}

export async function processAbilities(obj, metadata) {
    let jsonAbilities = [];

    if (obj[CONSTANTS.divisions.archetypeAbility] !== undefined) {
        jsonAbilities = jsonAbilities.concat(obj[CONSTANTS.divisions.archetypeAbility]);
    }

    if (obj[CONSTANTS.divisions.adversaryAbility] !== undefined) {
        jsonAbilities = jsonAbilities.concat(obj[CONSTANTS.divisions.adversaryAbility]);
    }

    if (jsonAbilities.length === 0) {
        return [];
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_ABILITIES", {localize: true});

    let tempAbilities = []

    jsonAbilities.forEach((ability) => {
        const newAbility = buildNewAbility(ability, metadata);
        tempAbilities.push(newAbility);
    });

    return Item.create(tempAbilities);
}