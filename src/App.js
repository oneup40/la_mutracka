import './App.css';
import {useCallback, useState, useMemo, useEffect, Fragment} from 'react';
import store from 'store2';

import {ReqList, RequirementsLoader} from './RequirementsLoader.js';
import RequirementsList from './RequirementsList.js';
import {StartRegionTask, StartWeaponTask, TransitionTask, NPCTask, AwakenTask, ItemCheckTask, ShopItemTask, SealCheckTask, WinTask} from './Task.js';
import {defaultSettings, GameSettings} from './GameSettings.js';
import Status from './Status.js';

import Universe from './Universe.js';

function invertSubset(subset, all) {
    return new Set(Array.from(all.keys()).filter(key => !subset.has(key)));
}

function SelectableItemList({name, choices, selected, onChange}) {
    let onInputChanged = useCallback(event => {
        let value = event.target.value;
        let checked = event.target.checked;

        if (selected.has(value) !== checked) {
            let nextSelected = new Set(selected);
            if (checked) {
                nextSelected.add(value);
            } else {
                nextSelected.delete(value);
            }

            let nextUnselected = invertSubset(nextSelected, new Set(choices.keys()));

            onChange({
                name,
                selected: nextSelected,
                unselected: nextUnselected
            });
        }
    }, [name, choices, selected, onChange]);

    let ret = (
        <fieldset>
            <legend>{name}</legend>
            {Array.from(choices.entries()).map(([key, value]) => (
                <Fragment key={value}>
                    <input key={value + '-input'} type='checkbox' id={value} value={key} checked={selected.has(key)} onChange={onInputChanged}/>
                    <label key={value + '-label'} htmlFor={value}>{key}</label>
                </Fragment>
            ))}
        </fieldset>
    );

    return ret;
}

let weaponChoices = new Map(Universe.items.byCategory('weapon').map(x => [x.name, x.key]));
let subweaponChoices = new Map(Universe.items.byCategory('subweapon').map(x => [x.name, x.key]));
let usableChoices = new Map(Universe.items.byCategory('usable').map(x => [x.name, x.key]));
let itemChoices = new Map(Universe.items.byCategory('item').map(x => [x.name, x.key]));
let sealChoices = new Map(Universe.items.byCategory('seal').map(x => [x.name, x.key]));
let softwareChoices = new Map(Universe.items.byCategory('software').map(x => [x.name, x.key]));

function calculateSettingsRoots({settings}) {
    let roots = new Set();
    let notRoots = new Set();

    // XXX
    roots.add('State: Endless L1 Open');

    let basicMap = new Map([
        ['lamp-glitch', 'Setting: Lamp Glitch'],
        ['cat-pause', 'Setting: Cat Pause'],
        ['raindrop', 'Setting: Raindrop'],
        ['ice-raindrop', 'Setting: Ice Raindrop'],
        ['pot-clip', 'Setting: Pot Clip'],
        ['object-zip', 'Setting: Object Zip'],
        ['screen-mash', 'Setting: Screen Mash'],

        ['boost-item', 'Boost: Item'],
        ['boost-environment', 'Boost: Environment'],
        ['boost-enemy', 'Boost: Enemy'],

        ['autoread-grail', 'Setting: Autoread Grail'],
        ['automatic-mantras', 'Setting: Skip Mantras'],
        ['automatic-translations', 'Setting: La-Mulanese'],
        ['ushumgallu-assist', 'Setting: Ushumgallu Assist'],

        ['featherless', 'Setting: Featherless'],

        ['fools-2020', 'Setting: Fools2020'],

        ['subweapon-only', 'Setting: Subweapon Only'],

        ['alternate-start', 'Setting: Alternate Start'],
        ['frontside-start', 'Setting: Frontside Start'],
        ['backside-start', 'Setting: Backside Start'],
    ]);

    Array.from(basicMap.entries()).forEach(([key, value]) => {
        if (settings[key]) {
            roots.add(value);
        } else {
            notRoots.add(value);
        }
    });

    let inverseMap = new Map([
        ['automatic-hard-mode', 'Mode: Normal'],

        ['require-key-fairy-combo', 'Setting: No Combo Key Fairy'],
        ['require-ice-cape', 'Setting: Lava HP'],
        ['require-flare-gun', 'Setting: Flareless Extinction'],

        ['raindrop', 'Setting: No Raindrop'],
    ]);

    Array.from(inverseMap.entries()).forEach(([key, value]) => {
        if (settings[key]) {
            notRoots.add(value);
        } else {
            roots.add(value);
        }
    });

    if (settings['fools-2021']) {
        roots.add('Setting: Fools2021');
        notRoots.add('Setting: Not Fools2021');
    } else {
        roots.add('Setting: Not Fools2021');
        notRoots.add('Setting: Fools2021');
    }

    if (settings['reduced-boss-count']) {
        roots.add('Setting: Reduced Boss Count');
        roots.add('Setting: 7 Bosses');
        notRoots.add('Setting: 8 Bosses');
    } else {
        roots.add('Setting: 8 Bosses');
        notRoots.add('Setting: Reduced Boss Count');
        notRoots.add('Setting: 7 Bosses');
    }

    roots.add('Setting: Normal Pushing');

    if (settings['randomize-transition-gates']) {
        roots.add('Setting: Random Transitions');
        notRoots.add('Setting: Nonrandom Transitions');
    } else {
        roots.add('Setting: Nonrandom Transitions');
        notRoots.add('Setting: Random Transitions');
    }

    if (settings['alternate-mother-ankh']) {
        roots.add('Setting: Alternate Mother');
        notRoots.add('Setting: Standard Mother');
    } else {
        roots.add('Setting: Standard Mother');
        notRoots.add('Setting: Alternate Mother');
    }

    if (settings['fixed-jewels']) {
        roots.add('Setting: Fixed Jewels');
        notRoots.add('Setting: Variable Jewels');
    } else {
        roots.add('Setting: Variable Jewels');
        notRoots.add('Setting: Fixed Jewels');
    }

    if (settings['abnormal-boss']) {
        roots.add('Setting: Abnormal Boss');
        notRoots.add('Setting: Normal Boss');
    } else {
        roots.add('Setting: Normal Boss');
        notRoots.add('Setting: Abnormal Boss');
    }

    return [roots, notRoots];
}

let settings = new Set([
    "Boost: Enemy",
    "Boost: Environment",
    "Boost: Item",
    "Mode: Normal",
    "Setting: Abnormal Boss",
    "Setting: Alternate Mother",
    "Setting: Alternate Start",
    "Setting: Autoread Grail",
    "Setting: Backside Start",
    "Setting: 1 Bosses",
    "Setting: 4 Bosses",
    "Setting: 5 Bosses",
    "Setting: 6 Bosses",
    "Setting: 7 Bosses",
    "Setting: 8 Bosses",
    "Setting: Featherless",
    "Setting: Fixed Jewels",
    "Setting: Flareless Extinction",
    "Setting: Fools2020",
    "Setting: Fools2021",
    "Setting: Frontside Start",
    "Setting: La-Mulanese",
    "Setting: Lava HP",
    "Setting: No Combo Key Fairy",
    "Setting: No Raindrop",
    "Setting: Nonrandom Transitions",
    "Setting: Normal Boss",
    "Setting: Normal Pushing",
    "Setting: Not Fools2021",
    "Setting: Random Transitions",
    "Setting: Reduced Boss Count",
    "Setting: Skip Mantras",
    "Setting: Standard Mother",
    "Setting: Subweapon Only",
    "Setting: Ushumgallu Assist",
    "Setting: Variable Jewels",

    "Setting: Cat Pause",
    "Setting: Ice Raindrop",
    "Setting: Lamp Glitch",
    "Setting: Object Zip",
    "Setting: Pot Clip",
    "Setting: Raindrop",
    "Setting: Screen Mash",
]);

function calculateAccess({reqs, roots}) {
    let access = new Set(roots);
    let lastSize = -1;

    while (access.size !== lastSize) {
        lastSize = access.size;

        let bossCount = 0;
        for (let boss of ['Amphisbaena', 'Sakit', 'Ellmac', 'Bahamut', 'Viy', 'Palenque', 'Baphomet', 'Tiamat']) {
            let node = `Event: ${boss} Defeated`;
            if (access.has(node)) {
                ++bossCount;
                access.add(`Bosses Defeated: ${bossCount}`);
            }
        }

        Array.from(reqs.entries()).forEach(([_, subset]) => {
            Array.from(subset.entries()).forEach(([target, choices]) => {
                if (!access.has(target) && choices.some(choice => choice.every(req => access.has(req)))) {
                    access.add(target);
                }
            });
        });
    }

    return access;
}

const defaultState = {
    roots: [],
    gameSettings: {...defaultSettings},
    connectionMap: [],
    ammoSources: [],
    importantNPCs: [],
    ankhJewels: 0,
    sacredOrbs: 0,
    startingRegion: null,
    sealMappings: [],
    sleepingPhilosophers: [],
    shops: [],
    completedTasks: []
};

const persistKey = 'lmt-state';

class TaskData {
    static nextTaskId = 0;

    constructor({type, key, connection, location, shopIndex, id}) {
        this.type = type;
        this.key = key;
        this.connection = (connection === undefined) ? null : connection;
        this.location = (location === undefined) ? null : location;
        this.shopIndex = (shopIndex === undefined) ? null : shopIndex;

        if (id === undefined) {
            this.id = TaskData.nextTaskId;
            ++TaskData.nextTaskId;
        } else {
            this.id = id;
        }
    }

    static newStartRegionTask() {
        return new TaskData({
            type: 'start-region',
            key: 'start-region',
        });
    }

    static newStartWeaponTask() {
        return new TaskData({
            type: 'start-weapon',
            key: 'start-weapon',
        });
    }

    static newTransitionTask(connection) {
        return new TaskData({
            type: 'transition',
            key: `trans-${connection.key}`,
            connection
        });
    }

    static newNPCTask(location) {
        return new TaskData({
            type: 'npc',
            key: `npc-${location.key}`,
            location
        });
    }

    static newItemCheckTask(location) {
        return new TaskData({
            type: 'check-item',
            key: `item-${location.key}`,
            location
        });
    }

    static newSealCheckTask(location) {
        return new TaskData({
            type: 'seal-check',
            key: `item-${location.key}`,
            location
        });
    }

    static newAwakenTask(location) {
        return new TaskData({
            type: 'awaken',
            key: `philo-${location.key}`,
            location
        });
    }

    static newShopItemTask(location, shopIndex) {
        return new TaskData({
            type: 'shop-item',
            key: `shop-${location.key}-${shopIndex}`,
            location,
            shopIndex
        });
    }

    static newWinTask() {
        return new TaskData({
            type: 'win',
            key: 'win'
        });
    }

    region() {
        let region = null;

        if (this.location !== null && this.location.regions.length > 0) {
            region = this.location.regions[0];
        } else if (this.connection !== null) {
            region = this.connection.region;
        } else {
            region = null;
        }

        return region;
    }

    field() {
        let region = this.region();
        if (region === null) {
            return null;
        }

        return region.field;
    }

    fieldName() {
        let field = this.field();
        if (field === null) {
            return '';
        }

        return field.name;
    }

    fieldIndex() {
        let field = this.field();
        if (field === null) {
            return -1;
        }

        return field.index;
    }

    static compare(a, b) {
        let n = a.fieldIndex() - b.fieldIndex();

        if (n === 0) {
            n = a.type.localeCompare(b.type);
        }

        if (n === 0 && a.shopIndex !== null && b.shopIndex !== null) {
            n = a.shopIndex - b.shopIndex;
        }

        if (n === 0) {
            n = a.key.localeCompare(b.key);
        }

        if (n === 0) {
            n = a.id - b.id;
        }

        return n;
    }
}

function App() {
    let [allReqs, setAllReqs] = useState(new Map());
    let [roots, setRoots] = useState(new Set());

    let [gameSettings, setGameSettings] = useState({...defaultSettings});

    let [connectionMap, setConnectionMap] = useState(new Map());
    let [ammoSources, setAmmoSources] = useState(new Map());
    let [importantNPCs, setImportantNPCs] = useState(new Map());
    let [ankhJewels, setAnkhJewels] = useState(0);
    let [sacredOrbs, setSacredOrbs] = useState(0);
    let [startingRegion, setStartingRegion] = useState(null);
    let [sealMappings, setSealMappings] = useState(() => {
        let entries = Universe.items.byCategory('seal').map(item => [item.key, new Set()]);
        return new Map(entries);
    });
    let [sleepingPhilosophers, setSleepingPhilosophers] = useState(new Map());
    let [shops, setShops] = useState(new Map());

    let [completedTasks, setCompletedTasks] = useState(new Set());

    let [stateLoaded, setStateLoaded] = useState(false);

    useEffect(() => {
        if (!stateLoaded) {
            let persistState = store.get(persistKey, {});
            for (let key of ['roots', 'gameSettings', 'connectionMap', 'ammoSources', 'importantNPCs',
                             'ankhJewels', 'sacredOrbs', 'startingRegion', 'sealMappings',
                             'sleepingPhilosophers', 'shops', 'completedTasks'])
            {
                if (persistState[key] === undefined) {
                    persistState[key] = defaultState[key];
                }
            }

            setRoots(new Set(persistState.roots));
            setGameSettings(persistState.gameSettings);     // XXX FIXME

            let cm = new Map();
            for (let [srcKey, dstKey] of persistState.connectionMap) {
                let dst = Universe.connections.byKey.get(dstKey);
                cm.set(srcKey, dst);
            }
            setConnectionMap(cm);

            let as = new Map();
            for (let [itemKey, srcKeys] of persistState.ammoSources) {
                let srcs = srcKeys.map(key => Universe.locations.byKey.get(key));
                as.set(itemKey, srcs);
            }
            setAmmoSources(as);

            let npcs = new Map();
            for (let [npcKey, locKey] of persistState.importantNPCs) {
                let npc = Universe.npcs.byKey.get(npcKey);
                let location = Universe.locations.byKey.get(locKey);
                npcs.set(npcKey, {npc, location});
            }
            setImportantNPCs(npcs);

            setAnkhJewels(persistState.ankhJewels);
            setSacredOrbs(persistState.sacredOrbs);

            let sr = null;
            if (persistState.startingRegion !== null) {
                sr = Universe.regions.byKey.get(persistState.startingRegion);
            }
            setStartingRegion(sr);

            let sm = new Map(Universe.items.byCategory('seal').map(item => [item.key, new Set()]));
            for (let [itemKey, root] of persistState.sealMappings) {
                if (sm.has(itemKey)) {
                    sm.get(itemKey).add(root);
                }
            }
            setSealMappings(sm);

            let sp = new Map();
            for (let locKey of persistState.sleepingPhilosophers) {
                let location = Universe.locations.byKey.get(locKey);
                sp.set(locKey, location);
            }
            setSleepingPhilosophers(sp);

            let s = new Map();
            for (let locKey of persistState.shops) {
                let location = Universe.locations.byKey.get(locKey);
                s.set(locKey, location);
            }
            setShops(s);

            setCompletedTasks(new Set(persistState.completedTasks));

            setStateLoaded(true);
        }
    }, [stateLoaded]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                roots: Array.from(roots)
            };
        });
    }, [roots]);

    useEffect(() => {
        // XXX FIXME
        store.transact(persistKey, o => {
            return {
                ...o,
                gameSettings
            };
        });
    }, [gameSettings]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                connectionMap: Array.from(connectionMap.entries()).map(([srcKey, dst]) => [srcKey, dst.key])
            };
        });
    }, [connectionMap]);

    useEffect(() => {
        store.transact(persistKey, o => {
            let asSave = [];
            for (let [itemKey, locations] of ammoSources) {
                asSave.push([itemKey, locations.map(loc => loc.key)]);
            }

            return {
                ...o,
                ammoSources: asSave
            };
        });
    }, [ammoSources]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                importantNPCs: Array.from(importantNPCs.values()).map(({npc, location}) => [npc.key, location.key])
            };
        });
    }, [importantNPCs]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                ankhJewels
            };
        });
    }, [ankhJewels]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                sacredOrbs
            };
        });
    }, [sacredOrbs]);

    useEffect(() => {
        store.transact(persistKey, o => {
            let sr = null;
            if (startingRegion !== null) {
                sr = startingRegion.key;
            }

            return {
                ...o,
                startingRegion: sr
            };
        });
    }, [startingRegion]);

    useEffect(() => {
        store.transact(persistKey, o => {
            let sm = [];
            Array.from(sealMappings.entries()).forEach(([itemKey, roots]) => {
                Array.from(roots).forEach(root => {
                    sm.push([itemKey, root]);
                });
            });

            return {
                ...o,
                sealMappings: sm
            };
        });
    }, [sealMappings]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                sleepingPhilosophers: Array.from(sleepingPhilosophers.keys())
            };
        });
    }, [sleepingPhilosophers]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                shops: Array.from(shops.keys())
            };
        });
    }, [shops]);

    useEffect(() => {
        store.transact(persistKey, o => {
            return {
                ...o,
                completedTasks: Array.from(completedTasks)
            };
        });
    }, [completedTasks]);

    const activeReqs = useMemo(() => {
        let excludedReqs = new Set();
        switch (gameSettings.difficulty) {
            case 'medium':
                console.log('excluding bosses_hard reqs');
                excludedReqs.add('bosses_hard');
                break;
            case 'hard':
                console.log('excluding bosses_medium reqs');
                excludedReqs.add('bosses_medium');
                break;
            default:
                console.error(`unknown difficulty: ${gameSettings.difficulty}`);
                break;
        }

        return new Map(Array.from(allReqs.entries()).filter(([key, _]) => !excludedReqs.has(key)));
    }, [allReqs, gameSettings]);

    const access = useMemo(() => {
        let computedRoots = new Set(roots);

        // TODO: exit logic?
        computedRoots.add('Exit: Door F8');

        let [settingsRoots, _] = calculateSettingsRoots({settings: gameSettings});
        for (let root of settingsRoots) {
            computedRoots.add(root);
        }

        if (ankhJewels > 0) {
            computedRoots.add('Ankh Jewel');
        }
        if (ankhJewels === 9) {
            computedRoots.add('Ankh Jewel: 9');
        }

        for (let i = 0; i <= sacredOrbs; ++i) {
            computedRoots.add(`State: ${i}-Orb HP`);
            computedRoots.add(`Sacred Orb: ${i}`);
        }

        let seals = Universe.items.byCategory('seal');
        let sealCount = 0;
        for (let seal of seals) {
            if (roots.has(seal.root)) {
                ++sealCount;

                let nodes = Array.from(sealMappings.get(seal.key));
                for (let node of nodes) {
                    computedRoots.add(node);
                }
            }
        }

        if (sealCount === seals.length) {
            for (let x of ['O','B','L','D']) {
                for (let i = 1; i < 10; ++i) {
                    let root = `Seal: ${x}${i}`;
                    computedRoots.add(root);
                }
            }
        }

        if (startingRegion !== null) {
            if (startingRegion.isAlternateStart()) {
                computedRoots.add('Setting: Alternate Start');
            }

            if (startingRegion.isFrontside()) {
                computedRoots.add('Setting: Frontside Start');
            }

            if (startingRegion.isBackside()) {
                computedRoots.add('Setting: Backside Start');
            }
        }

        return calculateAccess({reqs: activeReqs, roots: computedRoots});
    }, [roots, ankhJewels, sacredOrbs, sealMappings, startingRegion, activeReqs, gameSettings]);

    const tasks = useMemo(() => {
        let tasks = [];

        if (!completedTasks.has('start-region')) {
            tasks.push(TaskData.newStartRegionTask());
        }
        if (!completedTasks.has('start-weapon')) {
            tasks.push(TaskData.newStartWeaponTask());
        }

        for (let node of access) {
            if (node.startsWith('Transition:')) {
                let conn = Universe.connections.byRoot.get(node);
                if (conn === undefined) {
                    console.error(`Unknown transition '${node}'`);
                }
                if (conn.isSource()) {
                    tasks.push(TaskData.newTransitionTask(conn));
                }
            }

            if (node.startsWith('NPCL:')) {
                let loc = Universe.locations.byRoot.get(node);
                if (loc === undefined) {
                    console.error(`Unknown NPC location '${node}'`);
                }
                tasks.push(TaskData.newNPCTask(loc));
            }

            if (node.startsWith('Check:') || node.startsWith('Coin:') || node.startsWith('Trap:')) {
                let location = Universe.locations.byRoot.get(node);
                if (location === undefined) {
                    console.error(`Unknown item location '${node}'`);
                }

                tasks.push(TaskData.newItemCheckTask(location));
            }

            if (node.startsWith('Location:')) {
                let region = Universe.regions.byRoot.get(node);
                if (region === undefined) {
                    console.error(`Unknown region '${node}'`);
                }

                let locations = Universe.locations.withTag('seal').filter(loc => loc.regions.some(locRegion => locRegion === region));

                locations.forEach(loc => tasks.push(TaskData.newSealCheckTask(loc)));

                let connections = Universe.connections.byType('door').filter(conn => conn.region === region);
                connections.filter(conn => conn.isSource()).forEach(conn => {
                    tasks.push(TaskData.newTransitionTask(conn));
                });
            }

            if (node.startsWith('Win:')) {
                tasks.push(TaskData.newWinTask());
            }
        }

        Array.from(sleepingPhilosophers.entries()).forEach(([_, location]) => {
            tasks.push(TaskData.newAwakenTask(location));
        });

        Array.from(shops.entries()).forEach(([_, location]) => {
            for (let i = 1; i <= 3; ++i) {
                tasks.push(TaskData.newShopItemTask(location, i));
            }
        });

        if (startingRegion !== null && startingRegion.isAlternateStart()) {
            let synthLoc = new Universe.Location({
                name: 'Starting Shop',
                root: null,
                regions: [startingRegion],
                key: 'location-starting-shop'
            });

            for (let i = 1; i <= 3; ++i) {
                tasks.push(TaskData.newShopItemTask(synthLoc, i));
            }
        }

        window.tasks = tasks.filter(task => !completedTasks.has(task.key))
                    .sort(TaskData.compare);
        return tasks.filter(task => !completedTasks.has(task.key))
                    .sort(TaskData.compare);

    }, [access, startingRegion, sleepingPhilosophers, shops, completedTasks]);

    function addRoots(roots) {
        setRoots(r => {
            let nextR = new Set(r);
            for (let root of roots) {
                nextR.add(root);
            }
            return nextR;
        });
    }

    function addSealMapping({item, node}) {
        setSealMappings(sealMappings => {
            let nextNodes = new Set(sealMappings.get(item.key));
            nextNodes.add(node);

            let nextSealMappings = new Map(sealMappings);
            nextSealMappings.set(item.key, nextNodes);

            return nextSealMappings;
        });
    }

    function connect(src, dst) {
        setConnectionMap(cm => {
            let nextCm = new Map(cm);

            if (src.isSource() && dst.isDestination()) {
                nextCm.set(src.key, dst);
            }

            if (dst.isSource() && src.isDestination()) {
                nextCm.set(dst.key, src);
            }

            return nextCm;
        });
    }

    function addAmmo({item, location}) {
        setAmmoSources(as => {
            let nextAs = new Map(as);

            let sourceList = nextAs.get(item.key);
            if (sourceList === undefined) {
                sourceList = [];
                nextAs.set(item.key, sourceList);
            }

            sourceList.push(location);

            return nextAs;
        });
    }

    function addNPC({npc, location}) {
        setImportantNPCs(npcs => {
            let nextNPCs = new Map(npcs);
            nextNPCs.set(npc.key, {npc, location});
            return nextNPCs;
        });
    }

    function addSleepingPhilosopher(location) {
        setSleepingPhilosophers(sp => {
            let nextSp = new Map(sp);
            nextSp.set(location.key, location);
            return nextSp;
        });
    }

    function addShop(location) {
        setShops(s => {
            let nextS = new Map(s);
            nextS.set(location.key, location);
            return nextS;
        });
    }

    let onTaskSubmit = useCallback((args) => {
        if (args.newRoots !== undefined) {
            addRoots(args.newRoots);
        }

        if (args.newSleepingPhilosophers !== undefined) {
            args.newSleepingPhilosophers.forEach(location => addSleepingPhilosopher(location));
        }

        if (args.newShops !== undefined) {
            args.newShops.forEach(location => addShop(location));
        }

        if (args.newAnkhJewels !== undefined) {
            setAnkhJewels(n => n + args.newAnkhJewels);
        }

        if (args.newSacredOrbs !== undefined) {
            setSacredOrbs(n => n + args.newSacredOrbs);
        }

        if (args.completedTasks !== undefined) {
            for (let completedTask of args.completedTasks) {
                setCompletedTasks(tasks => {
                    let nextTasks = new Set(tasks);
                    nextTasks.add(completedTask);
                    return nextTasks;
                });
            }
        }

        if (args.startingRegion !== undefined) {
            setStartingRegion(args.startingRegion);
        }

        if (args.newSealMappings !== undefined) {
            Array.from(args.newSealMappings.entries()).forEach(([node, item]) => addSealMapping({item, node}));
        }

        if (args.newConnections !== undefined) {
            args.newConnections.forEach(([src, dst]) => connect(src, dst));
        }

        if (args.newAmmos !== undefined) {
            args.newAmmos.forEach(([item, location]) => addAmmo({item, location}));
        }

        if (args.newNPCs !== undefined) {
            args.newNPCs.forEach(([npc, location]) => addNPC({npc, location}));
        }

    }, []);

    let onReqsLoaded = useCallback(({reqs}) => {
        let itemReqs = reqs.get('item');
        let newItemReqs = new Map();

        Array.from(itemReqs.entries()).forEach(([key, value]) => {
            let newKey = `Check: ${key}`;
            newItemReqs.set(newKey, value);
        });

        reqs.set('item', new ReqList(newItemReqs));

        setAllReqs(reqs);
    }, [setAllReqs]);

    let onSelectableItemsChanged = useCallback(({selected}) => {
        addRoots(selected.keys());
    }, []);

    let onGameSettingsChanged = useCallback(({key, value}) => {
        setGameSettings(settings => {
            return { ...settings, [key]: value }
        });
    }, []);

    let onClearState = useCallback(() => {
        store.set(persistKey, {});
        setStateLoaded(false);
    }, []);

    return (
        <div className="App">
            <button onClick={onClearState}>Clear State</button>
            <GameSettings settings={gameSettings} onChange={onGameSettingsChanged}/>
            <fieldset>
                <SelectableItemList name='Settings' choices={settings} selected={access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Weapons' choices={weaponChoices} selected={access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Subweapons' choices={subweaponChoices} selected={access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Usable Items' choices={usableChoices} selected={access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Items' choices={itemChoices} selected={access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Seals' choices={sealChoices} selected={access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Software' choices={softwareChoices} selected={access} onChange={onSelectableItemsChanged}/>
            </fieldset>
            <RequirementsLoader onLoaded={onReqsLoaded} />
            <Status
                connectionMap={connectionMap}
                ammoSources={ammoSources}
                ankhJewels={ankhJewels}
                sacredOrbs={sacredOrbs}
                importantNPCs={importantNPCs}
                startingRegion={startingRegion}
            />
            <div className='tasks-list'>
                {tasks.map(task => {
                    switch (task.type) {
                        case 'start-region':
                            return <StartRegionTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                        case 'start-weapon':
                            return <StartWeaponTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                        case 'transition':
                            return <TransitionTask key={task.key} id={task.key} connection={task.connection} connectionMap={connectionMap} onSubmit={onTaskSubmit}/>;
                        case 'npc':
                            return <NPCTask key={task.key} id={task.key} location={task.location} onSubmit={onTaskSubmit}/>;
                        case 'awaken':
                            return <AwakenTask key={task.key} id={task.key} access={access} location={task.location} onSubmit={onTaskSubmit}/>;
                        case 'check-item':
                            return <ItemCheckTask key={task.key} id={task.key} location={task.location} onSubmit={onTaskSubmit}/>;
                        case 'shop-item':
                            return <ShopItemTask key={task.key} id={task.key} location={task.location} index={task.shopIndex} onSubmit={onTaskSubmit}/>;
                        case 'seal-check':
                            return <SealCheckTask key={task.key} id={task.key} location={task.location} access={access} onSubmit={onTaskSubmit}/>;
                        case 'win':
                            return <WinTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                        default:
                            // console.error('unknown task type:', task.type);
                            return null;
                    }
                })}
            </div>
            <RequirementsList reqs={activeReqs} accessible={access} />
        </div>
    );
}

export default App;

// TODO: escape route
// TODO: show seal locations
// TODO: fix settings startup
// TODO: nebur shop 4+ item
// TODO: understand exit logic, specifically DC
// TODO: other location randomization options?
// TODO: break up more blockable tasks (cursed chests, door checks, shop purchases, etc.)
// TODO: remove field name from connection in field status?
// TODO: hide collected item choices?
// TODO: better organization of choices
// TODO: optimize access logic
// TODO: testing?
// TODO: take logic into account for shrine/mulbruk distances
// TODO: handle annexes better for shrine/mulbruk
// TODO: gate of time start

// done:
// TODO: philosopher visited events
// TODO: fix seal locations (many-to-one)
// TODO: mekuri NPC option
// TODO: mini doll NPC option
// TODO: Ankh Jewel: 9
// TODO: Bosses Defeated: 8
// TODO: add Treasures item
// TODO: endless map?
// TODO: inferno trap orb
// TODO: check alternate jewels default, normal boss
// TODO: Go mode
// TODO: skip seal tasks when having all 4
// TODO: fix endless one-way direction
// TODO: fix NPC: The Fairy Queen
// TODO: escape chest default
// TODO: remove SealCheck tasks when last seal is found
// TODO: show transitions
// TODO: reciprocal connections
// TODO: connection choices
// TODO: door tasks
// TODO: lint
// TODO: starting shop
// TODO: show ammo locations
// TODO: fix seal hiding logic
// TODO: add doors to field status
// TODO: hide transitions to self
// TODO: important NPC status
// TODO: don't hide transitions for many-to-one
// TODO: fix boss difficulty reqs
// TODO: Sacred Orb roots < N
// TODO: save/clear state

// Feather isn't logic for Coin: Mauso???
// Test Flail Whip check w/, w/o feather
// NPC sphinx logic
