import {CONSTANTS} from "./constants.js";
import {parseBasicData} from "./utils.js";

function parseCareerSkills(career, ) {
    return career.skills.map((skill) => game.items.find((item) => item.name.toLowerCase() === skill.name.toLowerCase() && item.type === CONSTANTS.types.skill));
}

export function buildNewCareer(career, metadata) {
    const newCareer = {
        name: career.name,
        type: CONSTANTS.types.career,
        img: "icons/svg/video.svg",
        folder: metadata.folders[CONSTANTS.types.career]._id,
        system: {
            careerSkills: parseCareerSkills(career, metadata),
            selectedSkillIDs: []
        }
    };
    parseBasicData(newCareer, career, metadata);
    return newCareer;
}

export async function processCareers(obj, metadata) {
    if (obj[CONSTANTS.divisions.career] === undefined) {
        return [];
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_CAREERS", {localize: true});

    const jsonCareers = obj[CONSTANTS.divisions.career];

    let tempCareers = []

    jsonCareers.forEach((career) => {
        const newCareer = buildNewCareer(career, metadata);
        tempCareers.push(newCareer);
    });

    return Item.create(tempCareers);
}