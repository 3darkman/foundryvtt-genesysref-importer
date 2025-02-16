import ImportGenericForm from "./import-generic-form.js";
import {CONSTANTS} from "./constants.js";

class ImportItemForm extends ImportGenericForm {
    constructor({ handler, tab }) {
        super({ handler, tab });
    }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            jQuery: false,
            width: 400,
            top: window.innerHeight - window.innerHeight + 20,
            left: window.innerWidth - 710,
            template: `modules/${CONSTANTS.module.name}/templates/import-item-template.hbs`,
        });
    }
}

export default ImportItemForm;