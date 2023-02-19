import './Task.css';
import {useCallback, useState} from 'react';
import {Planet} from 'react-planet';

import {connections, items, doorLocations} from './World.js';
import World from './World.yaml';

function StartLocationTaskSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

export function StartLocationTask({id, onSubmit}) {
    let onClick = useCallback(event => {
        let newRoots = [event.target.value];

        // cf: https://github.com/thezerothcat/LaMulanaRandomizer/blob/master/src/main/java/lmr/randomizer/Settings.java
        //     getStartingItemsIncludingCustom()
        if (event.target.value === 'Location: Twin Labyrinths [Poison 1]') {
            newRoots.push('Twin Statue');
        }
        if (event.target.value === 'Location: Tower of the Goddess [Grail]') {
            newRoots.push('Plane Model');
        }

        if (onSubmit) {
            onSubmit({
                newRoots,
                completedTasks: [id],
                startingLocation: event.target.value
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
                {Array.from(World.startingLocations).map(loc => {
                    let name = `${loc.short} ${loc.human}`;
                    return <StartLocationTaskSatellite key={loc.key} name={name} value={loc.logic} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

let startingWeapons = new Set([
    'Whip', 'Chain Whip', 'Flail Whip', 'Knife', 'Key Sword', 'Axe', 'Katana',
    'Shuriken', 'Rolling Shuriken', 'Earth Spear', 'Flare Gun', 'Bomb', 'Chakram', 'Caltrops', 'Pistol'
]);

function StartWeaponTaskSatellite({value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{value}</button>
    );
}

export function StartWeaponTask({id, onSubmit}) {
    let onClick = useCallback(event => {
        let choice = event.target.value;
        let newRoots = [choice];
        let subweapons = new Set(items.subweapons.map(item => item.name));
        if (subweapons.has(choice)) {
            newRoots.push(`${choice} Ammo`);
        }
        if (onSubmit) {
            onSubmit({
                newRoots,
                completedTasks: [id]
            });
        }
    }, [onSubmit]);

    return (
        <div
            className='Task StartWeaponTask'
        >
            <Planet
                centerContent={<button>Start Weapon</button>}
                autoClose
                orbitRadius={180}
            >
                {Array.from(startingWeapons.entries()).map(([value]) => {
                    return <StartWeaponTaskSatellite key={value} value={value} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

function TransitionTaskSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

export function TransitionTask({id, connection, onSubmit}) {
    let onClick = useCallback(event => {
        if (onSubmit) {
            let conn = connections.byKey.get(event.target.value);
            onSubmit({
                newRoots: [conn.logic],
                completedTasks: [id]
            });
        }
    }, [id, onSubmit]);

    let candidates = [];
    let buttonText = `Transition: ${connection.human}`;

    switch (connection.type) {
        case 'left':
            candidates = connections.right;
            break;
        case 'right':
            candidates = connections.left;
            break;
        case 'up':
            candidates = connections.down;
            break;
        case 'down':
            candidates = connections.up;
            break;
        case 'portal':
            candidates = connections.portal;
            break;
        default:
            console.error(`unexpected connection type: ${connection.type}`);
            break;
    }

    return (
        <div
            className='Task TransitionTask'
        >
            <Planet
                centerContent={<button>{buttonText}</button>}
                autoClose
                orbitRadius={180}
            >
                {candidates.map(conn => {
                    return <TransitionTaskSatellite key={conn.key} name={conn.extHuman()} value={conn.key} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

function NPCTaskSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

export function NPCTask({id, location, onSubmit}) {
    let onClick = useCallback(event => {
        let newRoots = [];
        let newSleepingPhilosophers = [];
        let newShops = [];

        switch (event.target.value) {
            case 'Shop':
                newShops.push(location);
                break;
            case 'Xelpud':
                newRoots.push('NPC: Elder Xelpud');
                break;
            case 'Mulbruk':
                newRoots.push('NPC: Mulbruk');
                break;
            case 'Sleeping Philosopher':
                newSleepingPhilosophers.push(location);
                break;
            case 'Giltoriyo':
                newRoots.push('NPC: Philosopher Giltoriyo');
                break;
            case 'Alsedana':
                newRoots.push('NPC: Philosopher Alsedana');
                break;
            case 'Samaranta':
                newRoots.push('NPC: Philosopher Samaranta');
                break;
            case 'Fobos':
                newRoots.push('NPC: Philosopher Fobos');
                break;
            case 'Fairy Queen':
                newRoots.push('NPC: The Fairy Queen');
                break;
            case 'Nebur Shop':
                newRoots.push('NPC: Nebur');
                newShops.push(location);
                break;
            case 'Lilbro Shop':
                newRoots.push('NPC: Yiegah Kungfu');
                newShops.push(location);
                break;
            case 'Treasures NPC':
                newRoots.push('NPC: Mr. Slushfund');
                break;
            case 'Mini Doll NPC':
                newRoots.push('NPC: Priest Alest');
                break;
            case 'Mekuri Master':
                newRoots.push('NPC: Former Mekuri Master');
                break;
            case 'Generic':
                break;
            default:
                console.error(`unexpected value: ${event.target.value}`);
                break;
        }

        if (onSubmit) {
            onSubmit({
                newRoots,
                newSleepingPhilosophers,
                newShops,
                completedTasks: [id],
            });
        }
    }, [id, onSubmit]);

    let choices = [
        'Shop',
        'Xelpud',
        'Mulbruk',
        'Sleeping Philosopher',
        'Giltoriyo',
        'Alsedana',
        'Samaranta',
        'Fobos',
        'Fairy Queen',
        'Nebur Shop',
        'Lilbro Shop',
        'Treasures NPC',
        'Mekuri Master',
        'Generic'
    ];

    return (
        <div
            className='Task NPCTask'
        >
            <Planet
                centerContent={<button>NPC: {location.human}</button>}
                autoClose
                orbitRadius={180}
            >
                {choices.map(choice => {
                    return <NPCTaskSatellite key={choice} name={choice} value={choice} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

function SleepingPhilosopherTaskSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

export function SleepingPhilosopherTask({id, access, location, onSubmit}) {
    let onClick = useCallback(event => {
        let newRoots = [];

        switch (event.target.value) {
            case 'Giltoriyo':
                newRoots.push('NPC: Philosopher Giltoriyo');
                break;
            case 'Alsedana':
                newRoots.push('NPC: Philosopher Alsedana');
                break;
            case 'Samaranta':
                newRoots.push('NPC: Philosopher Samaranta');
                break;
            case 'Fobos':
                newRoots.push('NPC: Philosopher Fobos');
                break;
            default:
                console.error(`unexpected value: ${event.target.value}`);
                break;
        }

        if (onSubmit) {
            onSubmit({
                newRoots,
                completedTasks: [id]
            });
        }
    }, [id, onSubmit]);

    if (access.has('Philosopher\'s Ocarina')) {
        let choices = [
            'Giltoriyo',
            'Alsedana',
            'Samaranta',
            'Fobos',
        ];

        return (
            <div
                className='Task SleepingPhilosopherTask'
            >
                <Planet
                    centerContent={<button>Awaken Philosopher: {location.human}</button>}
                    autoClose
                    orbitRadius={80}
                >
                    {choices.map(choice => {
                        return <SleepingPhilosopherTaskSatellite key={choice} name={choice} value={choice} onClick={onClick} />;
                    })}
                </Planet>
            </div>
        );
                
    } else {
        return null;
    }
}

function ItemCheckItemSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

function ItemCheckCategorySatellite({name, items, onClick}) {
    return (
        <Planet
            centerContent={<button>{name}</button>}
            autoClose
            orbitRadius={180}
        >
            {items.map(item => {
                return <ItemCheckItemSatellite key={item.key} name={item.name} value={item.key} onClick={onClick} />;
            })}
        </Planet>
    );
}

export function ItemCheckTask({id, location, onSubmit}) {
    let onClick = useCallback(event => {
        let e = {
            completedTasks: [id]
        };

        switch (event.target.value) {
            case 'junk':
                break;
            case 'ankh-jewel':
                e.newAnkhJewels = 1;
                break;
            case 'sacred-orb':
                e.newSacredOrbs = 1;
                break;
            default:
                if (!items.byKey.has(event.target.value)) {
                    console.error(`unknown item key ${event.target.value}`);
                } else {
                    let item = items.byKey.get(event.target.value);
                    e.newRoots = [item.name];
                }
                break;
        }

        if (onSubmit) {
            onSubmit(e);
        }
    }, [onSubmit]);

    return (
        <div
            className='Task ItemCheckTask'
        >
            <Planet
                centerContent={<button>{location.human}</button>}
                autoClose
                orbitRadius={80}
            >
                <ItemCheckCategorySatellite name='Weapons' items={items.weapons} onClick={onClick} />
                <ItemCheckCategorySatellite name='Subweapons' items={items.subweapons} onClick={onClick} />
                <ItemCheckCategorySatellite name='Usable Items' items={items.usable} onClick={onClick} />
                <ItemCheckCategorySatellite name='Items' items={items.items} onClick={onClick} />
                <ItemCheckCategorySatellite name='Seals' items={items.seals} onClick={onClick} />
                <ItemCheckCategorySatellite name='Software' items={items.software} onClick={onClick} />
                <ItemCheckItemSatellite name='Ankh Jewel' value='ankh-jewel' onClick={onClick}/>
                <ItemCheckItemSatellite name='Sacred Orb' value='sacred-orb' onClick={onClick}/>
                <ItemCheckItemSatellite name='Shrine Map' value='map-shrine' onClick={onClick}/>
                <ItemCheckItemSatellite name='Junk' value='junk' onClick={onClick}/>
            </Planet>
        </div>
    );
}

function ShopItemItemSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

function ShopItemCategorySatellite({name, items, onClick}) {
    return (
        <Planet
            centerContent={<button>{name}</button>}
            autoClose
            orbitRadius={180}
        >
            {items.map(item => {
                return <ShopItemItemSatellite key={item.key} name={item.name} value={item.key} onClick={onClick} />;
            })}
        </Planet>
    );
}

export function ShopItemTask({id, location, index, onSubmit}) {
    let onClick = useCallback(event => {
        let e = {
            completedTasks: [id]
        };

        switch (event.target.value) {
            case 'junk':
                break;
            case 'ankh-jewel':
                e.newAnkhJewels = 1;
                break;
            case 'sacred-orb':
                e.newSacredOrbs = 1;
                break;
            default:
                if (!items.byKey.has(event.target.value)) {
                    console.error(`unknown item key ${event.target.value}`);
                } else {
                    let item = items.byKey.get(event.target.value);
                    e.newRoots = [item.name];
                }
                break;
        }

        if (onSubmit) {
            onSubmit(e);
        }
    }, [onSubmit]);

    return (
        <div
            className='Task ShopItemTask'
        >
            <Planet
                centerContent={<button>{location} Shop Item {index}</button>}
                autoClose
                orbitRadius={80}
            >
                <ShopItemCategorySatellite name='Weapons' items={items.weapons} onClick={onClick} />
                <ShopItemCategorySatellite name='Subweapons' items={items.subweapons} onClick={onClick} />
                <ShopItemCategorySatellite name='Usable Items' items={items.usable} onClick={onClick} />
                <ShopItemCategorySatellite name='Items' items={items.items} onClick={onClick} />
                <ShopItemCategorySatellite name='Seals' items={items.seals} onClick={onClick} />
                <ShopItemCategorySatellite name='Software' items={items.software} onClick={onClick} />
                <ShopItemCategorySatellite name='Ammo' items={items.ammo} onClick={onClick} />
                <ShopItemItemSatellite name='Ankh Jewel' value='ankh-jewel' onClick={onClick}/>
                <ShopItemItemSatellite name='Sacred Orb' value='sacred-orb' onClick={onClick}/>
                <ShopItemItemSatellite name='Shrine Map' value='map-shrine' onClick={onClick}/>
                <ShopItemItemSatellite name='Junk' value='junk' onClick={onClick}/>
            </Planet>
        </div>
    );
}

function SealCheckTaskSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

export function SealCheckTask({id, sealLoc, onSubmit}) {
    let onClick = useCallback(event => {
        let newSealMappings = new Map([
            [sealLoc.logic, event.target.value]
        ]);

        if (onSubmit) {
            onSubmit({
                newSealMappings,
                completedTasks: [id],
            });
        }
    }, [id, sealLoc, onSubmit]);

    let choices = items.seals.map(item => item.name);

    return (
        <div
            className='Task SealCheckTask'
        >
            <Planet
                centerContent={<button>Seal: {sealLoc.human}</button>}
                autoClose
                orbitRadius={180}
            >
                {choices.map(choice => {
                    return <SealCheckTaskSatellite key={choice} name={choice} value={choice} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

function DoorCheckTaskSatellite({name, value, onClick}) {
    return (
        <button value={value} onClick={onClick}>{name}</button>
    );
}

export function DoorCheckTask({id, name, onSubmit}) {
    let onClick = useCallback(event => {
        if (onSubmit) {
            onSubmit({
                newRoots: [event.target.value],
                completedTasks: [id]
            });
        }
    }, [id, onSubmit]);

    return (
        <div
            className='Task DoorCheckTask'
        >
            <Planet
                centerContent={<button>Door: {name}</button>}
                autoClose
                orbitRadius={180}
            >
                {doorLocations.all.map(door => {
                    return <SealCheckTaskSatellite key={door.key} name={door.human} value={door.logic} onClick={onClick} />;
                })}
            </Planet>
        </div>
    );
}

export function WinTask({id, onSubmit}) {
    let onClick = useCallback(event => {
        if (onSubmit) {
            onSubmit({
                completedTasks: [id]
            });
        }
    }, [id, onSubmit]);

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
