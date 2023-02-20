import {useEffect} from 'react';

import attack_reqs_url from './third_party/lmr/attack_reqs.txt';
import bosses_hard_reqs_url from './third_party/lmr/bosses_hard_reqs.txt';
import bosses_medium_reqs_url from './third_party/lmr/bosses_medium_reqs.txt';
import coin_chest_reqs_url from './third_party/lmr/coin_chest_reqs.txt';
import dead_ends_url from './third_party/lmr/dead_ends.txt';
import event_reqs_url from './third_party/lmr/event_reqs.txt';
import glitch_reqs_url from './third_party/lmr/glitch_reqs.txt';
import item_reqs_url from './third_party/lmr/item_reqs.txt';
import location_reqs_url from './third_party/lmr/location_reqs.txt';
import npc_door_reqs_url from './third_party/lmr/npc_door_reqs.txt';
import npc_reqs_url from './third_party/lmr/npc_reqs.txt';
import npc_win_reqs_url from './third_party/lmr/npc_win_reqs.txt';
import shop_reqs_url from './third_party/lmr/shop_reqs.txt';
import transition_reqs_url from './third_party/lmr/transition_reqs.txt';
import trap_item_reqs_url from './third_party/lmr/trap_item_reqs.txt';
import warp_location_reqs_url from './third_party/lmr/warp_location_reqs.txt';
import win_reqs_url from './third_party/lmr/win_reqs.txt';

const url_map = new Map([
    ['attack', attack_reqs_url],
    ['bosses_hard', bosses_hard_reqs_url],
    ['bosses_medium', bosses_medium_reqs_url],
    ['coin_chest', coin_chest_reqs_url],
    ['dead_ends', dead_ends_url],
    ['event', event_reqs_url],
    ['glitch', glitch_reqs_url],
    ['item', item_reqs_url],
    ['location', location_reqs_url],
    ['npc_door', npc_door_reqs_url],
    ['npc', npc_reqs_url],
    ['npc_win', npc_win_reqs_url],
    ['shop', shop_reqs_url],
    ['transition', transition_reqs_url],
    ['trap_item', trap_item_reqs_url],
    ['warp_location', warp_location_reqs_url],
    ['win', win_reqs_url]
]);

class ReqLine {
    constructor(key, values) {
        this.key = key;
        this.values = values;
    }

    static parse(line) {
        // Key: Stuff => Value: Thing, Value: Gadget, Value: Wedjet # comment
        line = line.trim();

        let ndx = line.indexOf('#')
        if (ndx >= 0) {
            line = line.substring(0, ndx).trim();
        }

        ndx = line.indexOf('=>');
        if (ndx < 0) {
            return null;
        }

        let [key, value_text] = line.split('=>').map(x => x.trim());
        let values = value_text.split(', ');

        return new ReqLine(key, values);
    }
}

export class ReqList {
    constructor(reqs) {
        this.reqs = reqs;
    }

    static parse(text) {
        let reqLines = text.split('\n').map(ReqLine.parse).filter(x => x !== null);
        let reqs = new Map();
        reqLines.forEach(req => {
            if (!reqs.has(req.key)) {
                reqs.set(req.key, []);
            }

            reqs.get(req.key).push(req.values);
        });

        return new ReqList(reqs);
    }

    get(key) { return this.reqs.get(key); }
    keys() { return this.reqs.keys(); }
    entries() { return this.reqs.entries(); }
}

export function RequirementsLoader({onLoaded}) {
    useEffect(() => {
        let reqs = new Map();

        let promises = Array.from(url_map.entries()).map(([key, url]) => {
            return fetch(url)
                    .then((response) => response.text())
                    .then((textContent) => reqs.set(key, ReqList.parse(textContent)));
        });

        Promise.all(promises).then(() => onLoaded({reqs}));
    }, [onLoaded]);
        
    return null;
}
