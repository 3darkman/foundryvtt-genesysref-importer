import {CONSTANTS} from "./constants.js";
import {processGears} from "./process-gears.js";
import {processTalents} from "./process-talents.js";
import {processQualities} from "./process-qualities.js";
import {processSkills} from "./process-skills.js";
import {processCareers} from "./process-careers.js";
import {processAbilities} from "./process-abilities.js";
import {processArchetypes} from "./process-archetypes.js";
import {processMeta} from "./utils.js";

async function processFolders(obj, metadata) {
    metadata.folders = {};
    metadata.folders.base = await Folder.create({
        name: metadata.source.abbreviation,
        type: "Item",
        sorting: 'a',
        sort: 0,
        flags: {}
    });

    const types = Object.entries(CONSTANTS.types);

    for (const [key, value] of Object.entries(CONSTANTS.types)) {
        const newFolder = {
            name: value,
            type: "Item",
            sorting: 'a',
            sort: 0,
            flags: {},
            folder: metadata.folders.base._id
        }
        metadata.folders[value] = await Folder.create(newFolder);
    }
}

async function processItems(input) {
    const obj = JSON.parse(input);
    const metadata = processMeta(obj);
    await processFolders(obj, metadata);

    const skills = await processSkills(obj, metadata);
    const qualities = await processQualities(obj, metadata);
    const gears = await processGears(obj, metadata);
    const talents = await processTalents(obj, metadata);
    const careers = await processCareers(obj, metadata);
    const abilities = await processAbilities(obj, metadata);
    const archetypes = await processArchetypes(obj, metadata);

    return [].concat(skills, qualities, gears, talents, careers, abilities, archetypes);
}

export default processItems;