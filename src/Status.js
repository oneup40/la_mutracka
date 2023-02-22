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

    return <li className="connection-item">{connection.name} {dirEmoji} {dst.name}</li>;
}

function FieldStatus({field, connectionMap}) {
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
            <div className="field-name">{field.name}</div>
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

function Status({connectionMap, ammoSources, ankhJewels, sacredOrbs, importantNPCs}) {
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
                    {Universe.fields.all.map(field => <FieldStatus key={field.key} field={field} connectionMap={connectionMap} />)}
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
