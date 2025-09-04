import fieldDefs from './universe/fields.yaml';
import regionDefs from './universe/regions.yaml';
import itemDefs from './universe/items.yaml';
import connectionDefs from './universe/connections.yaml';
import locationDefs from './universe/locations.yaml';
import npcDefs from './universe/npcs.yaml';

class Field {
    constructor({name, key, icon, index, tags}) {
        let tagValues = (tags === undefined ? [] : Array.from(tags));
        let tagSet = new Set(tagValues);

        this.name = name;
        this.key = key;
        this.icon = (icon === undefined ? null : icon);
        this.index = index;
        this.tags = tagSet;
    }
}
let fields = {};
console.log(fieldDefs);
fields.all = fieldDefs.map(def => new Field(def));
fields.byKey = new Map(fields.all.map(field => [field.key, field]));

class Region {
    constructor({name, root, field, key, tags}) {
        let tagValues = (tags === undefined ? [] : Array.from(tags));
        let tagSet = new Set(tagValues);

        this.name = name;
        this.root = root;
        this.field = field;
        this.key = key;
        this.tags = tagSet;

        this._didConnect = false;
    }

    doConnect() {
        if (this._didConnect) {
            console.error('doConnect() called multiple times');
        }

        let fieldInst = fields.byKey.get(this.field);
        if (fieldInst === undefined) {
            console.error(`Region with unknown field key: ${this.field}`);
        }

        this.field = fieldInst;
        this._didConnect = true;
    }

    fullName() {
        return `${this.field.name}: ${this.name}`;
    }

    isAlternateStart() {
        return this.tags.has('alternate-start');
    }

    isFrontside() {
        return this.field.tags.has('frontside') || this.tags.has('frontside');
    }

    isBackside() {
        return this.field.tags.has('backside') || this.tags.has('backside');
    }

    startRoots() {
        let roots = [this.root];
        if (this.tags.has('start-twin-statue')) {
            roots.push('Twin Statue');
        }
        if (this.tags.has('start-plane-model')) {
            roots.push('Plane Model');
        }
        return roots;
    }
}
let regions = {};
regions.all = regionDefs.map(def => new Region(def));
regions.byKey = new Map(regions.all.map(region => [region.key, region]));
regions.byRoot = new Map(regions.all.map(region => [region.root, region]));
regions.withTag = (tag) => regions.all.filter(region => region.tags.has(tag));

class Item {
    constructor({name, root, key, category, ammo, tags}) {
        let tagValues = (tags === undefined ? [] : Array.from(tags));
        let tagSet = new Set(tagValues);

        this.name = name;
        this.root = (root === undefined ? null : root);
        this.key = key;
        this.category = category;
        this.ammo = (ammo === undefined ? null : ammo);
        this.tags = tagSet;

        this._didConnect = false;
    }

    doConnect() {
        if (this._didConnect) {
            console.error('doConnect() called multiple times');
        }

        if (this.ammo !== null) {
            let ammoInst = items.byKey.get(this.ammo);
            if (ammoInst === undefined) {
                console.error(`Item with unknown ammo key: ${this.ammo}`);
            }

            this.ammo = ammoInst;
        }

        this._didConnect = true;
    }

    hasAmmo() {
        return this.ammo !== null;
    }
}
let items = {};
items.all = itemDefs.map(def => new Item(def));
items.byKey = new Map(items.all.map(item => [item.key, item]));
items.byRoot = new Map(items.all.map(item => [item.root, item]));
items.byCategory = (cat) => items.all.filter(item => item.category === cat);
items.withTag = (tag) => items.all.filter(item => item.tags.has(tag));

class Connection {
    constructor({name, region, root, key, type, tags}) {
        let tagValues = (tags === undefined ? [] : Array.from(tags));
        let tagSet = new Set(tagValues);

        this.name = name;
        this.region = (region === undefined ? null : region);
        this.root = root;
        this.key = key;
        this.type = type;
        this.tags = tagSet;

        this._didConnect = false;
    }

    candidates() {
        let conns = [];

        switch (this.type) {
            case 'left':
                conns = connections.byType('right');
                break;
            case 'right':
                conns = connections.byType('left');
                break;
            case 'up':
                conns = connections.byType('down');
                break;
            case 'down':
                conns = connections.byType('up');
                break;
            case 'door':
                conns = connections.byType('door');
                break;
            default:
                console.error(`Unknown Connection type ${this.type}`);
                break;
        }

        return conns.filter(conn => conn.isDestination());
    }

    doConnect() {
        if (this._didConnect) {
            console.error('doConnect() called multiple times');
        }

        if (this.region !== null) {
            let regionInst = regions.byKey.get(this.region);
            if (regionInst === undefined) {
                console.error(`Connection with unknown region key: ${this.region}`);
            }

            this.region = regionInst;
        }

        this._didConnect = true;
    }

    isSource() { return !this.tags.has('destination-only'); }
    isDestination() { return !this.tags.has('source-only'); }

    field() { return this.region.field; }
    inField(field) { return field === this.field(); }

    reciprocalType() {
        switch (this.type) {
            case 'left': return 'right';
            case 'right': return 'left';
            case 'up': return 'down';
            case 'down': return 'up';
            case 'door': return 'door';
            default:
                console.error(`unknown Connection.type ${this.type}`);
                return null;
        }
    }
}
let connections = {}
connections.all = connectionDefs.map(def => new Connection(def));
connections.byKey = new Map(connections.all.map(conn => [conn.key, conn]));
connections.byType = (type) => connections.all.filter(conn => conn.type === type);
connections.byRoot = new Map(connections.all.map(conn => [conn.root, conn]));
connections.byRegion = (region) => connections.all.filter(conn => conn.region === region);
connections.byField = (field) => connections.all.filter(conn => conn.region.field === field);

class Location {
    constructor({name, root, regions, key, tags}) {
        let tagValues = (tags === undefined ? [] : Array.from(tags));
        let tagSet = new Set(tagValues);

        this.name = name;
        this.root = root;
        this.regions = (regions === undefined ? [] : Array.from(regions));
        this.key = key;
        this.tags = tagSet;

        this._didConnect = false;
    }

    doConnect() {
        if (this._didConnect) {
            console.error('doConnect() called multiple times');
        }

        this.regions = this.regions.map(regionKey => {
            let region = regions.byKey.get(regionKey);
            if (region === undefined) {
                console.error(`Location with unknown region key: ${regionKey}`);
            }

            return region;
        });

        this._didConnect = true;
    }
}
let locations = {}
locations.all = locationDefs.map(def => new Location(def));
locations.byKey = new Map(locations.all.map(loc => [loc.key, loc]));
locations.byRoot = new Map(locations.all.map(loc => [loc.root, loc]));
locations.withTag = (tag) => locations.all.filter(loc => loc.tags.has(tag));
locations.inRegion = (region) => locations.all.filter(loc => loc.regions.some(locRegion => region.key === locRegion.key));


class NPC {
    constructor({name, root, key, tags}) {
        let tagValues = (tags === undefined ? [] : Array.from(tags));
        let tagSet = new Set(tagValues);

        this.name = name;
        this.root = root;
        this.key = key;
        this.tags = tagSet;
    }
}

let npcs = {}
npcs.all = npcDefs.map(def => new NPC(def));
npcs.byKey = new Map(npcs.all.map(npc => [npc.key, npc]));
npcs.byRoot = new Map(npcs.all.map(npc => [npc.root, npc]));
npcs.byName = new Map(npcs.all.map(npc => [npc.name, npc]));
npcs.withTag = (tag) => npcs.all.filter(npc => npc.tags.has(tag));

// second pass for initialization that relies on other objects
regions.all.forEach(region => region.doConnect());
items.all.forEach(item => item.doConnect());
connections.all.forEach(conn => conn.doConnect());
locations.all.forEach(loc => loc.doConnect());

const Universe = {fields, regions, items, connections, locations, npcs,
                  Field, Region, Item, Connection, Location, NPC};
export default Universe;
