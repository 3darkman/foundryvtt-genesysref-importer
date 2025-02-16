export const CONSTANTS = Object.freeze({
    module: {
        name: 'genesysref-importer',
        title: 'Genesys Ref Importer',
    },
    divisions: {
        meta: '_meta',
        quality: 'quality',
        gear: 'gear',
        adversary:'adversary',
        adversaryAbility: 'adversaryAbility',
        archetype: 'archetype',
        archetypeAbility: 'archetypeAbility',
        career: 'career',
        skill: 'skill',
        spell: 'spell',
        talent: 'talent'
    },
    types: {
        armor: "armor",
        consumable: "consumable",
        container: "container",
        gear: "gear",
        quality: "quality",
        weapon: "weapon",
        vehicleWeapon: "vehicleWeapon",
        ability: "ability",
        archetype: "archetype",
        career: "career",
        injury: "injury",
        skill: "skill",
        talent: "talent"
    },
    actorsTypes: {
        character: "character",
        minion: "minion",
        rival: "rival",
        nemesis: "nemesis",
        vehicle: "vehicle",
    },
    sources: {
        "twilight imperium": "eoti",
        android: "sotb",
        terrinoth: "rot",
        keyforge: "sotc"
    },
    symbols: {
        advantage: "a",
        success: "s",
        triumph: "t",
        threat: "h",
        failure: "f",
        despair: "d",
    },
    dices: [
        { names: ["boost", "blue", "b"], value: "B"},
        { names: ["setback", "black", "k"], value: "S"},
        { names: ["ability", "green", "g"], value: "A"},
        { names: ["difficulty", "purple", "p"], value: "D"},
        { names: ["proficiency", "yellow", "y"], value: "P"},
        { names: ["challenge", "red", "r"], value: "C"}
    ],
    difficulty: {
        simple: "-",
        easy: "@dice[D]",
        average: "@dice[DD]",
        hard: "@dice[DDD]",
        daunting: "@dice[DDDD]",
        formidable: "@dice[DDDDD]",
    },
    checkboxState: {
        true: "yes",
        false: "no"
    },
    activationType: {
        active: "active",
        passive: "passive"
    },
    activeEffectChangeMode: {
        add: "2",
    },
    skillTexts: {
        shouldUseHeader: "<h3>Your character should use this skill if...</h3>",
        shouldNotUseHeader: "<h3>Your character should not use this skill if...</h3>",
    },
    referenceLinks: {
        adversary: /{@adversary ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        archetype: /{@archetype ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        career: /{@career ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        characteristic: /{@characteristic ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        gear: /{@gear ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        quality: /{@quality ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        optionFeature: /{@optionFeature ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        rule: /{@rule ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        setting: /{@setting ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        skill: /{@skill ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        spell: /{@spell ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        table: /{@table ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        talent: /{@talent ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        vehicle: /{@vehicle ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
        sidebar: /{@sidebar ([\w(),. ]*)\|?([\w(),. ]*)\|?([\w(),. ]*)}/g,
    }
});