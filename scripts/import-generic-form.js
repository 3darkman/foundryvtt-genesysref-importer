class ImportGenericForm extends FormApplication {
    constructor({ handler, tab }) {
        super({});
        this._handler = handler;
        this.tab = tab;
    }
    get handler() {
        return this._handler;
    }
    set handler(handler) {
        this._handler = handler;
    }
    async _updateObject(_, formData) {
        if (!formData || formData === {})
            return;
        this.handler(formData);
    }
}

export default ImportGenericForm;