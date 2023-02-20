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

function Status({connectionMap, ammoSources}) {
    return (
        <div className="status">
            <fieldset>
                <legend>Fields</legend>
                <div className="field-status-grid">
                    <FieldStatus field={Universe.fields.byKey.get('field-surface')} connectionMap={connectionMap} />

                    <FieldStatus field={Universe.fields.byKey.get('field-guidance')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-mausoleum')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-sun')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-spring')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-inferno')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-extinction')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-twin')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-endless')} connectionMap={connectionMap} />

                    <FieldStatus field={Universe.fields.byKey.get('field-shrine')} connectionMap={connectionMap} />

                    <FieldStatus field={Universe.fields.byKey.get('field-illusion')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-graveyard')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-moonlight')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-goddess')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-ruin')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-birth')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-dc')} connectionMap={connectionMap} />

                    <FieldStatus field={Universe.fields.byKey.get('field-surface-time')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-guidance-time')} connectionMap={connectionMap} />
                    <FieldStatus field={Universe.fields.byKey.get('field-mausoleum-time')} connectionMap={connectionMap} />

                    <FieldStatus field={Universe.fields.byKey.get('field-hell-temple')} connectionMap={connectionMap} />
                </div>
            </fieldset>

            <fieldset>
                <legend>Ammo</legend>
                <div className='ammo-status-grid'>
                    {Universe.items.byCategory('ammo').map(item => <AmmoStatus key={item.key} ammo={item} ammoSources={ammoSources}/>)}
                </div>
            </fieldset>
        </div>
    );
}

export default Status;
