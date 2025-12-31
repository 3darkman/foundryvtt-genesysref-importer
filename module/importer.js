import ImportItemForm from "../scripts/import-item-form.js";
import processItems from "../scripts/process-items.js";
import {CONSTANTS} from "../scripts/constants.js";
import {processActors} from "../scripts/process-actors.js";

async function preloadTemplates() {
    const templatePaths = [
        // Add paths to "modules/foundryvtt-importer/templates"
        `modules/${CONSTANTS.module.name}/templates/import-item-template.hbs`,
    ];
    return loadTemplates(templatePaths);
}

async function handleInput(input) {
    const parsedItem = await processItems(input);
    const parsedActors = await processActors(input);
}

async function processItemInput({ jsonfile, clipboardInput }) {
    if (clipboardInput) {
        await handleInput(clipboardInput);
    }
}

Hooks.on('renderItemDirectory', (app, html, data) => {
    console.log(`${CONSTANTS.module.name} | hook on renderSidebarTab`);
    if (!game?.user?.isGM)
        return;
    renderSidebarButtons(html, 'items', processItemInput);
});

function renderSidebarButtons(html, tab, handler) {
    //if (settings.id !== tab)
      //  return;
    const name = tab.charAt(0).toUpperCase() + tab.slice(1);
    console.log(`${CONSTANTS.module.name} | rendering import button ${html}`);

    const $html = html instanceof jQuery ? html : $(html);

    if ($html.find('#inputButton').length !== 0)
        return;

    const button = `<button id="inputButton" style="flex-basis: auto;">
  <i class="fas fa-atlas"></i> Import ${name}
</button>`;
    $html.find(`.header-actions`).first().append(button);
    $html.find('#inputButton').on('click', async (e) => {
        e.preventDefault();
        switch (tab) {
            case 'items': {
                const form = new ImportItemForm({ handler, tab });
                form.render(true);
                break;
            }
        }
    });
}

Hooks.once('init', async () => {
    console.log(`${CONSTANTS.module.name} | Initializing ${CONSTANTS.module.title}`);
    await preloadTemplates();
});