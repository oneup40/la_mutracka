import {useCallback, Fragment} from 'react';

class Option {
    constructor({value, text}) {
        this.value = value;
        this.text = text;
    }
}

function Dropdown({label, settingsKey, settings, options, onChange}) {
    let changeHandler = useCallback(event => {
        onChange({
            key: settingsKey,
            value: event.target.value
        });
    }, [settingsKey, onChange]);

    let option_jsx = options.map(option => (<option key={option.value} value={option.value}>{option.text}</option>));
    return (
        <Fragment>
            <label htmlFor={'dropdown-' + settingsKey}>{label}</label>
            <select name={'dropdown-' + settingsKey} value={settings[settingsKey]} onChange={changeHandler}>
                {option_jsx}
            </select>
        </Fragment>
    );
}

function Toggle({label, settingsKey, settings, onChange}) {
    let changeHandler = useCallback(event => {
        onChange({
            key: settingsKey,
            value: event.target.checked
        });
    }, [settingsKey, onChange]);

    return (
        <Fragment>
            <label htmlFor={'toggle-' + settingsKey}>{label}</label>
            <input type='checkbox' name={'toggle-' + settingsKey} checked={settings[settingsKey]} onChange={changeHandler} />
        </Fragment>
    );
}

function GameSettingsSection({label, settings, children, onChange}) {
    let jsx_children = children.map(child => {
        switch (child.type) {
            case 'toggle':
                return (
                    <div key={child.key}>
                        <Toggle label={child.label} settingsKey={child.key} settings={settings} onChange={onChange} />
                    </div>
                );
            case 'dropdown':
                return (
                    <div key={child.key}>
                        <Dropdown label={child.label} settingsKey={child.key} settings={settings} options={child.options} onChange={onChange} />
                    </div>
                );
            case 'section':
                return (
                    <div key={child.key}>
                        <GameSettingsSection label={child.label} settings={settings} children={child.children} onChange={onChange} />
                    </div>
                );
            default:
                console.error(`unexpected child.type ${child.type}`);
                return null;
        }
    });

    return (
        <fieldset>
            <legend>{label}</legend>
            {jsx_children}
        </fieldset>
    );
}

export const defaultSettings = {
    'randomize-escape-chest': true,


    'randomize-non-boss-doors': true,
    'randomize-transition-gates': true,
    'randomize-one-way-transitions': true,


    'boost-item': false,
    'boost-environment': false,
    'boost-enemy': false,

    'lamp-glitch': false,
    'cat-pause': false,
    'raindrop': false,
    'ice-raindrop': false,
    'pot-clip': false,
    'object-zip': false,
    'screen-mash': false,

    'require-ice-cape': false,
    'require-flare-gun': false,
    'require-key-fairy-combo': true,
    'subweapon-only': false,

    'difficulty': 'medium',


    'autoread-grail': true,
    'automatic-translations': true,
    'ushumgallu-assist': true,

    'alternate-mother-ankh': true,
    'reduced-boss-count': false,
    'automatic-hard-mode': false,


    'featherless': false,
    'automatic-mantras': false,
    'fools-2020': false,
    'fools-2021': false,
    'normal-pushing': true,
    'alternate-start': false,
    'frontside-start': false,
    'backside-start': false,
    'fixed-jewels': false,
    'abnormal-boss': false,
};

export function GameSettings({settings, onChange}) {
    let difficultyOptions = [
        new Option({value: 'medium', text: 'Easier'}),
        new Option({value: 'hard', text: 'Harder'})
    ];

    return (
        <fieldset>
            <legend>Game Settings</legend>
            <GameSettingsSection
                label='Items/Shops'
                settings={settings}
                children={[
                    {type: 'toggle', label: 'Randomize Escape Chest', key: 'randomize-escape-chest'},
                ]}
                onChange={onChange}
            />
            <GameSettingsSection
                label='Locations'
                settings={settings}
                children={[
                    {type: 'toggle', label: 'Randomize Non-boss Doors', key: 'randomize-non-boss-doors'},
                    {type: 'toggle', label: 'Randomize Transitions Between Areas', key: 'randomize-transition-gates'},
                    {type: 'toggle', label: 'Randomize One-Way Transitions', key: 'randomize-one-way-transitions'},
                ]}
                onChange={onChange}
            />
            <GameSettingsSection
                label='Randomization Logic'
                settings={settings}
                children={[
                    {
                        type: 'section',
                        label: 'Damage-boost Logic',
                        key: 'boost-logic',
                        children: [
                            {type: 'toggle', label: 'Damage-boosting: Items', key: 'boost-item'},
                            {type: 'toggle', label: 'Damage-boosting: Environment', key: 'boost-environment'},
                            {type: 'toggle', label: 'Damage-boosting: Enemies', key: 'boost-enemy'},
                        ]
                    },
                    {
                        type: 'section',
                        label: 'Glitch Logic',
                        key: 'glitch-logic',
                        children: [
                            {type: 'toggle', label: 'Lamp Glitch', key: 'lamp-glitch'},
                            {type: 'toggle', label: 'Cat Pause', key: 'cat-pause'},
                            {type: 'toggle', label: 'Raindrop', key: 'raindrop'},
                            {type: 'toggle', label: 'Ice Raindrop', key: 'ice-raindrop'},
                            {type: 'toggle', label: 'Pot Clip', key: 'pot-clip'},
                            {type: 'toggle', label: 'Object Zip', key: 'object-zip'},
                            {type: 'toggle', label: 'Screen Mash', key: 'screen-mash'}
                        ]
                    },
                    {type: 'toggle', label: 'Require Ice Cape for lava', key: 'require-ice-cape'},
                    {type: 'toggle', label: 'Require Flare Gun for Extinction', key: 'require-flare-gun'},
                    {type: 'toggle', label: 'Key fairy requires software', key: 'require-key-fairy-combo'},
                    {type: 'toggle', label: 'Subweapon-only boss logic', key: 'subweapon-only'},
                    {type: 'dropdown', label: 'Boss Logic', key: 'difficulty', options: difficultyOptions},
                ]}
                onChange={onChange}
            />
            <GameSettingsSection
                label='Gameplay Changes'
                settings={settings}
                children={[
                    {
                        type: 'section',
                        label: 'Convenience changes',
                        key: 'convenience',
                        children: [
                            {type: 'toggle', label: 'Autoread Grail Tablets', key: 'autoread-grail'},
                            {type: 'toggle', label: 'Ancient La-Mulanese pre-learned', key: 'automatic-translations'},
                            {type: 'toggle', label: 'Ushumgallu assist ladder', key: 'ushumgallu-assist'},
                        ]
                    },
                    {type: 'toggle', label: 'Alternate Mother Ankh', key: 'alternate-mother-ankh'},
                    {type: 'toggle', label: 'Reduced boss count (7 bosses)', key: 'reduced-boss-count'},
                    {type: 'toggle', label: 'Automatic Hard Mode', key: 'automatic-hard-mode'},
                ]}
                onChange={onChange}
            />
        </fieldset>
    )
}
