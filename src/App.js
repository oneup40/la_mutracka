// import './App.css';
import {useCallback, useReducer, useState, Fragment} from 'react';

import {ReqList, RequirementsLoader} from './RequirementsLoader.js';
import RequirementsList from './RequirementsList.js';
import {StartLocationTask, StartWeaponTask, TransitionTask, NPCTask, SleepingPhilosopherTask, ItemCheckTask, ShopItemTask, SealCheckTask, DoorCheckTask, WinTask} from './Task.js';
import {defaultSettings, GameSettings} from './GameSettings.js';

import {connections, npcLocations, items, itemLocations, sealLocations, doorLocations} from './World.js';

function invertSubset(subset, all) {
    return new Set(Array.from(all.keys()).filter(key => !subset.has(key)));
}

function invertMapSubset(subset, all) {
    return new Map(Array.from(all.entries()).filter(([key, value]) => !subset.has(key)));
}

function SelectableItemList({name, choices, selected, onChange}) {
    let onInputChanged = useCallback(event => {
        let key = event.target.id;
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
    }, [choices, selected, onChange]);

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

let weaponChoices = new Map(items.weapons.map(x => [x.name, x.key]));
let subweaponChoices = new Map(items.subweapons.map(x => [x.name, x.key]));
let usableChoices = new Map(items.usable.map(x => [x.name, x.key]));
let itemChoices = new Map(items.items.map(x => [x.name, x.key]));
let sealChoices = new Map(items.seals.map(x => [x.name, x.key]));
let softwareChoices = new Map(items.software.map(x => [x.name, x.key]));

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

function calculateInitialRoots({settings}) {
    let [roots, notRoots] = calculateSettingsRoots({settings});

    // TODO: exit logic is confusing
    for (let frontback of ['F','B']) {
        for (let i = 1; i < 10; ++i) {
            let root = `Exit: Door ${frontback}${i}`;
            roots.add(root);
        }
    }

    return roots;
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

let allTrackedMaps = [weaponChoices, subweaponChoices, usableChoices, itemChoices, sealChoices, softwareChoices];
let allTracked = [].concat(allTrackedMaps.map(map => Array.from(map.keys()), Array.from(settings)));

function calculateAccess({reqs, prevAccess, roots}) {
    // let access = new Set([].concat(Array.from(prevAccess), Array.from(roots)));
    let access = new Set(roots);
    let newAccess = new Set(Array.from(roots).filter(root => !prevAccess.has(root)));
    let lastSize = -1;

    while (access.size != lastSize) {
        lastSize = access.size;

        Array.from(reqs.entries()).forEach(([subsetName, subset]) => {
            Array.from(subset.entries()).forEach(([target, choices]) => {
                if (!access.has(target) && choices.some(choice => choice.every(req => access.has(req)))) {
                    access.add(target);
                    if (!prevAccess.has(target)) {
                        newAccess.add(target);
                    }
                }
            });
        });
    }

    return {access, newAccess};
}

function App() {
    let [state, dispatch] = useReducer((state, action) => {
        function setReqs(state, action) {
            let reqs = new Map(action.reqs);
            let itemReqs = reqs.get('item');
            let newItemReqs = new Map();

            Array.from(itemReqs.entries()).forEach(([key, value]) => {
                let newKey = `Check: ${key}`;
                newItemReqs.set(newKey, value);
            });

            reqs.set('item', new ReqList(newItemReqs));

            return {
                ...state,
                reqs
            };
        }

        function setDifficulty(state, action) {
            return {
                ...state,
                difficulty: action.value
            };
        }

        function handleRootChange(state, nextRoots) {
            let {access, newAccess} = calculateAccess({reqs: state.reqs, prevAccess: state.access, roots: nextRoots});

            let nextState = {
                ...state,
                roots: nextRoots,
                access
            };

            let extraRoots = [];

            let newTasks = [];
            Array.from(newAccess).filter(value => value.startsWith('Transition:')).forEach(value => {
                let conn = connections.byLogic.get(value);
                if (conn === undefined) {
                    console.error(`Unknown transition '${value}'`);
                }
                newTasks.push({
                    type: 'transition',
                    key: 'trans-' + conn.key,
                    connection: conn
                });
            });
            Array.from(newAccess).filter(value => value.startsWith('NPCL:')).forEach(value => {
                let location = npcLocations.byLogic.get(value);
                if (location === undefined) {
                    console.error(`Unknown NPC location '${value}'`);
                }
                newTasks.push({
                    type: 'npc',
                    key: 'npc-' + location.key,
                    location: location
                });
            });
            Array.from(newAccess).filter(value => value.startsWith('Check:') || value.startsWith('Coin:') || value.startsWith('Trap:')).forEach(value => {
                let location = itemLocations.byLogic.get(value);
                if (location === undefined) {
                    console.error(`Unknown item location '${value}'`);
                }
                newTasks.push({
                    type: 'item-check',
                    key: 'item-' + location.key,
                    location: location
                });
            });
            Array.from(newAccess).forEach(value => {
                let sealLocs = sealLocations.byLocation.get(value);
                if (sealLocs !== undefined) {
                    if (nextRoots.has('Origin Seal') && nextRoots.has('Birth Seal') && nextRoots.has('Life Seal') && nextRoots.has('Death Seal')) {
                        Array.from(sealLocs).forEach(sealLoc => {
                            extraRoots.push(sealLoc.logic);
                        });
                    } else {
                        Array.from(sealLocs).forEach(sealLoc => {
                            newTasks.push({
                                type: 'seal-check',
                                key: 'seal-' + sealLoc.key,
                                sealLoc
                            });
                        });
                    }
                }
            });
            Array.from(newAccess).forEach(value => {
                let doorLoc = doorLocations.byLocation.get(value);
                if (doorLoc !== undefined) {
                    newTasks.push({
                        type: 'door-check',
                        key: 'door-' + doorLoc.key,
                        name: doorLoc.human
                    });
                }
            });
            Array.from(newAccess).forEach(value => {
                switch (value) {
                    case 'Event: Amphisbaena Defeated':
                    case 'Event: Sakit Defeated':
                    case 'Event: Ellmac Defeated':
                    case 'Event: Bahamut Defeated':
                    case 'Event: Viy Defeated':
                    case 'Event: Palenque Defeated':
                    case 'Event: Baphomet Defeated':
                    case 'Event: Tiamat Defeated':
                        ++nextState.bossesDefeated;
                        extraRoots.push(`Bosses Defeated: ${nextState.bossesDefeated}`);
                        break;
                }
            });
            Array.from(newAccess).forEach(value => {
                if (value.startsWith('Win:')) {
                    newTasks.push({
                        type: 'win',
                        key: 'win'
                    });
                }
            });

            newTasks = newTasks.filter(task => !state.completedTasks.has(task.key));

            nextState = addTasks(nextState, {tasks: newTasks});
            if (extraRoots.length > 0) {
                nextState = addRoots(nextState, {roots: extraRoots});
            }
            return nextState;
        }

        function addRoots(state, action) {
            let nextRoots = new Set(state.roots);
            action.roots.forEach(value => {
                nextRoots.add(value);
                if (state.sealMappings.has(value)) {
                    Array.from(state.sealMappings.get(value)).forEach(seal => {
                        nextRoots.add(seal);
                    });
                }
            });

            return handleRootChange(state, nextRoots);
        }

        function removeRoots(state, action) {
            let nextRoots = new Set(state.roots);
            action.roots.forEach(value => {
                nextRoots.delete(value);

                if (state.sealMappings.has(value)) {
                    Array.from(state.sealMappings.get(value)).forEach(seal => {
                        nextRoots.delete(seal);
                    });
                }
            });

            return handleRootChange(state, nextRoots);
        }

        function addTasks(state, action) {
            let nextTasks = [].concat(state.tasks, action.tasks);
            return {
                ...state,
                tasks: nextTasks
            };
        }

        function completeTasks(state, action) {
            let completedIds = new Set(action.taskIds);

            let nextTasks = state.tasks.filter(task => !completedIds.has(task.key));

            let nextCompletedTasks = new Set(state.completedTasks);
            Array.from(completedIds).forEach(id => nextCompletedTasks.add(id));

            return {
                ...state,
                tasks: nextTasks,
                completedTasks: nextCompletedTasks,
            };
        }

        function addAnkhJewels(state, action) {
            let nextAnkhJewels = state.ankhJewels + action.ankhJewels;
            let nextState = {
                ...state,
                ankhJewels: nextAnkhJewels
            }
            if (nextAnkhJewels > 0) {
                nextState = addRoots(nextState, {roots: ['Ankh Jewel']});
            }
            if (nextAnkhJewels === 9) {
                nextState = addRoots(nextState, {roots: ['Ankh Jewel: 9']});
            }
            
            return nextState;   
        }

        function addSacredOrbs(state, action) {
            let nextSacredOrbs = state.sacredOrbs + action.sacredOrbs;
            let nextState = {
                ...state,
                sacredOrbs: nextSacredOrbs
            }

            let newRoots = [];
            for (let i = 0; i <= nextSacredOrbs; ++i) {
                newRoots.push(`State: ${i}-Orb HP`);
            }

            nextState = addRoots(nextState, {roots: newRoots});

            return nextState;
        }

        function setGameSetting(state, action) {
            let nextGameSettings = {
                ...state.gameSettings,
                [action.key]: action.value
            };

            let nextState = {
                ...state,
                gameSettings: nextGameSettings
            };

            let [roots, notRoots] = calculateSettingsRoots({settings: nextState.gameSettings});

            nextState = addRoots(nextState, {roots: roots});
            nextState = removeRoots(nextState, {roots: notRoots});

            return nextState;
        }

        function setStartingLocation(state, action) {
            let settings = [];

            let nextState = state;

            switch (action.location) {
                case 'Location: Surface [Main]':
                    nextState = setGameSetting(nextState, {key: 'alternate-start', value: false});
                    nextState = setGameSetting(nextState, {key: 'frontside-start', value: true});
                    nextState = setGameSetting(nextState, {key: 'backside-start', value: false});
                    break;
                case 'Location: Gate of Guidance [Main]':
                case 'Location: Mausoleum of the Giants':
                case 'Location: Temple of the Sun [Main]':
                case 'Location: Spring in the Sky [Main]':
                case 'Location: Inferno Cavern [Main]':
                case 'Location: Chamber of Extinction [Main]':
                case 'Location: Twin Labyrinths [Poison 1]':
                case 'Location: Endless Corridor [1F]':
                case 'Location: Gate of Time [Surface]':
                    nextState = setGameSetting(nextState, {key: 'alternate-start', value: true});
                    nextState = setGameSetting(nextState, {key: 'frontside-start', value: true});
                    nextState = setGameSetting(nextState, {key: 'backside-start', value: false});
                    nextState = addTasks(nextState, {tasks: [
                        {type: 'shop-item', key: 'shop-start-0', location: 'Starting Shop', index: 0},
                        {type: 'shop-item', key: 'shop-start-1', location: 'Starting Shop', index: 1},
                        {type: 'shop-item', key: 'shop-start-2', location: 'Starting Shop', index: 2},
                    ]});
                    break;
                case 'Location: Gate of Illusion [Grail]':
                case 'Location: Graveyard of the Giants [Grail]':
                case 'Location: Temple of Moonlight [Grail]':
                case 'Location: Tower of the Goddess [Grail]':
                case 'Location: Chamber of Birth [West Entrance]':
                case 'Location: Twin Labyrinths [Lower]':
                    nextState = setGameSetting(nextState, {key: 'alternate-start', value: true});
                    nextState = setGameSetting(nextState, {key: 'frontside-start', value: false});
                    nextState = setGameSetting(nextState, {key: 'backside-start', value: true});
                    nextState = addTasks(nextState, {tasks: [
                        {type: 'shop-item', key: 'shop-start-0', location: 'Starting Shop', index: 0},
                        {type: 'shop-item', key: 'shop-start-1', location: 'Starting Shop', index: 1},
                        {type: 'shop-item', key: 'shop-start-2', location: 'Starting Shop', index: 2},
                    ]});

                    break;
                default:
                    console.error(`unknown starting location ${action.location}`);
                    break;
            }

            return nextState;
        }

        function addSealMapping(state, action) {
            let nextLogics = new Set(state.sealMappings.get(action.item));
            nextLogics.add(action.logic);

            let nextSealMappings = new Map(state.sealMappings);
            nextSealMappings.set(action.item, nextLogics);

            let nextState = {
                ...state,
                sealMappings: nextSealMappings
            };

            if (state.roots.has(action.item)) {
                nextState = addRoots(state, {roots: [action.logic]});
            }

            return nextState;
        }

        switch (action.type) {
            case 'setReqs':
                return setReqs(state, action);
            case 'setDifficulty':
                return setDifficulty(state, action);
            case 'addRoots':
                return addRoots(state, action);
            case 'removeRoots':
                return removeRoots(state, action);
            case 'addTasks':
                return addTasks(state, action);
            case 'addAnkhJewels':
                return addAnkhJewels(state, action);
            case 'addSacredOrbs':
                return addSacredOrbs(state, action);
            case 'setGameSetting':
                return setGameSetting(state, action);
            case 'completeTasks':
                return completeTasks(state, action);
            case 'setStartingLocation':
                return setStartingLocation(state, action);
            case 'addSealMapping':
                return addSealMapping(state, action);
            default:
                console.error(`unexpected action.type '${action.type}'`);
        }
    },
    {
        reqs: new Map(),
        difficulty: 'medium',
        roots: calculateInitialRoots({settings: defaultSettings}),
        access: new Set(),
        ankhJewels: 0,
        sacredOrbs: 0,
        tasks: [
            {type: 'start-location', key: 'start-location'},
            {type: 'start-weapon', key: 'start-weapon'}
        ],
        completedTasks: new Set(),
        gameSettings: {
            ...defaultSettings
        },
        sealMappings: new Map([
            ['Origin Seal', new Set()],
            ['Birth Seal', new Set()],
            ['Life Seal', new Set()],
            ['Death Seal', new Set()]
        ]),
        bossesDefeated: 0,
    });

    let onTaskSubmit = useCallback((args) => {
        if (args.newRoots !== undefined) {
            dispatch({
                type: 'addRoots',
                roots: args.newRoots
            });
        }

        if (args.newSleepingPhilosophers !== undefined) {
            let newTasks = args.newSleepingPhilosophers.map(location => {
                return {
                    type: 'sleeping-philosopher',
                    key: 'philo-' + location.key,
                    location: location
                }
            });
            dispatch({
                type: 'addTasks',
                tasks: newTasks
            });
        }

        if (args.newShops !== undefined) {
            let newTasks = [];
            args.newShops.forEach(location => {
                for (let i = 1; i <= 3; ++i) {
                    newTasks.push({
                        type: 'shop-item',
                        key: `shop-${location.key}-${i}`,
                        location: location.human,
                        index: i
                    });
                }
            });
            dispatch({
                type: 'addTasks',
                tasks: newTasks
            });
        }

        if (args.newAnkhJewels !== undefined) {
            dispatch({
                type: 'addAnkhJewels',
                ankhJewels: args.newAnkhJewels
            });
        }

        if (args.newSacredOrbs !== undefined) {
            dispatch({
                type: 'addSacredOrbs',
                sacredOrbs: args.newSacredOrbs
            });
        }

        if (args.completedTasks !== undefined) {
            dispatch({
                type: 'completeTasks',
                taskIds: args.completedTasks
            });
        }

        if (args.startingLocation !== undefined) {
            dispatch({
                type: 'setStartingLocation',
                location: args.startingLocation
            });
        }

        if (args.newSealMappings !== undefined) {
            Array.from(args.newSealMappings.entries()).forEach(([logic, item]) => {
                dispatch({
                    type: 'addSealMapping',
                    item,
                    logic
                });
            });
        }

    });

    let onReqsLoaded = useCallback(({reqs}) => {
        dispatch({
            type: 'setReqs',
            reqs: reqs
        });
    }, []);
    let onDifficultyChanged = useCallback(event => {
        dispatch({
            type: 'setDifficulty',
            value: event.target.value
        });
    }, []);
    let onEnableAll = useCallback(event => {
        allTrackedMaps.forEach(map => {
            dispatch({
                type: 'addRoots',
                roots: Array.from(map.keys())
            });
        });
    });

    let onSelectableItemsChanged = useCallback(({name, selected, unselected}) => {
        dispatch({
            type: 'addRoots',
            roots: Array.from(selected.keys())
        });
    }, []);

    let onGameSettingsChanged = useCallback(({key, value}) => {
        dispatch({
            type: 'setGameSetting',
            key,
            value
        });
    }, []);

    let curReqs = new Map(state.reqs);
    if (state.difficulty === 'medium') {
        curReqs.delete('bosses_hard');
    } else if (state.difficulty === 'hard') {
        curReqs.delete('bosses_medium');
    }

    return (
        <div className="App">
            <GameSettings settings={state.gameSettings} onChange={onGameSettingsChanged}/>
            <fieldset>
                <legend>Settings</legend>
                <fieldset>
                    <legend>Difficulty</legend>
                    <select name="difficulty" id="difficulty" onChange={onDifficultyChanged}>
                        <option value="medium">medium</option>
                        <option value="hard">hard</option>
                    </select>
                </fieldset>

                <SelectableItemList name='Settings' choices={settings} selected={state.access} onChange={onSelectableItemsChanged}/>
            </fieldset>
            <fieldset>
                <legend>Status</legend>
                <SelectableItemList name='Weapons' choices={weaponChoices} selected={state.access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Subweapons' choices={subweaponChoices} selected={state.access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Usable Items' choices={usableChoices} selected={state.access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Items' choices={itemChoices} selected={state.access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Seals' choices={sealChoices} selected={state.access} onChange={onSelectableItemsChanged}/>
                <SelectableItemList name='Software' choices={softwareChoices} selected={state.access} onChange={onSelectableItemsChanged}/>
                <div>Ankh Jewels: {state.ankhJewels}</div>
                <div>Max HP: {32 * (1 + state.sacredOrbs)}</div>
            </fieldset>
            <RequirementsLoader onLoaded={onReqsLoaded} />
            {state.tasks.map(task => {
                switch (task.type) {
                    case 'start-location':
                        return <StartLocationTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                    case 'start-weapon':
                        return <StartWeaponTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                    case 'transition':
                        return <TransitionTask key={task.key} id={task.key} connection={task.connection} onSubmit={onTaskSubmit}/>;
                    case 'npc':
                        return <NPCTask key={task.key} id={task.key} location={task.location} onSubmit={onTaskSubmit}/>;
                    case 'sleeping-philosopher':
                        return <SleepingPhilosopherTask key={task.key} id={task.key} access={state.access} location={task.location} onSubmit={onTaskSubmit}/>;
                    case 'item-check':
                        return <ItemCheckTask key={task.key} id={task.key} location={task.location} onSubmit={onTaskSubmit}/>;
                    case 'shop-item':
                        return <ShopItemTask key={task.key} id={task.key} location={task.location} index={task.index} onSubmit={onTaskSubmit}/>;
                    case 'seal-check':
                        return <SealCheckTask key={task.key} id={task.key} sealLoc={task.sealLoc} onSubmit={onTaskSubmit}/>;
                    case 'door-check':
                        return <DoorCheckTask key={task.key} id={task.key} name={task.name} onSubmit={onTaskSubmit}/>;
                    case 'win':
                        return <WinTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                    default:
                        console.error('unknown task type:', task.type);
                        return null;
                }
            })}
            <RequirementsList reqs={curReqs} accessible={state.access} />
        </div>
    );
}
            

export default App;

// TODO?: cursed tasks
// TODO?: purchase tasks
// TODO?: boss tasks
// TODO: door tasks
// TODO: escape route
// TODO: show ammo locations
// TODO: show seal locations
// TODO: show transitions
// TODO: starting shop
// TODO: reciprocal connections
// TODO: connection choiecs
// TODO: fix settings startup
// TODO: remove SealCheck tasks when last seal is found
// TODO: lint
// TODO: nebur shop 4+ item
// TODO: understand exit logic, specifically DC

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

// Feather isn't logic for Coin: Mauso???
// Test Flail Whip check w/, w/o feather
