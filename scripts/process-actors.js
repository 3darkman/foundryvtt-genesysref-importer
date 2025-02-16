import {CONSTANTS} from "./constants.js";
import {processAdversaries} from "./process-adversaries.js";
import {processMeta} from "./utils.js";




async function processFolders(obj, metadata) {
    metadata.folders = {};
    metadata.folders.base = await Folder.create({
        name: metadata.source.abbreviation,
        type: "Actor",
        sorting: 'a',
        sort: 0,
        flags: {}
    });

    for (const [, value] of Object.entries(CONSTANTS.actorsTypes)) {
        const newFolder = {
            name: value,
            type: "Actor",
            sorting: 'a',
            sort: 0,
            flags: {},
            folder: metadata.folders.base._id
        }
        metadata.folders[value] = await Folder.create(newFolder);
    }
}

export async function processActors(input) {
    const obj = JSON.parse(input);
    const metadata = processMeta(obj);
    await processFolders(obj, metadata);

    const adversaries = await processAdversaries(obj, metadata);

    return [].concat(adversaries);

}