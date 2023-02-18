import worldData from './World.yaml';

class Connection {
    // human: Name to show the user
    // short: Abbreviation
    // logic: Name to use when calculating logic
    // key: Simplified name
    // type: left / right / up / down / portal
    constructor({human, short, logic, key, type, usable}) {
        this.human = human;
        this.short = short;
        this.logic = logic;
        this.key = key;
        this.type = type;
        this.usable = (usable === undefined ? true : usable);
    }

    extHuman() {
        return `${this.short}: ${this.human}`;
    }
}

export let connections = {};
connections.all = worldData.connections.map(data => new Connection(data));
connections.byKey = new Map(connections.all.map(conn => [conn.key, conn]));
connections.byLogic = new Map(connections.all.map(conn => [conn.logic, conn]));
connections.left = connections.all.filter(conn => conn.type === 'left');
connections.right = connections.all.filter(conn => conn.type === 'right');
connections.up = connections.all.filter(conn => conn.type === 'up');
connections.down = connections.all.filter(conn => conn.type === 'down');
connections.portal = connections.all.filter(conn => conn.type === 'portal');
window.connections = connections;

class NPCLocation {
    // human: Name to show the user
    // short: Abbreviation
    // logic: Name to use when calculating logic
    // key: Simplified name
    constructor({human, short, logic, key}) {
        this.human = human;
        this.short = short;
        this.logic = logic;
        this.key = key;
    }

    extHuman() {
        return `${this.short}: ${this.human}`;
    }
}

export let npcLocations = {};
npcLocations.all = worldData.npcLocations.map(data => new NPCLocation(data));
npcLocations.byKey = new Map(npcLocations.all.map(npcl => [npcl.key, npcl]));
npcLocations.byLogic = new Map(npcLocations.all.map(npcl => [npcl.logic, npcl]));
window.npcLocations = npcLocations;

class Item {
    // name: Name to show the user, and when calculating logic
    // key: Simplified name
    // type: weapon / subweapon / usable / item / seal / software / map / other
    // important: false if this item shouldn't be presentable as a choice to the user 
    constructor({name, key, type, obtainable, important}) {
        this.name = name;
        this.key = key;
        this.type = type;
        this.important = (important === undefined ? true : important);
    }
}

export let items = {};
items.all = worldData.items.map(data => new Item(data));
items.byKey = new Map(items.all.map(item => [item.key, item]));
items.byLogic = new Map(items.all.map(item => [item.name, item]));
items.weapons = items.all.filter(item => item.type === 'weapon');
items.subweapons = items.all.filter(item => item.type === 'subweapon');
items.ammo = items.all.filter(item => item.type === 'ammo');
items.usable = items.all.filter(item => item.type === 'usable');
items.items = items.all.filter(item => item.type === 'item');
items.seals = items.all.filter(item => item.type === 'seal');
items.software = items.all.filter(item => item.type === 'software');
items.maps = items.all.filter(item => item.type === 'map');
items.other = items.all.filter(item => item.type === 'other');
window.items = items;

class ItemLocation {
    // human: Name to show the user
    // logic: Name to use when calculating logic
    // key: Simplified name
    constructor({human, logic, key}) {
        this.human = human;
        this.logic = logic;
        this.key = key;
    }
}

export let itemLocations = {};
itemLocations.all = worldData.itemLocations.map(data => new ItemLocation(data));
itemLocations.byKey = new Map(itemLocations.all.map(loc => [loc.key, loc]));
itemLocations.byLogic = new Map(itemLocations.all.map(loc => [loc.logic, loc]));
window.itemLocations = itemLocations;

class SealLocation {
    // human: Name to show the user
    // locations: 
    // logic: Name to use when calculating logic
    // key: Simplified name
    constructor({human, locations, logic, key}) {
        this.human = human;
        this.locations = locations;
        this.logic = logic;
        this.key = key;
    }
}

export let sealLocations = {};
sealLocations.all = worldData.sealLocations.map(data => new SealLocation(data));
sealLocations.byLocation = new Map();
sealLocations.all.forEach(loc => {
    loc.locations.forEach(name => {
        let seals = sealLocations.byLocation.get(name);
        if (seals === undefined) {
            seals = new Set();
            sealLocations.byLocation.set(name, seals);
        }

        seals.add(loc);
    });
});
sealLocations.byLogic = new Map(sealLocations.all.map(loc => [loc.logic, loc]));
sealLocations.byKey = new Map(sealLocations.all.map(loc => [loc.key, loc]));
window.sealLocations = sealLocations;

class DoorLocation {
    // human: Name to show the user
    // location: 
    // logic: Name to use when calculating logic
    // key: Simplified name
    constructor({human, location, logic, key}) {
        this.human = human;
        this.location = location;
        this.logic = logic;
        this.key = key;
    }
}

export let doorLocations = {};
doorLocations.all = worldData.doorLocations.map(data => new DoorLocation(data));
doorLocations.byLocation = new Map(doorLocations.all.map(loc => [loc.location, loc]));
doorLocations.byLogic = new Map(doorLocations.all.map(loc => [loc.logic, loc]));
doorLocations.byKey = new Map(doorLocations.all.map(loc => [loc.key, loc]));
window.doorLocations = doorLocations;
