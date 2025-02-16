import {CONSTANTS} from "./constants.js";
import {parseBasicData, parseDice, parseDifficulty, parseSymbols} from "./utils.js";

export function parseDescription(skill) {
    let shouldUseText = ["<ul>"];
    let shouldNotUseText = ["<ul>"];

    skill.shouldUse.forEach((paragraph) => {
        if (paragraph.substring(0,1) !== "<") {
            paragraph = `<li>${paragraph}</li>`;
        }
        shouldUseText.push(paragraph);
    })
    shouldUseText.push("</ul>");

    skill.shouldNotUse.forEach((paragraph) => {
        if (paragraph.substring(0,1) !== "<") {
            paragraph = `<li>${paragraph}</li>`;
        }
        shouldNotUseText.push(paragraph);
    })
    shouldNotUseText.push("</ul>");


    skill.description = skill.description.concat(CONSTANTS.skillTexts.shouldUseHeader, shouldUseText, CONSTANTS.skillTexts.shouldUseHeader, shouldNotUseText);
}

export function buildNewSkill(skill, metadata, folder = null) {
    const newskill = {
        name: skill.name,
        type: CONSTANTS.types.skill,
        folder: folder === null ? metadata.folders[CONSTANTS.types.skill]._id : folder,
        img: "icons/svg/book.svg",
        system: {
            characteristic: skill.characteristic.toLowerCase(),
            category: skill.category.toLowerCase(),
            initiative: skill.initiative !== undefined ? skill.initiative : false,
            career: skill.career !== undefined ? skill.career : false,
            rank: skill.rank !== undefined ? skill.rank : 0,
        }
    };

    if (typeof skill.description !== 'string' && !(skill.description instanceof String)) {
        parseDescription(skill);
    }

    parseBasicData(newskill, skill, metadata);
    return newskill;
}

export async function processSkills(obj, metadata) {
    if (obj[CONSTANTS.divisions.skill] === undefined) {
        return [];
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_SKILLS", {localize: true});

    const jsonskills = obj[CONSTANTS.divisions.skill];

    let tempSkills = []

    jsonskills.forEach((skill) => {
        const newskill = buildNewSkill(skill, metadata);
        tempSkills.push(newskill);
    });

    return Item.create(tempSkills);
}