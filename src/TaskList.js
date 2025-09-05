import './TaskList.css';
import {StartRegionTask, StartWeaponTask, TransitionTask, NPCTask, AwakenTask, ItemCheckTask, ShopItemTask, SealCheckTask, WinTask} from './Task.js';

function FieldTaskList({fieldName, tasks, onTaskSubmit, connectionMap, access}) {
    return (
        <fieldset className='field-tasks-list'>
            <legend className='field-name'>{fieldName}</legend>
            {tasks.map(task => {
                switch (task.type) {
                    case 'start-region':
                        return <StartRegionTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                    case 'start-weapon':
                        return <StartWeaponTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                    case 'transition':
                        return <TransitionTask key={task.key} id={task.key} connection={task.connection} connectionMap={connectionMap} onSubmit={onTaskSubmit}/>;
                    case 'npc':
                        return <NPCTask key={task.key} id={task.key} location={task.location} onSubmit={onTaskSubmit}/>;
                    case 'awaken':
                        return <AwakenTask key={task.key} id={task.key} access={access} location={task.location} onSubmit={onTaskSubmit}/>;
                    case 'check-item':
                        return <ItemCheckTask key={task.key} id={task.key} location={task.location} onSubmit={onTaskSubmit}/>;
                    case 'shop-item':
                        return <ShopItemTask key={task.key} id={task.key} location={task.location} index={task.shopIndex} onSubmit={onTaskSubmit}/>;
                    case 'seal-check':
                        return <SealCheckTask key={task.key} id={task.key} location={task.location} access={access} onSubmit={onTaskSubmit}/>;
                    case 'win':
                        return <WinTask key={task.key} id={task.key} onSubmit={onTaskSubmit}/>;
                    default:
                        // console.error('unknown task type:', task.type);
                        return null;
                }
            })}
        </fieldset>
    );
}

export function TaskList({tasks, onTaskSubmit, connectionMap, access}) {
    console.log(onTaskSubmit);
    let taskMap = new Map();
    tasks.forEach(task => {
        let fndx = task.fieldIndex();

        if (taskMap.has(fndx)) {
            taskMap.get(fndx).push(task);
        } else {
            taskMap.set(fndx, [task]);
        }
    });

    let fields = [];
    taskMap.forEach((value, key) => {
        let fieldName = value[0].fieldName();
        if (fieldName === '') {
            fieldName = 'Misc';
        }

        console.log(key, value);
        fields.push(
            <FieldTaskList 
                id={key}
                fieldName={fieldName}
                tasks={value}
                onTaskSubmit={onTaskSubmit}
                connectionMap={connectionMap}
                access={access}
            />
        );
    });
    
    return (
        <div className='tasks-list'>
            {fields}
        </div>
    );
}
