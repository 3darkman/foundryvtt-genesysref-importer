import {CONSTANTS} from "./constants.js";
import {cleanDescription, getExistingFolder, getExistingItem, parseCharacteristics, parseSource} from "./utils.js";
import {buildNewAbility} from "./process-abilities.js";
import {buildNewSkill} from "./process-skills.js";
import {buildNewGear} from "./process-gears.js";
import {buildNewTalent} from "./process-talents.js";


function parseAdversaryBasicData(newAdversary, adversary, metadata) {
    newAdversary.system.soak = adversary.derived.soak;
    newAdversary.system.defense = {
        melee: adversary.derived.defense[0],
        ranged: adversary.derived.defense[1]
    };
    newAdversary.system.description = cleanDescription(adversary.description);
    newAdversary.system.source = parseSource(adversary, metadata);
}

function parseTalents(adversary, metadata) {
    const folder = getExistingFolder(CONSTANTS.types.talent, "Item", metadata.source.abbreviation);
    const tempTalents = [];

    for (const talent of adversary.talents) {
        const document = getExistingItem(talent, CONSTANTS.types.talent);
        if (document === undefined) {
            const regex = /([\w ]*) ([0-9]+)/g;
            const matches = talent.matchAll(regex);
            for (const match of matches) {
                const tempTalentDocument = getExistingItem(match[1], CONSTANTS.types.talent);
                if (tempTalentDocument !== undefined) {
                   tempTalents.push({
                       name: tempTalentDocument.name,
                       type: tempTalentDocument.type,
                       img: tempTalentDocument.img,
                       system: {
                           tier: tempTalentDocument.system.tier,
                           activation: tempTalentDocument.system.activation,
                           ranked: tempTalentDocument.system.ranked,
                           rank: match[2],
                           description: tempTalentDocument.system.description,
                           source: tempTalentDocument.system.source
                       }
                   });
                }
                else {
                    tempTalents.push(buildNewTalent({name: talent, description: "", activation: "", type: CONSTANTS.types.talent }, metadata, folder !== null ? folder._id : null));
                }
            }
        } else {
            tempTalents.push(buildNewTalent({name: talent, description: "", activation: "", type: CONSTANTS.types.talent }, metadata, folder !== null ? folder._id : null));
        }
    }
    return tempTalents;
}

async function parseGears(adversary, metadata) {
    let gears = await Promise.all(adversary.gear.map(async (gear) => {
        const document = getExistingItem(gear, [CONSTANTS.types.gear, CONSTANTS.types.armor, CONSTANTS.types.container, CONSTANTS.types.consumable]);
        if (document === undefined) {
            const folder = getExistingFolder(CONSTANTS.types.gear, "Item", metadata.source.abbreviation);
            if (folder !== null) {
                return buildNewGear({name: gear, description: "", type: CONSTANTS.types.gear }, metadata, folder._id);
            }  else {
                return buildNewGear({name: gear, description: "", type: CONSTANTS.types.gear }, metadata);
            }
        }

        return document;
    }));

    let weapons = await Promise.all(adversary.weapons.map(async (weapon) => {
        const document = getExistingItem(weapon.name, CONSTANTS.types.weapon);
        if (document === undefined) {
            const folder = getExistingFolder(CONSTANTS.types.weapon, "Item", metadata.source.abbreviation);
            if (folder !== null) {
                return buildNewGear({...weapon, description: "", type: CONSTANTS.types.weapon }, metadata, folder._id);
            } else {
                return buildNewGear({...weapon, description: "", type: CONSTANTS.types.weapon }, metadata);
            }
        }
        return document;
    }));

    return [].concat(gears, weapons);

}

function buildNewRankedAbility(ability, metadata) {
    const regex = /([\w ]*) ([0-9]+)/g;

    let newAbility = undefined;

    ability.matchAll(regex).forEach((match) => {
        const tempAbilityDocument = getExistingItem(match[1], CONSTANTS.types.ability);
        if (tempAbilityDocument === undefined) {
            return;
        }
        newAbility = buildNewAbility({
            name: match[0],
            description: tempAbilityDocument.system.description
        }, metadata, tempAbilityDocument.folder._id);
    });
    return newAbility;
}

async function parseSkills(adversary, metadata) {
    return Promise.all(adversary.skills.map(async (skill) => {
        const document = getExistingItem(skill.name, CONSTANTS.types.skill);
        if (document === undefined) {

            return;
        }

        if (skill["ranks"] !== undefined) {
            metadata.source.abbreviation = document.folder.folder.name;
            return buildNewSkill({
                name: document.name,
                description: document.system.description,
                rank: skill["ranks"],
                characteristic: document.system.characteristic,
                category: document.system.category,
                initiative: document.system.initiative,
                career: document.system.career,
            }, metadata, document.folder._id);
        }

        return document;
    }));
}


async function parseAbilities(adversary, metadata) {
    return Promise.all(adversary.abilities.map(async (ability) => {
        if (typeof ability === 'string' || ability instanceof String) {
            const abilityDocument = getExistingItem(ability, CONSTANTS.types.ability);
            if (abilityDocument === undefined) {
                const newRankedAbility = buildNewRankedAbility(ability, metadata);
                if (newRankedAbility !== undefined) {
                    return newRankedAbility;
                }
            } else {
                return abilityDocument;
            }
        } else {
            const folder = getExistingFolder(CONSTANTS.types.ability, "Item", metadata.source.abbreviation);
            if (folder !== null)
                return buildNewAbility(ability, metadata, folder._id);
        }
    }));
}

async function buildNewAdversary(adversary, metadata) {
    let newAdversary = {name: adversary.name, system: {characteristics: {}}};
    newAdversary.system.characteristics = parseCharacteristics(adversary, metadata);
    newAdversary.img = "icons/svg/skull.svg";
    parseAdversaryBasicData(newAdversary, adversary, metadata);
    const abilities = await parseAbilities(adversary, metadata);
    const skills = await parseSkills(adversary, metadata);
    const gears = await parseGears(adversary, metadata);
    const talents = parseTalents(adversary, metadata);
    switch (adversary.type) {
        case CONSTANTS.actorsTypes.minion:
            newAdversary.folder = metadata.folders[CONSTANTS.actorsTypes.minion]._id;
            newAdversary.type = CONSTANTS.actorsTypes.minion;
            newAdversary.system.groupSize = 4;
            newAdversary.system.wounds = {
                value: 0,
                threshold: adversary.derived.wounds
            }
            break;
        case CONSTANTS.actorsTypes.rival:
            newAdversary.folder = metadata.folders[CONSTANTS.actorsTypes.rival]._id;
            newAdversary.type = CONSTANTS.actorsTypes.rival;
            newAdversary.system.wounds = {
                value: 0,
                max: adversary.derived.wounds
            }
            break;
        case CONSTANTS.actorsTypes.nemesis:
            newAdversary.folder = metadata.folders[CONSTANTS.actorsTypes.nemesis]._id;
            newAdversary.type = CONSTANTS.actorsTypes.nemesis;
            newAdversary.system.wounds = {
                value: 0,
                max: adversary.derived.wounds
            }
            newAdversary.system.strain = {
                value: 0,
                max: adversary.derived.strain
            }
            break;
    }
    return { newAdversary, abilities, skills, gears, talents };
}

async function createAdversary(newAdversary, abilities, skills, gears, talents) {
    let adversaryDocument = await Actor.create(newAdversary);

    if (abilities !== undefined && abilities.length > 0) {
        adversaryDocument.createEmbeddedDocuments("Item", abilities);
    }

    if (skills !== undefined && skills.length > 0) {
        adversaryDocument.createEmbeddedDocuments("Item", skills);
    }

    if (gears !== undefined && gears.length > 0) {
        adversaryDocument.createEmbeddedDocuments("Item", gears);
    }

    if (talents !== undefined && talents.length > 0) {
        adversaryDocument.createEmbeddedDocuments("Item", talents);
    }
}

export async function processAdversaries(obj, metadata) {
    if (obj[CONSTANTS.divisions.adversary] === undefined) {
        return;
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_ADVERSARIES", {localize: true});

    const jsonAdversaries = obj[CONSTANTS.divisions.adversary];
    console.log(jsonAdversaries);

    let tempAdversaries = [];

    for (const adversary of jsonAdversaries) {
        if (CONSTANTS.actorsTypes[adversary.type] !== undefined) {
            let { newAdversary, abilities, skills, gears, talents } = await buildNewAdversary(adversary, metadata);
            createAdversary(newAdversary, abilities, skills, gears, talents);
        }
    }

    return tempAdversaries;
}