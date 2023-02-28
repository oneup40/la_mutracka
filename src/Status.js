import './Status.css';

import Universe from './Universe.js';

import {useMemo} from 'react';

function FieldConnectionStatus({connection, connectionMap}) {
    const dst = useMemo(
        () => connectionMap.get(connection.key),
        [connection, connectionMap]
    );

    if (dst === undefined) {
        return null;
    }

    let dirEmoji = '-';
    switch (connection.type) {
        case 'up':
            dirEmoji = '⇑';
            break;
        case 'down':
            dirEmoji = '⇓';
            break;
        case 'left':
            dirEmoji = '⇐';
            break;
        case 'right':
            dirEmoji = '⇒';
            break;
        case 'door':
            dirEmoji = '🚪';
            break;
        default:
            console.error(`unexpected connection type ${connection.type}`);
            break;
    }

    return <li className="connection-item">{connection.name} {dirEmoji} {dst.region.field.name} {dst.name}</li>;
}

function FieldStatus({field, connectionMap, shrineDistance, mulbrukDistance}) {
    const connections = useMemo(
        () => {
            return {
                up: Universe.connections.byType('up').filter(conn => conn.inField(field)),
                left: Universe.connections.byType('left').filter(conn => conn.inField(field)),
                right: Universe.connections.byType('right').filter(conn => conn.inField(field)),
                down: Universe.connections.byType('down').filter(conn => conn.inField(field)),
                door: Universe.connections.byType('door').filter(conn => conn.inField(field)),
            }
        },
        [field]
    );

    return (
        <div className={"field-status " + field.key}>
            <div>
                <div className="field-name">{field.name}</div>
                <div className="shrine-distance">{shrineDistance === null ? "" : `Shrine: ${shrineDistance}`}</div>
                <div className="mulbruk-distance">{mulbrukDistance === null ? "" : `Mulbruk: ${mulbrukDistance}`}</div>
            </div>
            <ul className="connections-list">
                {connections.up.map(conn => <FieldConnectionStatus key={conn.key} connection={conn} connectionMap={connectionMap} />)}
                {connections.left.map(conn => <FieldConnectionStatus key={conn.key} connection={conn} connectionMap={connectionMap} />)}
                {connections.right.map(conn => <FieldConnectionStatus key={conn.key} connection={conn} connectionMap={connectionMap} />)}
                {connections.down.map(conn => <FieldConnectionStatus key={conn.key} connection={conn} connectionMap={connectionMap} />)}
                {connections.door.map(conn => <FieldConnectionStatus key={conn.key} connection={conn} connectionMap={connectionMap} />)}
            </ul>
        </div>
    );
}

function AmmoStatus({ammo, ammoSources}) {
    let sources = ammoSources.get(ammo.key);
    if (sources === undefined) {
        sources = [];
    }

    return (
        <div className={"ammo-status " + ammo.key}>
            <div className="ammo-name">{ammo.name}</div>
            <ul className="ammo-sources-list">
                {sources.map(loc => <li key={loc.key} className='ammo-sources-item'>{loc.name}</li>)}
            </ul>
        </div>
    );
}

function calculateShrineDistances({zipField, connectionMap}) {
    let shrine = Universe.fields.byKey.get('field-shrine');

    let q = [{field: shrine, distance: 0}];
    let distances = new Map([
        [shrine.key, {field: shrine, distance: 0}]
    ]);

    while (q.length > 0) {
        let {field, distance} = q[0];
        q = q.slice(1);

        let nextFields = [];

        Array.from(connectionMap.entries()).forEach(([srcKey, dst]) => {
            let src = Universe.connections.byKey.get(srcKey);
            if (src === undefined) {
                console.error(`unknown src key ${srcKey}`);
            }

            let srcField = src.region.field;
            let dstField = dst.region.field;

            if (srcField === field) {
                nextFields.push(dstField);
            }
        });

        // fixed transitions that aren't in connectionMap
        switch (field.key) {
            case 'field-mausoleum': {
                // pot
                let spring = Universe.fields.byKey.get('field-spring');
                nextFields.push(spring);
                break;
            }
            case 'field-sun': {
                // pyramid
                let moon = Universe.fields.byKey.get('field-moonlight');
                nextFields.push(moon);

                // ellmac room
                let twin = Universe.fields.byKey.get('field-twin');
                nextFields.push(twin);

                break;
            }
            case 'field-spring': {
                // drain
                let sun = Universe.fields.byKey.get('field-sun');
                nextFields.push(sun);

                // bahamut room
                let surf = Universe.fields.byKey.get('field-surface');
                nextFields.push(surf);

                break;
            }
            case 'field-inferno': {
                // viy room
                let ext = Universe.fields.byKey.get('field-extinction');
                nextFields.push(ext);
                break;
            }
            case 'field-twin': {
                // ellmac room
                let sun = Universe.fields.byKey.get('field-sun');
                nextFields.push(sun);
                break;
            }
                
            case 'field-mother':
                // technically every field can transition to zipField but this
                // will always be the shortest distance to it
                nextFields.push(zipField);
                break;

            default:
                break;
        }

        for (let dstField of nextFields) {
            if (!distances.has(dstField.key)) {
                q.push({field: dstField, distance: distance + 1});
                distances.set(dstField.key, {field: dstField, distance: distance + 1});
            }
        }
    }

    return distances;
}

function calculateMulbrukDistances({mulbrukField, connectionMap}) {
    let q = [{field: mulbrukField, distance: 0}];
    let distances = new Map([
        [mulbrukField.key, {field: mulbrukField, distance: 0}]
    ]);

    while (q.length > 0) {
        let {field, distance} = q[0];
        q = q.slice(1);

        let nextFields = [];

        Array.from(connectionMap.entries()).forEach(([srcKey, dst]) => {
            let src = Universe.connections.byKey.get(srcKey);
            if (src === undefined) {
                console.error(`unknown src key ${srcKey}`);
            }

            let srcField = src.region.field;
            let dstField = dst.region.field;

            if (dstField === field) {
                nextFields.push(srcField);
            }
        });

        // fixed transitions that aren't in connectionMap
        switch (field.key) {
            case 'field-surface': {
                // bahamut room
                let spring = Universe.fields.byKey.get('field-spring');
                nextFields.push(spring);
                break;
            }
            case 'field-sun': {
                // drain
                let spring = Universe.fields.byKey.get('field-spring');
                nextFields.push(spring);

                // ellmac room
                let twin = Universe.fields.byKey.get('field-twin');
                nextFields.push(twin);

                break;
            }
            case 'field-spring': {
                // pot
                let mauso = Universe.fields.byKey.get('field-mausoleum');
                nextFields.push(mauso);
                break;
            }
            case 'field-extinction': {
                // viy room
                let inferno = Universe.fields.byKey.get('field-inferno');
                nextFields.push(inferno);
                break;
            }
            case 'field-twin': {
                // ellmac room
                let sun = Universe.fields.byKey.get('field-sun');
                nextFields.push(sun);
                break;
            }
            case 'field-moonlight': {
                // pyramid
                let sun = Universe.fields.byKey.get('field-sun');
                nextFields.push(sun);
                break;
            }
            default:
                break;
        }

        for (let srcField of nextFields) {
            if (!distances.has(srcField.key)) {
                q.push({field: srcField, distance: distance + 1});
                distances.set(srcField.key, {field: srcField, distance: distance + 1});
            }
        }
    }

    return distances;
}

/*function calculateFieldDistances({startField, connectionMap}) {
    let q = [{field: startField, distance: 0}];
    let distances = new Map([
        [startField.key, {field: startField, distance: 0}]
    ]);

    while (q.length > 0) {
        let {field, distance} = q[0];
        q = q.slice(1);

        Array.from(connectionMap.entries()).forEach(([srcKey, dst]) => {
            let src = Universe.connections.byKey.get(srcKey);
            if (src === undefined) {
                console.error(`unknown src key ${srcKey}`);
            }

            console.log('src', src);

            let srcField = src.region.field;
            let dstField = dst.region.field;

            if (srcField === field) {
                if (!distances.has(dstField.key)) {
                    q.push({field: dstField, distance: distance + 1});
                    distances.set(dstField.key, {field: dstField, distance: distance + 1});
                }
            }
        });
    }

    return distances;
}*/

function Status({connectionMap, ammoSources, ankhJewels, sacredOrbs, importantNPCs, startingRegion}) {
    const mulbrukDistances = useMemo(() => {
        let mulbruk = importantNPCs.get('npc-mulbruk');
        if (mulbruk === undefined) {
            return new Map();
        }

        // return calculateFieldDistances({startField: mulbruk.location.regions[0].field, connectionMap});
        return calculateMulbrukDistances({mulbrukField: mulbruk.location.regions[0].field, connectionMap});
    }, [importantNPCs, connectionMap]);

    const shrineDistances = useMemo(() => {
        if (startingRegion === null) {
            return new Map();
        }

        return calculateShrineDistances({zipField: startingRegion.field, connectionMap});
        /*let shrine = Universe.fields.byKey.get('field-shrine');
        return calculateFieldDistances({startField: shrine, connectionMap});*/
    }, [connectionMap, startingRegion]);

    return (
        <div className="status">
            <fieldset>
                <legend>Misc</legend>
                <div>Ankh Jewels: {ankhJewels}</div>
                <div>Max HP: {32 * (1 + sacredOrbs)}</div>
            </fieldset>
            <fieldset>
                <legend>Fields</legend>
                <div className="field-status-grid">
                    {Universe.fields.all.map(field => {
                        let mulbrukDistance = null;
                        let shrineDistance = null;

                        let x = mulbrukDistances.get(field.key);
                        if (x !== undefined) {
                            mulbrukDistance = x.distance;
                        }

                        x = shrineDistances.get(field.key);
                        if (x !== undefined) {
                            shrineDistance = x.distance;
                        }

                        return <FieldStatus
                                    key={field.key}
                                    field={field}
                                    connectionMap={connectionMap}
                                    mulbrukDistance={mulbrukDistance}
                                    shrineDistance={shrineDistance}
                                />;
                    })}
                </div>
            </fieldset>

            <fieldset>
                <legend>Ammo</legend>
                <div className='ammo-status-grid'>
                    {Universe.items.byCategory('ammo').map(item => <AmmoStatus key={item.key} ammo={item} ammoSources={ammoSources}/>)}
                </div>
            </fieldset>

            <fieldset>
                <legend>Important NPCs</legend>
                <ul className="npc-list">
                    {Array.from(importantNPCs.values()).map(({npc, location}) => <li key={npc.key}>{npc.name}: {location.name}</li>)}
                </ul>
            </fieldset>
        </div>
    );
}

export default Status;
