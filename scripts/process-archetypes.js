import {CONSTANTS} from "./constants.js";
import {cleanDescription, parseBasicData} from "./utils.js";

function parseAbilities(archetype, ) {
    let abilities = [];

    let newAbility = {
        name: "Starting Skills",
        type: CONSTANTS.types.ability,
        img: "icons/svg/angel.svg",
        system: {
            description: cleanDescription(archetype.skills.description)
        },
    }
    abilities.push(newAbility);

    const existingAbilities = archetype.abilities.map((abilityName) => game.items.find((item) => item.name.toLowerCase() === abilityName.toLowerCase() && item.type === CONSTANTS.types.ability))

    abilities = abilities.concat(existingAbilities);

    return abilities;
}

export function buildNewArchetype(archetype, metadata) {
    const newArchetype = {
        name: archetype.name,
        type: CONSTANTS.types.archetype,
        folder: metadata.folders[CONSTANTS.types.archetype]._id,
        img: "icons/svg/card-joker.svg",
        system: {
            characteristics: archetype.characteristics,
            woundThreshold: archetype.wt,
            strainThreshold: archetype.st,
            startingXP: archetype.xp,
            grantedItems: parseAbilities(archetype, metadata)
        }
    };
    parseBasicData(newArchetype, archetype, metadata);
    return newArchetype;
}

export async function processArchetypes(obj, metadata) {
    if (obj[CONSTANTS.divisions.archetype] === undefined) {
        return [];
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_ARCHETYPES", {localize: true});

    const jsonArchetypes = obj[CONSTANTS.divisions.archetype];

    let tempArchetypes = []

    jsonArchetypes.forEach((archetype) => {
        const newArchetype = buildNewArchetype(archetype, metadata);
        tempArchetypes.push(newArchetype);
    });

    return Item.create(tempArchetypes);
}