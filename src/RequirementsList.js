import './RequirementsList.css';

function renderConjunction({values, accessible}) {
    return (
        <ul>
            {values.map((value, ndx) => <li key={ndx} className={accessible.has(value) ? 'accessible' : 'inaccessible'}>{value}</li>)}
        </ul>
    );
}

function renderDisjunction({key, options, accessible}) {
    return (
        <div key={key} className={accessible.has(key) ? 'accessible' : 'inaccessible'}>
            {key}
            <ul>
                {options.map((opt, ndx) => <li key={ndx}>{renderConjunction({values: opt, accessible})}</li>)}
            </ul>
        </div>
    );
}

function renderSingleReqList({key, reqs, accessible}) {
    return (
        <div key={key}>
            {key}
            <ul>
                {Array.from(reqs.entries()).sort().map(([reqKey, reqOptions], ndx) => <li key={ndx}>{renderDisjunction({key: reqKey, options: reqOptions, accessible})}</li>)}
            </ul>
        </div>
    );
}

function RequirementsList({reqs, accessible}) {
    return (
        <ul>
            {Array.from(reqs.entries()).sort().map(([key, reqs], ndx) => <li key={ndx}>{renderSingleReqList({key, reqs, accessible})}</li>)}
        </ul>
    );
}

export default RequirementsList;
