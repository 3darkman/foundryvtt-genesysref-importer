import {CONSTANTS} from "./constants.js";
import {parseBasicData} from "./utils.js";

function parseActivationType(talent) {
    const regex = /\w* \(([\w, ]*)\)/g;

    const matches = talent.activation.matchAll(regex);

    let detail = '';

    for (const match of matches) {
        detail = match[1];
    }

    if (detail === '') {
        return { type: CONSTANTS.activationType.passive, detail: "" };
    }

    return { type: CONSTANTS.activationType.active, detail: detail };
}

function parseRanked(talent) {
    return talent.ranked ? CONSTANTS.checkboxState.true : CONSTANTS.checkboxState.false;
}

export function buildNewTalent(talent, metadata, folder = null) {
    const newTalent = {
        name: talent.name,
        type: CONSTANTS.types.talent,
        img: "icons/svg/paralysis.svg",
        folder: folder === null ? metadata.folders[CONSTANTS.types.talent]._id : folder,
        system: {
            tier: talent.tier,
            activation: parseActivationType(talent),
            ranked: parseRanked(talent),
            rank: 1
        }
    };
    parseBasicData(newTalent, talent, metadata);
    return newTalent;
}

export async function processTalents(obj, metadata) {
    if (obj[CONSTANTS.divisions.talent] === undefined) {
        return [];
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_TALENTS", {localize: true});

    const jsonTalents = obj[CONSTANTS.divisions.talent];

    let tempTalents = []

    jsonTalents.forEach((talent) => {
        tempTalents.push(buildNewTalent(talent, metadata));
    });

    return Item.create(tempTalents);
}