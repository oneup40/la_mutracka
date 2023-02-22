import './Task.css';
import {useCallback} from 'react';
import {Planet} from 'react-planet';

import Universe from './Universe.js';

function StartLocationTaskSatellite({region, onClick}) {
    return (
        <button onClick={() => onClick(region)}>{region.fullName()}</button>
    );
}

export function StartLocationTask({id, onSubmit}) {
    let onClick = useCallback(region => {
        if (onSubmit) {
            onSubmit({
                newRoots: region.startRoots(),
                completedTasks: [id],
                startingLocation: region
            });
        }
    }, [id, onSubmit]);

    return (
        <div
            className='Task StartLocationTask'
        >
            <Planet
                centerContent={<button>Start Location</button>}
                autoClose
                orbitRadius={180}
            >
                {Universe.regions.withTag('grail-tablet').map(region => {
                    return <StartLocationTaskSatellite key={region.key} region={region} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}


function StartWeaponTaskSatellite({item, onClick}) {
    return (
        <button onClick={() => onClick(item)}>{item.name}</button>
    );
}

export function StartWeaponTask({id, onSubmit}) {
    let onClick = useCallback(item => {
        let newRoots = [item.root];
        if (item.hasAmmo()) {
            newRoots.push(item.ammo.root);
        }

        if (onSubmit) {
            onSubmit({
                newRoots,
                completedTasks: [id]
            });
        }
    }, [id, onSubmit]);

    return (
        <div
            className='Task StartWeaponTask'
        >
            <Planet
                centerContent={<button>Start Weapon</button>}
                autoClose
                orbitRadius={180}
            >
                {Universe.items.withTag('start-weapon').map(item => {
                    return <StartWeaponTaskSatellite key={item.key} item={item} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

function TransitionTaskSatellite({connection, onClick}) {
    return (
        <button onClick={() => onClick(connection)}>{connection.name}</button>
    );
}

export function TransitionTask({id, connection, connectionMap, onSubmit}) {
    let onClick = useCallback(dstConn => {
        if (onSubmit) {
            onSubmit({
                newRoots: [dstConn.root],
                newConnections: [[connection, dstConn]],
                completedTasks: [id]
            });
        }
    }, [connection, id, onSubmit]);

    if (connectionMap.has(connection.key)) {
        return null;
    } else {
        return (
            <div
                className='Task TransitionTask'
            >
                <Planet
                    centerContent={<button>Transition: {connection.name}</button>}
                    autoClose
                    orbitRadius={180}
                >
                    {connection.candidates().filter(conn => conn !== connection && (connection.tags.has('alias') || !connectionMap.has(conn.key))).map(conn => {
                        return <TransitionTaskSatellite key={conn.key} connection={conn} onClick={onClick} />;
                    })}
                </Planet>
            </div>
        );
    }
}

class NPCChoice {
    constructor({name, key}) {
        this.name = name;
        this.key = key;
    }
}

function NPCTaskSatellite({choice, onClick}) {
    return (
        <button onClick={() => onClick(choice.key)}>{choice.name}</button>
    );
}

export function NPCTask({id, location, onSubmit}) {
    let onClick = useCallback(key => {
        let e = {
            completedTasks: [id]
        };

        if (key.startsWith('dummy-')) {
            switch (key) {
                case 'dummy-shop':
                    e.newShops = [location];
                    break;
                case 'dummy-philosopher':
                    e.newSleepingPhilosophers = [location];
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
                e.newShops = [location];
            }

            if (npc.tags.has('revisit')) {
                e.newNPCs = [[npc, location]];
            }
        }

        if (onSubmit) {
            onSubmit(e);
        }
    }, [id, location, onSubmit]);

    let choices = [].concat(
        Universe.npcs.all.map(npc => new NPCChoice(npc)),
        [
            {name: 'Shop', key: 'dummy-shop'},
            {name: 'Sleeping Philosopher', key: 'dummy-philosopher'},
            {name: 'Generic', key: 'dummy-generic'}
        ].map(x => new NPCChoice(x))
    );

    return (
        <div
            className='Task NPCTask'
        >
            <Planet
                centerContent={<button>NPC: {location.name}</button>}
                autoClose
                orbitRadius={180}
            >
                {choices.map(choice => {
                    return <NPCTaskSatellite key={choice.key} choice={choice} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

function SleepingPhilosopherTaskSatellite({npc, onClick}) {
    return (
        <button onClick={() => onClick(npc)}>{npc.name}</button>
    );
}

const ocarina = Universe.items.byKey.get('philosophers-ocarina');
if (ocarina === undefined) {
    console.error('Unable to find philosophers-ocarina item');
}

export function SleepingPhilosopherTask({id, access, location, onSubmit}) {
    let onClick = useCallback(npc => {
        if (onSubmit) {
            onSubmit({
                newRoots: [npc.root],
                completedTasks: [id]
            });
        }
    }, [id, onSubmit]);

    if (access.has(ocarina.root)) {
        return (
            <div
                className='Task SleepingPhilosopherTask'
            >
                <Planet
                    centerContent={<button>Awaken Philosopher: {location.name}</button>}
                    autoClose
                    orbitRadius={80}
                >
                    {Universe.npcs.withTag('philosopher').map(npc => {
                        return <SleepingPhilosopherTaskSatellite key={npc.key} npc={npc} onClick={onClick} />;
                    })}
                </Planet>
            </div>
        );
                
    } else {
        return null;
    }
}

class ItemChoice {
    constructor({name, key}) {
        this.name = name;
        this.key = key;
    }
}

function ItemCheckItemSatellite({choice, onClick}) {
    return (
        <button onClick={() => onClick(choice.key)}>{choice.name}</button>
    );
}

function ItemCheckCategorySatellite({name, choices, onClick}) {
    return (
        <Planet
            centerContent={<button>{name}</button>}
            autoClose
            orbitRadius={180}
        >
            {choices.map(choice => {
                return <ItemCheckItemSatellite key={choice.key} choice={choice} onClick={onClick} />;
            })}
        </Planet>
    );
}

export function ItemCheckTask({id, location, onSubmit}) {
    let onClick = useCallback(key => {
        let e = {
            completedTasks: [id]
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

                if (item.category === 'seal') {
                    e.newSeals = [item];
                }
                break;
            }
        }

        if (onSubmit) {
            onSubmit(e);
        }
    }, [id, onSubmit]);

    function getCategoryItemChoices(cat) {
        return Universe.items.byCategory(cat).map(item => new ItemChoice(item));
    }

    return (
        <div
            className='Task ItemCheckTask'
        >
            <Planet
                centerContent={<button>{location.name}</button>}
                autoClose
                orbitRadius={80}
            >
                <ItemCheckCategorySatellite name='Weapons' choices={getCategoryItemChoices('weapon')} onClick={onClick} />
                <ItemCheckCategorySatellite name='Subweapons' choices={getCategoryItemChoices('subweapon')} onClick={onClick} />
                <ItemCheckCategorySatellite name='Usable Items' choices={getCategoryItemChoices('usable')} onClick={onClick} />
                <ItemCheckCategorySatellite name='Items' choices={getCategoryItemChoices('item')} onClick={onClick} />
                <ItemCheckCategorySatellite name='Seals' choices={getCategoryItemChoices('seal')} onClick={onClick} />
                <ItemCheckCategorySatellite name='Software' choices={getCategoryItemChoices('software')} onClick={onClick} />
                <ItemCheckItemSatellite choice={new ItemChoice({name: 'Ankh Jewel', key: 'ankh-jewel'})} onClick={onClick}/>
                <ItemCheckItemSatellite choice={new ItemChoice({name: 'Sacred Orb', key: 'sacred-orb'})}  onClick={onClick}/>
                <ItemCheckItemSatellite choice={new ItemChoice({name: 'Map (Shrine)', key: 'map-shrine'})}  onClick={onClick}/>
                <ItemCheckItemSatellite choice={new ItemChoice({name: 'Junk', key: 'dummy-junk'})} onClick={onClick}/>
            </Planet>
        </div>
    );
}

function ShopItemItemSatellite({choice, onClick}) {
    return (
        <button onClick={() => onClick(choice.key)}>{choice.name}</button>
    );
}

function ShopItemCategorySatellite({name, choices, onClick}) {
    return (
        <Planet
            centerContent={<button>{name}</button>}
            autoClose
            orbitRadius={180}
        >
            {choices.map(choice => {
                return <ShopItemItemSatellite key={choice.key} choice={choice} onClick={onClick} />;
            })}
        </Planet>
    );
}

export function ShopItemTask({id, location, index, onSubmit}) {
    let onClick = useCallback(key => {
        let e = {
            completedTasks: [id]
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

                if (item.category === 'ammo') {
                    e.newAmmos = [[item, location]];
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
    }, [id, location, onSubmit]);

    function getCategoryItemChoices(cat) {
        return Universe.items.byCategory(cat).map(item => new ItemChoice(item));
    }

    return (
        <div
            className='Task ShopItemTask'
        >
            <Planet
                centerContent={<button>{location.name} Shop Item {index}</button>}
                autoClose
                orbitRadius={80}
            >
                <ShopItemCategorySatellite name='Weapons' choices={getCategoryItemChoices('weapon')} onClick={onClick} />
                <ShopItemCategorySatellite name='Subweapons' choices={getCategoryItemChoices('subweapon')} onClick={onClick} />
                <ShopItemCategorySatellite name='Ammo' choices={getCategoryItemChoices('ammo')} onClick={onClick} />
                <ShopItemCategorySatellite name='Usable Items' choices={getCategoryItemChoices('usable')} onClick={onClick} />
                <ShopItemCategorySatellite name='Items' choices={getCategoryItemChoices('item')} onClick={onClick} />
                <ShopItemCategorySatellite name='Seals' choices={getCategoryItemChoices('seal')} onClick={onClick} />
                <ShopItemCategorySatellite name='Software' choices={getCategoryItemChoices('software')} onClick={onClick} />
                <ShopItemItemSatellite choice={new ItemChoice({name: 'Ankh Jewel', key: 'ankh-jewel'})} onClick={onClick}/>
                <ShopItemItemSatellite choice={new ItemChoice({name: 'Sacred Orb', key: 'sacred-orb'})}  onClick={onClick}/>
                <ShopItemItemSatellite choice={new ItemChoice({name: 'Map (Shrine)', key: 'map-shrine'})}  onClick={onClick}/>
                <ShopItemItemSatellite choice={new ItemChoice({name: 'Junk', key: 'dummy-junk'})} onClick={onClick}/>
            </Planet>
        </div>
    );
}

function SealCheckTaskSatellite({item, onClick}) {
    return (
        <button onClick={() => onClick(item)}>{item.name}</button>
    );
}

export function SealCheckTask({id, location, access, onSubmit}) {
    let onClick = useCallback(item => {
        let newSealMappings = new Map([
            [location.root, item.root]
        ]);

        if (onSubmit) {
            onSubmit({
                newSealMappings,
                completedTasks: [id],
            });
        }
    }, [id, location, onSubmit]);

    if (Universe.items.byCategory('seal').every(item => access.has(item.root))) {
        return null;
    } else {
        return (
            <div
                className='Task SealCheckTask'
            >
                <Planet
                    centerContent={<button>Seal: {location.name}</button>}
                    autoClose
                    orbitRadius={180}
                >
                    {Universe.items.byCategory('seal').map(item => {
                        return <SealCheckTaskSatellite key={item.key} item={item} onClick={onClick} />;
                    })}
                </Planet>
            </div>
        );
    }
}

function DoorCheckTaskSatellite({connection, onClick}) {
    return (
        <button onClick={() => onClick(connection)}>{connection.name}</button>
    );
}

export function DoorCheckTask({id, connection, connectionMap, onSubmit}) {
    let onClick = useCallback(dstConn => {
        if (onSubmit) {
            onSubmit({
                newRoots: [dstConn.root],
                newConnections: [[connection, dstConn]],
                completedTasks: [id]
            });
        }
    }, [connection, id, onSubmit]);

    if (connectionMap.has(connection.key)) {
        return null;
    } else {
        return (
            <div
                className='Task DoorCheckTask'
            >
                <Planet
                    centerContent={<button>Door: {connection.name}</button>}
                    autoClose
                    orbitRadius={180}
                >
                    {connection.candidates().filter(conn => conn !== connection && !connectionMap.has(conn.key)).map(conn => {
                        return <DoorCheckTaskSatellite key={conn.key} connection={conn} onClick={onClick} />;
                    })}
                </Planet>
            </div>
        );
    }
}

// export function WinTask({id, onSubmit}) {
    /*let onClick = useCallback(event => {
        if (onSubmit) {
            onSubmit({
                completedTasks: [id]
            });
        }
    }, [id, onSubmit]);*/

export function WinTask() {
    return (
        <div
            className='Task WinTask'
        >
            <Planet
                centerContent={<button>Win the Game</button>}
                autoClose
                orbitRadius={180}
            >
            </Planet>
        </div>
    );
}
