import {CONSTANTS} from "./constants.js";
import {parseBasicData} from "./utils.js";

function parsePrice(price) {
    return isNaN(price) ? 0 : price;
}

function parseToContainer(newItem, ) {
    newItem.type = CONSTANTS.types.container;
    newItem.system.encumbrance = 0;
    newItem.system.open = false;
}

function isAContainer(data) {
    return data.encumbrance < 0;
}

function switchToContainer(newItem, data, metadata, folder = null) {
    const effect = {
        name: newItem.name,
        img: "icons/svg/item-bag.svg",
        changes: [
            {
                key: "system.encumbrance.threshold",
                mode: CONSTANTS.activeEffectChangeMode.add,
                priority: null,
                value: Math.abs(data.encumbrance),
            }
        ]
    }
    newItem.effects = [effect];
    newItem.folder = folder !== null ? metadata.folders[CONSTANTS.types.container]._id : null;
    parseToContainer(newItem, data);
    return newItem;
}

function parseToEquipment(newItem, data, metadata, folder = null) {
    newItem.system.state = "carried";
    newItem.system.damage = "undamaged";
    newItem.system.container = "";
    newItem.system.quantity = 1;
    newItem.system.price = parsePrice(data.price);
    newItem.system.rarity = data.rarity === undefined ? 1 : data.rarity;

    if (isAContainer(data)) {
        return switchToContainer(newItem, data, metadata, folder);
    }

    newItem.system.encumbrance = data.encumbrance === undefined ? 0 : data.encumbrance;
    return newItem;
}

function parseQualities(newItem, data) {
    newItem.system.qualities = [];

    if (data.special === undefined) {
        return;
    }

    data.special.forEach((special) => {
        const quality = game.items.find((item) => item.name.toLowerCase() === special.name.toLowerCase() && item.type === CONSTANTS.types.quality);
        if (quality !== undefined) {
            newItem.system.qualities.push({
                name: quality.name,
                description: quality.system.description,
                isRated: quality.system.isRated,
                rating: special.value
            })
        }
    });
}

function parseToArmor(newItem, data) {
    newItem.system.defense = data.defense;
    newItem.system.soak = data.soak;
    parseQualities(newItem, data);
}

function parseToWeapon(newItem, data) {
    try {
        if (data.damage.substring(0,1) === "+") {
            newItem.system.damageCharacteristic = "brawn";
        }
    } catch (error) {
        newItem.system.damageCharacteristic = "-";
    }

    newItem.system.baseDamage = data.damage;
    newItem.system.critical = data.critical;
    newItem.system.range = data.range.toLowerCase();
    newItem.system.skills = [data.skill.name];

    parseQualities(newItem, data);
}

export function buildNewGear(gear, metadata, folder = null) {
    let newItem = {name: gear.name, type: gear.type, system: {}};
    switch (gear.type) {
        case CONSTANTS.types.weapon:
            newItem.folder = folder === null ? metadata.folders[CONSTANTS.types.weapon]._id: folder;
            newItem.img = "icons/svg/sword.svg";
            parseBasicData(newItem, gear, metadata);
            parseToEquipment(newItem, gear, folder);
            parseToWeapon(newItem, gear);
            break;
        case CONSTANTS.types.armor:
            newItem.folder = folder === null ? metadata.folders[CONSTANTS.types.armor]._id: folder;
            newItem.img = "icons/svg/statue.svg";
            parseBasicData(newItem, gear, metadata);
            parseToEquipment(newItem, gear, folder);
            parseToArmor(newItem, gear);
            break;
        default:
            newItem.folder = folder === null ? metadata.folders[CONSTANTS.types.gear]._id: folder;
            newItem.img = "icons/svg/coins.svg";
            parseBasicData(newItem, gear, metadata);
            parseToEquipment(newItem, gear, metadata, folder);
            break;
    }
    return newItem;
}

export async function processGears(obj, metadata) {
    if (obj[CONSTANTS.divisions.gear] === undefined){
        return [];
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_GEARS", {localize: true});

    const jsonGears = obj[CONSTANTS.divisions.gear];
    let tempGears = [];

    jsonGears.forEach((gear) => {
        if (CONSTANTS.types[gear.type] !== undefined) {
            let newItem = buildNewGear(gear, metadata);
            tempGears.push(newItem);
        }
    });

    return Item.create(tempGears);
}