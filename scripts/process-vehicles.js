export function processVehicles(obj, metadata) {
    if (obj[CONSTANTS.divisions.vehicle] === undefined) {
        return;
    }
    ui.notifications.clear();
    ui.notifications.info("IMPORTER_LOADING_VEHICLES", {localize: true});
    const jsonVehicles = obj[CONSTANTS.divisions.vehicle];
    let tempVehicles = [];

    jsonVehicles.forEach((vehicle) => {
        const newVehicle = buildNewVehicle(vehicle, metadata);
        tempVehicles.push(newVehicle);
    });

    return Item.create(tempVehicles);
}