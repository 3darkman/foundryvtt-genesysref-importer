import {CONSTANTS} from "./constants.js";
import {parseBasicData} from "./utils.js";

function parseIsRated(quality) {
    return quality.system.description.indexOf("rating") >= 0;
}

export function buildNewQuality(quality, metadata) {
    const newQuality = {
        name: quality.name,
        type: CONSTANTS.types.quality,
        img: "icons/svg/ice-aura.svg",
        folder: metadata.folders[CONSTANTS.types.quality]._id,
        system: {
            activation: quality.activation,
            isRated: false,
        }
    };
    parseBasicData(newQuality, quality, metadata);
    newQuality.system.isRated = parseIsRated(newQuality);
    return newQuality;
}

export async function processQualities(obj, metadata) {
    if (obj[CONSTANTS.divisions.quality] === undefined) {
        return [];
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_QUALITIES", {localize: true});

    const jsonQualities = obj[CONSTANTS.divisions.quality];

    let tempQualities = []

    jsonQualities.forEach((quality) => {
        const newQuality = buildNewQuality(quality, metadata);
        tempQualities.push(newQuality);
    });

    return Item.create(tempQualities);
}