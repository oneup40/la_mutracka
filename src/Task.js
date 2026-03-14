import './Task.scss';
import {useCallback} from 'react';
import Popup from 'reactjs-popup';

import Universe from './Universe.js';

export function StartRegionTask({task, onSubmit}) {
    let onClick = useCallback(region => {
        if (onSubmit) {
            onSubmit({
                newRoots: region.startRoots(),
                completedTasks: [task],
                startingRegion: region
            });
        }
    }, [task, onSubmit]);
 
    return (
        <Popup
            className='task-root'
            trigger={<div className='task-root'>Start Region</div>}
            position="right center"
            arrow={false}
        >
            <div className='task-choice-field-grid'>
                {Universe.regions.withTag('grail-tablet').map(region => {
                    let icon = null;
                    if (region.field.icon !== null) {
                        let classes = ["region-field-icon"];
                        if (region.isBackside()) {
                            classes.push("region-backside");
                        }
                        icon = <img className={classes.join(" ")} alt="" src={`/assets/img/${region.field.icon}.png`} />;
                    }

                    return (
                        <div key={region.key} className={['task-choice','start-region',region.field.key,region.key].join(' ')} onClick={() => onClick(region)}>
                            {icon}
                            <span className='region-field-name'>{region.field.name}</span>
                            <span className='region-name'>{region.name}</span>
                        </div>
                    );
                })}
            </div>
        </Popup>
    );
}

export function StartWeaponTask({task, onSubmit}) {
    let onClick = useCallback(item => {
        let newRoots = [item.root];
        if (item.hasAmmo()) {
            newRoots.push(item.ammo.root);
        }
        if (item.name === 'Pistol') {
            // probably a better way to do this, but matches Main::getStartingNodes
            newRoots.push('Attack: Pistol');
        }

        if (onSubmit) {
            onSubmit({
                newRoots,
                completedTasks: [task]
            });
        }
    }, [task, onSubmit]);

    return (
        <Popup
            className='task-root'
            trigger={<div className='task-root'>Start Weapon</div>}
            position="right center"
            arrow={false}
        >
            <div className='task-choice-start-weapon-grid'>
                {Universe.items.withTag('start-weapon').map(item => {
                    return (<img
                                key={item.key}
                                src={`/assets/img/item/${item.key}.png`}
                                alt={item.name}
                                className={['task-choice','weapon',item.key].join(' ')}
                                onClick={() => onClick(item)} 
                    />);
                })}
            </div>
        </Popup>
    );
}

function ConnectionChoice({connection, onClick}) {
    return (
        <div
            className={['task-choice','connection',connection.region.field.key,connection.region.key].join(' ')}
            onClick={() => onClick(connection)}
        >
            <span className='connection-name'>{connection.name}</span>
        </div>
    );
}

function ConnectionList({dstConns, onClick}) {
    return (
        <div className='task-choice-connection-grid'>
            {Universe.fields.all.map(field => {
                let conns = dstConns.filter(conn => conn.region.field === field);

                if (conns.length > 0) {
                    let icon = null;
                    if (field.icon !== null) {
                        let classes = ["region-field-icon"];
                        if (field.tags.has('backside')) {
                            classes.push("region-backside");
                        }
                        icon = <img className={classes.join(" ")} alt="" src={`/assets/img/${field.icon}.png`} />;
                    }

                    return (
                        <div key={field.key} className={['task-choice-connection-field',field.key].join(' ')}>
                            <div className='field-label'>
                                {icon}
                                <div className='region-name'>{field.name}</div>
                            </div>
                            {conns.map(conn => <ConnectionChoice key={conn.key} connection={conn} onClick={onClick} />)}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export function TransitionTask({task, connectionMap, onSubmit}) {
    let srcConn = task.connection;

    let onClick = useCallback(dstConn => {
        if (onSubmit) {
            onSubmit({
                newRoots: [dstConn.root],
                newConnections: [[srcConn, dstConn]],
                completedTasks: [task]
            });
        }
    }, [srcConn, task, onSubmit]);

    let dstConns = srcConn.candidates()
                   .filter(dstConn => dstConn !== srcConn)
                   .filter(dstConn => (srcConn.tags.has('alias') || !connectionMap.has(dstConn.key)));

    let taskText = null;
    switch (srcConn.type) {
        case 'door':
            taskText = `Door: ${srcConn.name}`;
            break;
        default:
            taskText = `Transition: ${srcConn.region.field.name} ${srcConn.name}`;
            break;
    }

    if (connectionMap.has(task.connection.key)) {
        return null;
    } else {
        return (
            <Popup
                className='task-root'
                trigger={<div className='task-root'>{taskText}</div>}
                position="right center"
                arrow={false}
            >
                <ConnectionList dstConns={dstConns} onClick={onClick} />
            </Popup>
        );
    }
}

class Choice {
    constructor({name, key}) {
        this.name = name;
        this.key = key;
    }
}

export function ChoiceCategory({name, nameKey, choices, onClick}) {
    return (
        <div className={['category', nameKey].join(' ')}>
            <div className='label'>
                <div className='text'>{name}</div>
            </div>
            {choices.map(choice => {
                return <div key={choice.key} className='task-choice' onClick={() => onClick(choice.key)}>{choice.name}</div>;
            })}
        </div>
    )
}

export function NPCTask({task, onSubmit}) {
    let onClick = useCallback(key => {
        let e = {
            completedTasks: [task]
        };

        if (key.startsWith('dummy-')) {
            switch (key) {
                case 'dummy-shop':
                    e.newShops = [task.location];
                    break;
                case 'dummy-sleeping':
                    e.newSleepingPhilosophers = [task.location];
                    break;
                case 'dummy-generic':
                    break;
                default:
                    console.error(`unknown dummy key ${key}`);
                    break;
            }
        } else {
            let npc = Universe.npcs.byKey.get(key);
            if (npc === undefined) {
                console.error(`unknown NPC key ${key}`);
            }

            e.newRoots = [npc.root];

            if (npc.tags.has('shop')) {
                e.newShops = [task.location];
            }

            if (npc.tags.has('revisit')) {
                e.newNPCs = [[npc, task.location]];
            }
        }

        if (onSubmit) {
            onSubmit(e);
        }
    }, [task, onSubmit]);

    let miscChoices = Universe.npcs.withTag('important').map(npc => new Choice(npc));
    let itemChoices = Universe.npcs.withTag('item').map(npc => new Choice(npc));
    let shopChoices = Universe.npcs.withTag('shop').map(npc => new Choice(npc));
    let philoChoices = Universe.npcs.withTag('philosopher').map(npc => new Choice(npc));

    miscChoices.push(new Choice({name: 'Generic', key: 'dummy-generic'}));
    shopChoices.push(new Choice({name: 'Shop', key: 'dummy-shop'}));
    philoChoices.push(new Choice({name: 'Sleeping', key: 'dummy-sleeping'}));

    return (
        <Popup
            className='task-root'
            trigger={<div className='task-root'>NPC: {task.location.name}</div>}
            position='right center'
            arrow={false}
        >
            <div className='task-choice-npc-grid'>
                <ChoiceCategory name="Misc" nameKey="misc" choices={miscChoices} onClick={onClick} />
                <ChoiceCategory name="Items" nameKey="item" choices={itemChoices} onClick={onClick} />
                <ChoiceCategory name="Shops" nameKey="shop" choices={shopChoices} onClick={onClick} />
                <ChoiceCategory name="Philosophers" nameKey="philosopher" choices={philoChoices} onClick={onClick} />
            </div>
        </Popup>
    );
}

const ocarina = Universe.items.byKey.get('philosophers-ocarina');
if (ocarina === undefined) {
    console.error('Unable to find philosophers-ocarina item');
}

export function AwakenTask({task, access, onSubmit}) {
    let onClick = useCallback(key => {
        if (onSubmit) {
            let npc = Universe.npcs.byKey.get(key);
            if (npc === undefined) {
                console.error(`unknown NPC key ${key}`);
            }

            onSubmit({
                newRoots: [npc.root],
                completedTasks: [task]
            });
        }
    }, [task, onSubmit]);

    if (access.has(ocarina.root)) {
        let philoChoices = Universe.npcs.withTag('philosopher').map(npc => new Choice(npc));

        return (
            <Popup
                className='task-root'
                trigger={<div className='task-root'>Awaken Philosopher: {task.location.name}</div>}
                position='right center'
                arrow={false}
            >
                <div className='task-choice-philosopher-grid'>
                    <ChoiceCategory name="Philosophers" nameKey="philosopher" choices={philoChoices} onClick={onClick} />
                </div>
            </Popup>
        );
    } else {
        return null;
    }
}

function ItemCategory ({name, category, onClick}) {
    return (
        <div className={['category','tag'].join(' ')}>
            <div className='label'>
                <div className='text'>{name}</div>
            </div>
            <div className={`task-choice-${category}-grid`}>
                {Universe.items.byCategory(category).map(item => {
                    return (
                        <img
                            src={`/assets/img/item/${item.key}.png`}
                            alt={item.name}
                            className={['task-choice',item.key].join(' ')}
                            key={item.key}
                            onClick={() => onClick(item.key)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export function ItemCheckTask({task, onSubmit}) {
    let onClick = useCallback(key => {
        let e = {
            completedTasks: [task]
        };

        switch (key) {
            case 'dummy-junk':
                break;
            case 'ankh-jewel':
                e.newAnkhJewels = 1;
                break;
            case 'sacred-orb':
                e.newSacredOrbs = 1;
                break;
            default: {
                let item = Universe.items.byKey.get(key);
                if (item === undefined) {
                    console.error(`unknown item key ${key}`);
                }

                e.newRoots = [item.root];
                break;
            }
        }

        if (onSubmit) {
            onSubmit(e);
        }
    }, [task, onSubmit]);

    let miscChoices = [
        new Choice({name: 'Ankh Jewel', key: 'ankh-jewel'}),
        new Choice({name: 'Sacred Orb', key: 'sacred-orb'}),
        new Choice({name: 'Map (Shrine)', key: 'map-shrine'}),
        new Choice({name: 'Junk', key: 'dummy-junk'})
    ];

    return (
        <Popup
            className='task-root'
            trigger={<div className='task-root'>{task.location.name}</div>}
            position='right center'
            arrow={false}
        >
            <div className='task-choice-item-category-grid'>
                <ItemCategory name="Weapons" category="weapon" onClick={onClick} />
                <ItemCategory name="Subweapons" category="subweapon" onClick={onClick} />
                <ItemCategory name="Usable Items" category="usable" onClick={onClick} />
                <ItemCategory name="Items" category="item" onClick={onClick} />
                <ItemCategory name="Seals" category="seal" onClick={onClick} />
                <ItemCategory name="Software" category="software" onClick={onClick} />

                <ChoiceCategory name='Misc' nameKey='misc' choices={miscChoices} onClick={onClick} />
            </div>
        </Popup>
    );
}

export function ShopItemTask({task, onSubmit}) {
    let onClick = useCallback(key => {
        let e = {
            completedTasks: [task]
        };

        switch (key) {
            case 'dummy-junk':
                break;
            case 'ankh-jewel':
                e.newAnkhJewels = 1;
                break;
            case 'sacred-orb':
                e.newSacredOrbs = 1;
                break;
            default: {
                let item = Universe.items.byKey.get(key);
                if (item === undefined) {
                    console.error(`unknown item key ${key}`);
                }

                e.newRoots = [item.root];
                e.newShopItems = [[item, task.location]];

                if (item.category === 'ammo') {
                    e.newAmmos = [[item, task.location]];
                }

                if (item.category === 'seal') {
                    e.newSeals = [item];
                }

                break;
            }
        }

        if (onSubmit) {
            onSubmit(e);
        }
    }, [task, onSubmit]);

    let miscChoices = [
        new Choice({name: 'Ankh Jewel', key: 'ankh-jewel'}),
        new Choice({name: 'Sacred Orb', key: 'sacred-orb'}),
        new Choice({name: 'Map (Shrine)', key: 'map-shrine'}),
        new Choice({name: 'Junk', key: 'dummy-junk'})
    ];

    let ammoChoices = Universe.items.byCategory('ammo').map(item => new Choice(item));

    return (
        <Popup
            className='task-root'
            trigger={<div className='task-root'>Shop: {task.location.name} Item {task.shopIndex}</div>}
            position='right center'
            arrow={false}
        >
            <div className='task-choice-item-category-grid'>
                <ItemCategory name="Weapons" category="weapon" onClick={onClick} />
                <ItemCategory name="Subweapons" category="subweapon" onClick={onClick} />
                <ItemCategory name="Usable Items" category="usable" onClick={onClick} />
                <ItemCategory name="Items" category="item" onClick={onClick} />
                <ItemCategory name="Seals" category="seal" onClick={onClick} />
                <ItemCategory name="Software" category="software" onClick={onClick} />

                <ChoiceCategory name="Ammo" category="ammo" choices={ammoChoices} onClick={onClick} />
                <ChoiceCategory name='Misc' nameKey='misc' choices={miscChoices} onClick={onClick} />
            </div>
        </Popup>
    );
}

export function SealCheckTask({task, access, onSubmit}) {
    let onClick = useCallback(item => {
        let newSealMappings = new Map([
            [task.location.root, item]
        ]);

        if (onSubmit) {
            onSubmit({
                newSealMappings,
                completedTasks: [task],
            });
        }
    }, [task, onSubmit]);

    if (Universe.items.byCategory('seal').every(item => access.has(item.root))) {
        return null;
    } else {
        return (
            <Popup
                className='task-root'
                trigger={<div className='task-root'>Seal: {task.location.name}</div>}
                position='right center'
                arrow={false}
            >
                <div className='task-choice-seal'>
                    <img
                        src='assets/img/sigil-origin.png'
                        alt='Origin Seal'
                        className='task-choice'
                        onClick={() => onClick(Universe.items.byKey.get('origin-seal'))}
                    />
                    <img
                        src='assets/img/sigil-birth.png'
                        alt='Birth Seal'
                        className='task-choice'
                        onClick={() => onClick(Universe.items.byKey.get('birth-seal'))}
                    />
                    <img
                        src='assets/img/sigil-life.png'
                        alt='Life Seal'
                        className='task-choice'
                        onClick={() => onClick(Universe.items.byKey.get('life-seal'))}
                    />
                    <img
                        src='assets/img/sigil-death.png'
                        alt='Death Seal'
                        className='task-choice'
                        onClick={() => onClick(Universe.items.byKey.get('death-seal'))}
                    />
                </div>
            </Popup>
        );
    }
}

export function WinTask() {
    return (
        <Popup
            className='task-root'
            trigger={<div className='task-root'>Win the Game</div>}
            position='right center'
            arrow={false}
        />
    );
}
