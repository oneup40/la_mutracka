/*class Item {
    // human: Name to show the user
    // logic: Name to use when calculating logic
    // key: Simplified name
    // type: weapon / subweapon / usable / item / seal / software
    constructor({human, logic, key, type}) {
        this.human = human;
        this.logic = logic;
        this.key = key;
        this.type = type;
    }
}

let itemDefs = [
    {human: 'Whip', logic: 'Whip', key: 'whip', type: 'weapon'},
    {human: 'Chain Whip', logic: 'Chain Whip', key: 'chain-whip', type: 'weapon'},
*/

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

const connectionDefs = [
    // https://github.com/thezerothcat/LaMulanaRandomizer/blob/master/src/main/java/lmr/randomizer/randomization/TransitionGateRandomizer.java
    // randomizeHorizontalTransitions
    {human: '🠔 Guidance (Entrance)', short: '1F L ', logic: 'Transition: Guidance L1', key: 'guidance-l1', type: 'left'},
    {human: '🠔 Mausoleum (Ankh)', short: '2F L ', logic: 'Transition: Mausoleum L1', key: 'mausoleum-l1', type: 'left'},
    {human: '🠔 Sun (Buer)', short: '3F L ', logic: 'Transition: Sun L1', key: 'sun-l1', type: 'left'},
    {human: '🠔 Extinction (Upper)', short: '6F L1', logic: 'Transition: Extinction L1', key: 'extinction-l1', type: 'left'},
    {human: '🠔 Extinction (Lower)', short: '6F L2', logic: 'Transition: Extinction L2', key: 'extinction-l2', type: 'left'},
    {human: '🠔 Endless One-way (Top)', short: '8F L ', logic: 'Transition: Endless L1', key: 'endless-l1', type: 'right'},

    {human: '🠔 Graveyard (mirai.exe)', short: '2B L ', logic: 'Transition: Graveyard L1', key: 'graveyard-l1', type: 'left'},
    {human: '🠔 Moonlight (Anubis)', short: '3B L ', logic: 'Transition: Moonlight L1', key: 'moonlight-l1', type: 'left'},
    {human: '🠔 Goddess (Spaulder)', short: '4B L1', logic: 'Transition: Goddess L1', key: 'goddess-l1', type: 'left'},
    {human: '🠔 Goddess (Lower)', short: '4B L2', logic: 'Transition: Goddess L2', key: 'goddess-l2', type: 'left'},
    {human: '🠔 Ruin (Map)', short: '5B L ', logic: 'Transition: Ruin L1', key: 'ruin-l1', type: 'left'},
    {human: '🠔 Birth (Woman Statue)', short: '6B L ', logic: 'Transition: Birth L1', key: 'birth-l1', type: 'left'},

    {human: '🠔 Guidance [Time]', short: '1FTL ', logic: 'Transition: Retroguidance L1', key: 'retroguidance-l1', type: 'left'},



    {human: '🠖 Surface (Ruins Entrance)', short: '0  R ', logic: 'Transition: Surface R1', key: 'surface-r1', type: 'right'},
    {human: '🠖 Sun (Flooded Upper)', short: '3F R1', logic: 'Transition: Sun R1', key: 'sun-r1', type: 'right'},
    {human: '🠖 Sun (Flooded Lower)', short: '3F R2', logic: 'Transition: Sun R2', key: 'sun-r2', type: 'right'},
    {human: '🠖 Inferno (Floats)', short: '5F R ', logic: 'Transition: Inferno R1', key: 'inferno-r1', type: 'right'},
    {human: '🠖 Endless Normal (Top)', short: '8F R ', logic: 'Transition: Endless R1', key: 'endless-r1', type: 'right'},

    {human: '🠖 Illusion (Dancing Child)', short: '1B R1', logic: 'Transition: Illusion R1', key: 'illusion-r1', type: 'right'},
    {human: '🠖 Illusion (Chi You)', short: '1B R2', logic: 'Transition: Illusion R2', key: 'illusion-r2', type: 'right'},
    {human: '🠖 Graveyard (Grail)', short: '2B R ', logic: 'Transition: Graveyard R1', key: 'graveyard-r1', type: 'right'},
    {human: '🠖 Ruin (Medicine)', short: '5B R1', logic: 'Transition: Ruin R1', key: 'ruin-r1', type: 'right'},
    {human: '🠖 Ruin (Sacred Orb)', short: '5B R2', logic: 'Transition: Ruin R2', key: 'ruin-r2', type: 'right'},
    {human: '🠖 Birth (Skanda)', short: '6B R ', logic: 'Transition: Birth R1', key: 'birth-r1', type: 'right'},

    {human: '🠖 Surface [Time]', short: '0 TR ', logic: 'Transition: Retrosurface R1', key: 'retrosurface-r1', type: 'right'},



    // randomizeVerticalTransitions
    {human: '🠕 Guidance (Shuriken)', short: '1F U ', logic: 'Transition: Guidance U1', key: 'guidance-u1', type: 'up'},
    {human: '🠕 Mausoleum (Top)', short: '2F U ', logic: 'Transition: Mausoleum U1', key: 'mausoleum-u1', type: 'up'},
    {human: '🠕 Sun (Top)', short: '3F U ', logic: 'Transition: Sun U1', key: 'sun-u1', type: 'up'},
    {human: '🠕 Inferno (Lower/Map)', short: '5F U1', logic: 'Transition: Inferno U1', key: 'inferno-u1', type: 'up'},
    {human: '🠕 Inferno (Upper/Spikes)', short: '5F U2', logic: 'Transition: Inferno U2', key: 'inferno-u2', type: 'up'},
    {human: '🠕 Extinction (Main)', short: '6F U1', logic: 'Transition: Extinction U1', key: 'extinction-u1', type: 'up'},
    {human: '🠕 Extinction (Magatama)', short: '6F U2', logic: 'Transition: Extinction U2', key: 'extinction-u2', type: 'up'},
    {human: '🠕 Extinction (Palenque)', short: '6F U3', logic: 'Transition: Extinction U3', key: 'extinction-u3', type: 'up'},
    {human: '🠕 TL (Outer Wall)', short: '7  U1', logic: 'Transition: Twin U1', key: 'twin-u1', type: 'up'},
    {human: '🠕 TL (Poison)', short: '7  U2', logic: 'Transition: Twin U2', key: 'twin-u2', type: 'up'},
    {human: '🠕 TL (Crystal Skull)', short: '7  U3', logic: 'Transition: Twin U3', key: 'twin-u3', type: 'up'},
    {human: '🠕 Endless (Philosopher)', short: '8F U ', logic: 'Transition: Endless U1', key: 'endless-u1', type: 'up'},

    {human: '🠕 Graveyard (Hot Spring)', short: '2B U1', logic: 'Transition: Graveyard U1', key: 'graveyard-u1', type: 'up'},
    {human: '🠕 Graveyard (Lamp Refill)', short: '2B U2', logic: 'Transition: Graveyard U2', key: 'graveyard-u2', type: 'up'},
    {human: '🠕 Moonlight (CC)', short: '3B U1', logic: 'Transition: Moonlight U1', key: 'moonlight-u1', type: 'up'},
    {human: '🠕 Moonlight (Trap)', short: '3B U2', logic: 'Transition: Moonlight U2', key: 'moonlight-u2', type: 'up'},
    {human: '🠕 Goddess (Lamp Refill)', short: '4B U1', logic: 'Transition: Goddess U1', key: 'goddess-u1', type: 'up'},
    {human: '🠕 Goddess (Secret Exit)', short: '4B U2', logic: 'Transition: Goddess W1', key: 'goddess-w1', type: 'up', usable: false},
    {human: '🠕 Birth (Backside Door)', short: '6B U ', logic: 'Transition: Birth U1', key: 'birth-u1', type: 'up'},

    {human: '🠕 Shrine (Entrance)', short: '9  U ', logic: 'Transition: Shrine U1', key: 'shrine-u1', type: 'up'},

    {human: '🠕 Mausoleum Upper [Time]', short: '2FTU ', logic: 'Transition: Retromausoleum U1', key: 'retromausoleum-u1', type: 'up'},



    {human: '🠗 Surface (Left)', short: '0  D1', logic: 'Transition: Surface D1', key: 'surface-d1', type: 'down'},
    {human: '🠗 Surface (Right)', short: '0  D2', logic: 'Transition: Surface D2', key: 'surface-d2', type: 'down'},

    {human: '🠗 Guidance (Shop)', short: '1F D1', logic: 'Transition: Guidance D1', key: 'guidance-d1', type: 'down'},
    {human: '🠗 Guidance (Ankh Jewel)', short: '1F D2', logic: 'Transition: Guidance D2', key: 'guidance-d2', type: 'down'},
    {human: '🠗 Mausoleum (Ankh Switch)', short: '2F D ', logic: 'Transition: Mausoleum D1', key: 'mausoleum-d1', type: 'down'},
    {human: '🠗 Spring', short: '4F D ', logic: 'Transition: Spring D1', key: 'spring-d1', type: 'down'},
    {human: '🠗 Inferno (LAVA)', short: '5F D ', logic: 'Transition: Inferno W1', key: 'inferno-w1', type: 'down', usable: false},
    {human: '🠗 TL (Fairy Point)', short: '7  D1', logic: 'Transition: Twin D1', key: 'twin-d1', type: 'down'},
    {human: '🠗 TL (Elevator)', short: '7  D2', logic: 'Transition: Twin D2', key: 'twin-d2', type: 'down'},
    {human: '🠗 Endless (Bottom)', short: '8F D ', logic: 'Transition: Endless D1', key: 'endless-d1', type: 'down'},

    {human: '🠗 Illusion (One Way Doors)', short: '1B D1', logic: 'Transition: Illusion D1', key: 'illusion-d1', type: 'down'},
    {human: '🠗 Illusion (Eden)', short: '1B D2', logic: 'Transition: Illusion D2', key: 'illusion-d2', type: 'down'},
    {human: '🠗 Graveyard (Kamitachi)', short: '2B D ', logic: 'Transition: Graveyard D1', key: 'graveyard-d1', type: 'down'},
    {human: '🠗 Goddess (Shield Trap)', short: '4B D ', logic: 'Transition: Goddess D1', key: 'goddess-d1', type: 'down'},
    {human: '🠗 Birth (Grail)', short: '6B D ', logic: 'Transition: Birth D1', key: 'birth-d1', type: 'down'},
    {human: '🠗 DC (Entrance)', short: '8B D ', logic: 'Transition: Dimensional D1', key: 'dimensional-d1', type: 'down', usable: false},

    {human: '🠗 Shrine (Elevator)', short: '9  D1', logic: 'Transition: Shrine D1', key: 'shrine-d1', type: 'down'},
    {human: '🠗 Shrine (Blocked Annex)', short: '9  D2', logic: 'Transition: Shrine D2', key: 'shrine-d2', type: 'down'},
    {human: '🠗 Shrine (Open Annex)', short: '9  D3', logic: 'Transition: Shrine D3', key: 'shrine-d3', type: 'down'},

    {human: '🠗 Guidance [Time]', short: '1FTD ', logic: 'Transition: Retroguidance D1', key: 'retroguidance-d1', type: 'down'},
    {human: '🠗 Mausoleum Secret [Time]', short: '2FTD ', logic: 'Transition: Retromausoleum D1', key: 'retromausoleum-d1', type: 'down'},
];
export let connections = {};
connections.all = connectionDefs.map(data => new Connection(data));
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

const npcLocationDefs = [
    {human: 'Surface NPC Xelpud', short: '0  N1', logic: 'NPCL: Elder Xelpud', key: 'npcl-xelpud'},
    {human: 'Surface Tent 1', short: '0  N2', logic: 'NPCL: Nebur', key: 'npcl-nebur'},
    {human: 'Surface Tent 2', short: '0  N3', logic: 'NPCL: Sidro', key: 'npcl-sidro'},
    {human: 'Surface Tent 3', short: '0  N4', logic: 'NPCL: Modro', key: 'npcl-modro'},
    {human: 'Surface Tent 4', short: '0  N5', logic: 'NPCL: Hiner', key: 'npcl-hiner'},
    {human: 'Surface Tent 5', short: '0  N6', logic: 'NPCL: Moger', key: 'npcl-moger'},
    {human: 'Surface NPC Mekuri Master', short: '0  N7', logic: 'NPCL: Former Mekuri Master', key: 'npcl-mekuri'},
    {human: 'Guidance NPC Priest', short: '1F N1', logic: 'NPCL: Priest Zarnac', key: 'npcl-zarnac'},
    {human: 'Guidance Shop', short: '1F N2', logic: 'NPCL: Penadvent of ghost', key: 'npcl-penadvent'},
    {human: 'Mausoleum NPC Priest', short: '2F N1', logic: 'NPCL: Priest Xanado', key: 'npcl-xanado'},
    {human: 'Mausoleum Shop', short: '2F N2', logic: 'NPCL: Greedy Charlie', key: 'npcl-charlie'},
    {human: 'Sun NPC Mulbruk', short: '3F N1', logic: 'NPCL: Mulbruk', key: 'npcl-mulbruk'},
    {human: 'Sun NPC Sphinx', short: '3F N2', logic: 'NPCL: Priest Madomono', key: 'npcl-madomono'},
    {human: 'Sun Shop Pot Smash', short: '3F N3', logic: 'NPCL: Shalom III', key: 'npcl-shalom'},
    {human: 'Sun Shop Spikes', short: '3F N4', logic: 'NPCL: Usas VI', key: 'npcl-usas'},
    {human: 'Sun Shop Seal', short: '3F N5', logic: 'NPCL: Kingvalley I', key: 'npcl-kingvalley-1'},
    {human: 'Spring NPC Hidden Priest', short: '4F N1', logic: 'NPCL: Priest Hidlyda', key: 'npcl-hidlyda'},
    {human: 'Spring NPC Philosopher', short: '4F N2', logic: 'NPCL: Philosopher Giltoriyo', key: 'npcl-giltoriyo'},
    {human: 'Spring Shop', short: '4F N3', logic: 'NPCL: Mr. Fishman (Original)', key: 'npcl-fishman'},
    {human: 'Spring Shop Secret', short: '4F N4', logic: 'NPCL: Mr. Fishman (Alt)', key: 'npcl-fishman-alt'},
    {human: 'Inferno NPC Seal', short: '5F N1', logic: 'NPCL: Priest Gailious', key: 'npcl-gailious'},
    {human: 'Inferno NPC Pazuzu', short: '5F N2', logic: 'NPCL: Priest Romancis', key: 'npcl-romancis'},
    {human: 'Inferno Shop', short: '5F N3', logic: 'NPCL: Hot-blooded Nemesistwo', key: 'npcl-nemesistwo'},
    {human: 'Extinction NPC Main', short: '6F N1', logic: 'NPCL: Priest Aramo', key: 'npcl-aramo'},
    {human: 'Extinction NPC Palenque', short: '6F N2', logic: 'NPCL: Priest Triton', key: 'npcl-triton'},
    {human: 'Extinction Shop Palenque', short: '6F N3', logic: 'NPCL: Operator Combaker', key: 'npcl-combaker'},
    {human: 'TL Shop Little Bro', short: '7  N1', logic: 'NPCL: Yiegah Kungfu', key: 'npcl-yiegah'},
    {human: 'TL Shop Big Bro', short: '7  N2', logic: 'NPCL: Yiear Kungfu', key: 'npcl-yiear'},
    {human: 'TL Shop Middle Right (Coin Pot)', short: '7  N3', logic: 'NPCL: Arrogant Sturdy Snake', key: 'npcl-sturdy-snake'},
    {human: 'TL Shop Middle Left (Bomb)', short: '7  N4', logic: 'NPCL: Arrogant Metagear', key: 'npcl-metagear'},
    {human: 'TL NPC Skull Ladder', short: '7  N5', logic: 'NPCL: Priest Jaguarfiv', key: 'npcl-jaguarfiv'},
    {human: 'Endless NPC Fairy Queen', short: '8F N ', logic: 'NPCL: The Fairy Queen', key: 'npcl-fairy-queen'},
    {human: 'Endless Shop', short: '8F N2', logic: 'NPCL: Affected Knimare', key: 'npcl-knimare'},

    {human: 'Illusion Dev NPC', short: '1B N1', logic: 'NPCL: duplex', key: 'npcl-duplex'},
    {human: 'Illusion NPC Treasures', short: '1B N2', logic: 'NPCL: Mr. Slushfund', key: 'npcl-slushfund'},
    {human: 'Illusion NPC Mini Doll', short: '1B N3', logic: 'NPCL: Priest Alest', key: 'npcl-alest'},
    {human: 'Illusion Shop', short: '1B N4', logic: 'NPCL: Mover Athleland', key: 'npcl-athleland'},
    {human: 'Graveyard Shop', short: '2B N1', logic: 'NPCL: Giant Mopiran', key: 'npcl-mopiran'},
    {human: 'Graveyard NPC Kamitachi', short: '2B N2', logic: 'NPCL: Giant Thexde', key: 'npcl-thexde'},
    {human: 'Moonlight NPC Philosopher', short: '3B N1', logic: 'NPCL: Philosopher Alsedana', key: 'npcl-alsedana'},
    {human: 'Moonlight Dev NPC', short: '3B N2', logic: 'NPCL: Samieru', key: 'npcl-samieru'},
    {human: 'Moonlight Shop', short: '3B N3', logic: 'NPCL: Kingvalley II', key: 'npcl-kingvalley-2'},
    {human: 'Goddess NPC Philosopher', short: '4B N1', logic: 'NPCL: Philosopher Samaranta', key: 'npcl-samaranta'},
    {human: 'Goddess Dev NPC', short: '4B N2', logic: 'NPCL: Naramura', key: 'npcl-naramura'},
    {human: 'Goddess Shop', short: '4B N3', logic: 'NPCL: Energetic Belmont', key: 'npcl-belmont'},
    {human: 'Ruin NPC Priest', short: '5B N1', logic: 'NPCL: Priest Laydoc', key: 'npcl-laydoc'},
    {human: 'Ruin Shop', short: '5B N2', logic: 'NPCL: Mechanical Efspi', key: 'npcl-efspi'},
    {human: 'Birth NPC Priest', short: '6B N1', logic: 'NPCL: Priest Ashgine', key: 'npcl-ashgine'},
    {human: 'Birth Shop', short: '6B N2', logic: 'NPCL: Mud Man Qubert', key: 'npcl-qubert'},
    {human: 'DC NPC Philosopher', short: '8B N ', logic: 'NPCL: Philosopher Fobos', key: 'npcl-fobos'},
    {human: 'Surface [Time] NPC', short: '0 TN ', logic: 'NPCL: 8bit Elder', key: 'npcl-elder-time'},
    {human: 'Hell Temple Shop', short: 'X  N ', logic: 'NPCL: Tailor Dracuet', key: 'npcl-dracuet'},
];
export let npcLocations = {};
npcLocations.all = npcLocationDefs.map(data => new NPCLocation(data));
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

const itemDefs = [
    {name: 'Whip', key: 'whip', type: 'weapon'},
    {name: 'Chain Whip', key: 'chain-whip', type: 'weapon'},
    {name: 'Flail Whip', key: 'flail-whip', type: 'weapon'},
    {name: 'Knife', key: 'knife', type: 'weapon'},
    {name: 'Key Sword', key: 'key-sword', type: 'weapon'},
    {name: 'Axe', key: 'axe', type: 'weapon'},
    {name: 'Katana', key: 'katana', type: 'weapon'},

    {name: 'Shuriken', key: 'shuriken', type: 'subweapon'},
    {name: 'Rolling Shuriken', key: 'rolling-shuriken', type: 'subweapon'},
    {name: 'Earth Spear', key: 'earth-spear', type: 'subweapon'},
    {name: 'Flare Gun', key: 'flare-gun', type: 'subweapon'},
    {name: 'Bomb', key: 'bomb', type: 'subweapon'},
    {name: 'Chakram', key: 'chakram', type: 'subweapon'},
    {name: 'Caltrops', key: 'caltrops', type: 'subweapon'},
    {name: 'Pistol', key: 'pistol', type: 'subweapon'},
    {name: 'Angel Shield', key: 'angel-shield', type: 'subweapon'},

    {name: 'Shuriken Ammo', key: 'shuriken-ammo', type: 'ammo'},
    {name: 'Rolling Shuriken Ammo', key: 'rolling-shuriken-ammo', type: 'ammo'},
    {name: 'Earth Spear Ammo', key: 'earth-spear-ammo', type: 'ammo'},
    {name: 'Flare Gun Ammo', key: 'flare-gun-ammo', type: 'ammo'},
    {name: 'Bomb Ammo', key: 'bomb-ammo', type: 'ammo'},
    {name: 'Chakram Ammo', key: 'chakram-ammo', type: 'ammo'},
    {name: 'Caltrops Ammo', key: 'caltrops-ammo', type: 'ammo'},
    {name: 'Pistol Ammo', key: 'pistol-ammo', type: 'ammo'},

    {name: 'Hand Scanner', key: 'hand-scanner', type: 'usable'},
    {name: 'Djed Pillar', key: 'djed-pillar', type: 'usable'},
    {name: 'Mini Doll', key: 'mini-doll', type: 'usable'},
    {name: 'Magatama Jewel', key: 'magatama-jewel', type: 'usable'},
    {name: 'Cog of the Soul', key: 'cog-of-the-soul', type: 'usable'},
    {name: 'Lamp of Time', key: 'lamp-of-time', type: 'usable'},
    {name: 'Pochette Key', key: 'pochette-key', type: 'usable'},
    {name: 'Dragon Bone', key: 'dragon-bone', type: 'usable'},
    {name: 'Crystal Skull', key: 'crystal-skull', type: 'usable'},
    {name: 'Vessel', key: 'vessel', type: 'usable'},
    {name: 'Pepper', key: 'pepper', type: 'usable'},
    {name: 'Woman Statue', key: 'woman-statue', type: 'usable'},
    // {name: 'Maternity Statue', key: 'maternity-statue', type: 'usable', important: false},
    {name: 'Key of Eternity', key: 'key-of-eternity', type: 'usable'},
    {name: 'Serpent Staff', key: 'serpent-staff', type: 'usable'},
    {name: 'Diary', key: 'diary', type: 'usable'},
    {name: 'Talisman', key: 'talisman', type: 'usable'},
    {name: 'Mulana Talisman', key: 'mulana-talisman', type: 'usable'},

    {name: 'Mobile Super X2', key: 'mobile-super-x2', type: 'item'},
    {name: 'Glove', key: 'glove', type: 'item'},
    {name: 'Holy Grail', key: 'holy-grail', type: 'item'},
    {name: 'Isis\' Pendant', key: 'isis-pendant', type: 'item'},
    {name: 'Helmet', key: 'helmet', type: 'item'},
    {name: 'Grapple Claw', key: 'grapple-claw', type: 'item'},
    {name: 'Bronze Mirror', key: 'bronze-mirror', type: 'item'},
    {name: 'Eye of Truth', key: 'eye-of-truth', type: 'item'},
    {name: 'Ring', key: 'ring', type: 'item'},
    {name: 'Scalesphere', key: 'scalesphere', type: 'item'},
    {name: 'Gauntlet', key: 'gauntlet', type: 'item'},
    {name: 'Treasures', key: 'treasures', type: 'item'},
    {name: 'Anchor', key: 'anchor', type: 'item'},
    {name: 'Plane Model', key: 'plane-model', type: 'item'},
    {name: 'Philosopher\'s Ocarina', key: 'philosophers-ocarina', type: 'item'},
    {name: 'Feather', key: 'feather', type: 'item'},
    {name: 'Book of the Dead', key: 'book-of-the-dead', type: 'item'},
    {name: 'Fairy Clothes', key: 'fairy-clothes', type: 'item'},
    {name: 'Hermes\' Boots', key: 'hermes-boots', type: 'item'},
    {name: 'Fruit of Eden', key: 'fruit-of-eden', type: 'item'},
    {name: 'Twin Statue', key: 'twin-statue', type: 'item'},
    {name: 'Bracelet', key: 'bracelet', type: 'item'},
    {name: 'Dimensional Key', key: 'dimensional-key', type: 'item'},
    {name: 'Ice Cape', key: 'ice-cape', type: 'item'},

    {name: 'Origin Seal', key: 'origin-seal', type: 'seal'},
    {name: 'Birth Seal', key: 'birth-seal', type: 'seal'},
    {name: 'Life Seal', key: 'life-seal', type: 'seal'},
    {name: 'Death Seal', key: 'death-seal', type: 'seal'},

    {name: 'reader.exe', key: 'reader-exe', type: 'software'},
    {name: 'yagomap.exe', key: 'yagomap-exe', type: 'software'},
    {name: 'yagostr.exe', key: 'yagostr-exe', type: 'software'},
    {name: 'torude.exe', key: 'torude-exe', type: 'software'},
    {name: 'guild.exe', key: 'guild-exe', type: 'software'},
    {name: 'mantra.exe', key: 'mantra-exe', type: 'software'},
    {name: 'deathv.exe', key: 'deathv-exe', type: 'software'},
    {name: 'randc.exe', key: 'randc-exe', type: 'software'},
    {name: 'move.exe', key: 'move-exe', type: 'software'},
    {name: 'mekuri.exe', key: 'mekuri-exe', type: 'software'},
    {name: 'miracle.exe', key: 'miracle-exe', type: 'software'},
    {name: 'mirai.exe', key: 'mirai-exe', type: 'software'},
    {name: 'lamulana.exe', key: 'lamulana-exe', type: 'software'},

    {name: 'Sacred Orb', key: 'sacred-orb', type: 'other'},
    {name: 'Ankh Jewel', key: 'ankh-jewel', type: 'other'},

    {name: 'Map (Shrine of the Mother)', key: 'map-shrine', type: 'map'},
];
export let items = {};
items.all = itemDefs.map(data => new Item(data));
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

let itemLocationDefs = items.all.filter(item => item.type != 'other').map(item => {
    return {
        human: 'Check: ' +item.name,
        logic: 'Check: ' + item.name,
        key: 'check-' + item.key
    };
});
itemLocationDefs = [].concat(itemLocationDefs, [
    {human: 'Check: Ankh Jewel (Guidance)', logic: 'Check: Ankh Jewel (Gate of Guidance)', key: 'check-ankh-jewel-guidance'},
    {human: 'Check: Ankh Jewel (Mausoleum)', logic: 'Check: Ankh Jewel (Mausoleum of the Giants)', key: 'check-ankh-jewel-mausoleum'},
    {human: 'Check: Ankh Jewel (Sun)', logic: 'Check: Ankh Jewel (Temple of the Sun)', key: 'check-ankh-jewel-sun'},
    {human: 'Check: Ankh Jewel (Spring)', logic: 'Check: Ankh Jewel (Spring in the Sky)', key: 'check-ankh-jewel-spring'},
    {human: 'Check: Ankh Jewel (Ruin)', logic: 'Check: Ankh Jewel (Tower of Ruin)', key: 'check-ankh-jewel-ruin'},
    {human: 'Check: Ankh Jewel (Twin)', logic: 'Check: Ankh Jewel (Twin Labyrinths)', key: 'check-ankh-jewel-twin'},
    {human: 'Check: Ankh Jewel (DC)', logic: 'Check: Ankh Jewel (Dimensional Corridor)', key: 'check-ankh-jewel-dc'},

    {human: 'Check: Crucifix', logic: 'Check: Crucifix', key: 'check-crucifix'},

    {human: 'Check: Map (Surface)', logic: 'Check: Map (Surface)', key: 'check-map-surface'},

    {human: 'Check: Map (Guidance)', logic: 'Check: Map (Gate of Guidance)', key: 'check-map-guidance'},
    {human: 'Check: Map (Mausoleum)', logic: 'Check: Map (Mausoleum of the Giants)', key: 'check-map-mausoleum'},
    {human: 'Check: Map (Sun)', logic: 'Check: Map (Temple of the Sun)', key: 'check-map-sun'},
    {human: 'Check: Map (Spring)', logic: 'Check: Map (Spring in the Sky)', key: 'check-map-spring'},
    {human: 'Check: Map (Inferno)', logic: 'Check: Map (Inferno Cavern)', key: 'check-map-inferno'},
    {human: 'Check: Map (Extinction)', logic: 'Check: Map (Chamber of Extinction)', key: 'check-map-extinction'},
    {human: 'Check: Map (Twin)', logic: 'Check: Map (Twin Labyrinths)', key: 'check-map-twin'},
    {human: 'Check: Map (Endless)', logic: 'Check: Map (Endless Corridor)', key: 'check-map-endless'},

    {human: 'Check: Map (Illusion)', logic: 'Check: Map (Gate of Illusion)', key: 'check-map-illusion'},
    {human: 'Check: Map (Graveyard)', logic: 'Check: Map (Graveyard of the Giants)', key: 'check-map-graveyard'},
    {human: 'Check: Map (Moonlight)', logic: 'Check: Map (Temple of Moonlight)', key: 'check-map-moonlight'},
    {human: 'Check: Map (Goddess)', logic: 'Check: Map (Tower of the Goddess)', key: 'check-map-goddess'},
    {human: 'Check: Map (Ruin)', logic: 'Check: Map (Tower of Ruin)', key: 'check-map-ruin'},
    {human: 'Check: Map (Birth)', logic: 'Check: Map (Chamber of Birth)', key: 'check-map-birth'},
    {human: 'Check: Map (DC)', logic: 'Check: Map (Dimensional Corridor)', key: 'check-map-dc'},

    {human: 'Check: Perfume', logic: 'Check: Perfume', key: 'check-perfume'},
    {human: 'Check: Forbidden Treasure', logic: 'Check: Provocative Bathing Suit', key: 'check-swimsuit'},

    {human: 'Check: Sacred Orb (Surface)', logic: 'Check: Sacred Orb (Surface)', key: 'check-sacred-orb-surface'},

    {human: 'Check: Sacred Orb (Guidance)', logic: 'Check: Sacred Orb (Gate of Guidance)', key: 'check-sacred-orb-guidance'},
    {human: 'Check: Sacred Orb (Mausoleum)', logic: 'Check: Sacred Orb (Mausoleum of the Giants)', key: 'check-sacred-orb-mausoleum'},
    {human: 'Check: Sacred Orb (Sun)', logic: 'Check: Sacred Orb (Temple of the Sun)', key: 'check-sacred-orb-sun'},
    {human: 'Check: Sacred Orb (Spring)', logic: 'Check: Sacred Orb (Spring in the Sky)', key: 'check-sacred-orb-spring'},
    {human: 'Check: Sacred Orb (Extinction)', logic: 'Check: Sacred Orb (Chamber of Extinction)', key: 'check-sacred-orb-extinction'},
    {human: 'Check: Sacred Orb (Twin)', logic: 'Check: Sacred Orb (Twin Labyrinths)', key: 'check-sacred-orb-twin'},

    {human: 'Check: Sacred Orb (Shrine)', logic: 'Check: Sacred Orb (Shrine of the Mother)', key: 'check-sacred-orb-shrine'},

    {human: 'Check: Sacred Orb (Ruin)', logic: 'Check: Sacred Orb (Tower of Ruin)', key: 'check-sacred-orb-ruin'},
    {human: 'Check: Sacred Orb (DC)', logic: 'Check: Sacred Orb (Dimensional Corridor)', key: 'check-sacred-orb-dc'},

    {human: 'Check: Shell Horn', logic: 'Check: Shell Horn', key: 'check-shell-horn'},
    {human: 'Check: Silver Shield', logic: 'Check: Silver Shield', key: 'check-silver-shield'},
    {human: 'Check: Spaulder', logic: 'Check: Spaulder', key: 'check-spaulder'},
    {human: 'Check: Treasures', logic: 'Check: Treasures', key: 'check-treasures'},

    {human: 'Check: beolamu.exe', logic: 'Check: beolamu.exe', key: 'check-beolamu-exe'},
    {human: 'Check: bounce.exe', logic: 'Check: bounce.exe', key: 'check-bounce-exe'},
    {human: 'Check: bunplus.com', logic: 'Check: bunplus.com', key: 'check-bunplus-com'},
    {human: 'Check: emusic.exe', logic: 'Check: emusic.exe', key: 'check-emusic-exe'},
    {human: 'Check: xmailer.exe', logic: 'Check: xmailer.exe', key: 'check-xmailer-exe'},

    {human: 'Coin: Birth (Dance)', logic: 'Coin: Birth (Dance)', key: 'coin-birth-dance'},
    {human: 'Coin: Birth (Ninja)', logic: 'Coin: Birth (Ninja)', key: 'coin-birth-ninja'},
    {human: 'Coin: Birth (Leaning Pillar)', logic: 'Coin: Birth (Southeast)', key: 'coin-birth-southeast'},
    {human: 'Coin: DC (Entrance)', logic: 'Coin: Dimensional', key: 'coin-dimensional'},
    {human: 'Coin: Endless', logic: 'Coin: Endless', key: 'coin-endless'},
    {human: 'Coin: Extinction', logic: 'Coin: Extinction', key: 'coin-extinction'},
    {human: 'Coin: Goddess (Fairy Point)', logic: 'Coin: Goddess (Fairy)', key: 'coin-goddess-fairy'},
    {human: 'Coin: Goddess (Shield Trap)', logic: 'Coin: Goddess (Shield)', key: 'coin-goddess-shield'},
    {human: 'Coin: Graveyard (Top)', logic: 'Coin: Graveyard', key: 'coin-graveyard'},
    {human: 'Coin: Guidance (Shuriken A)', logic: 'Coin: Guidance (One)', key: 'coin-guidance-one'},
    {human: 'Coin: Guidance (Shuriken B)', logic: 'Coin: Guidance (Two)', key: 'coin-guidance-two'},
    {human: 'Coin: Guidance (Trap)', logic: 'Coin: Guidance (Trap)', key: 'coin-guidance-trap'},
    {human: 'Coin: Illusion (Katana)', logic: 'Coin: Illusion (Katana)', key: 'coin-illusion-katana'},
    {human: 'Coin: Illusion (Spikes)', logic: 'Coin: Illusion (Spikes)', key: 'coin-illusion-spikes'},
    {human: 'Coin: Inferno (Lava)', logic: 'Coin: Inferno (Lava)', key: 'coin-inferno-lava'},
    {human: 'Coin: Inferno Annex (Spikes)', logic: 'Coin: Inferno (Spikes)', key: 'coin-inferno-spikes'},
    {human: 'Coin: Mausoleum', logic: 'Coin: Mausoleum', key: 'coin-mausoleum'},
    {human: 'Coin: Moonlight', logic: 'Coin: Moonlight', key: 'coin-moonlight'},
    {human: 'Coin: Ruin', logic: 'Coin: Ruin', key: 'coin-ruin'},
    {human: 'Coin: Shrine', logic: 'Coin: Shrine', key: 'coin-shrine'},
    {human: 'Coin: Spring', logic: 'Coin: Spring', key: 'coin-spring'},
    {human: 'Coin: Sun (Pyramid/Bomb)', logic: 'Coin: Sun (Pyramid)', key: 'coin-sun-pyramid'},
    {human: 'Coin: Surface (Ruin Path)', logic: 'Coin: Surface (Ruin Path)', key: 'coin-surface-ruin-path'},
    {human: 'Coin: Surface (Seal)', logic: 'Coin: Surface (Seal)', key: 'coin-surface-seal'},
    {human: 'Coin: Surface (Waterfall)', logic: 'Coin: Surface (Waterfall)', key: 'coin-surface-waterfall'},
    {human: 'Coin: Twin (Escape)', logic: 'Coin: Twin (Escape)', key: 'coin-twin-escape'},
    {human: 'Coin: Twin (Below Zu)', logic: 'Coin: Twin (Lower)', key: 'coin-twin-lower'},
    {human: 'Coin: Twin (Peryton Witches)', logic: 'Coin: Twin (Witches)', key: 'coin-twin-witches'},

    {human: 'Check: Illusion Trap Chest', logic: 'Trap: Exploding', key: 'trap-exploding'},
    {human: 'Check: Graveyard Trap Chest', logic: 'Trap: Graveyard', key: 'trap-graveyard'},
    {human: 'Check: Inferno Trap Orb', logic: 'Trap: Inferno Orb', key: 'trap-inferno-orb'},
    {human: 'Check: Twin Trap Ankh Jewel', logic: 'Trap: Twin Ankh', key: 'trap-twin-ankh'},
]);
export let itemLocations = {};
itemLocations.all = itemLocationDefs.map(data => new ItemLocation(data));
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

let sealLocationDefs = [
    {human: 'Surface Birth Seal Chest', locations: ['Location: Surface [Main]'], logic: 'Seal: O1', key: 'seal-o1'},
    {human: 'Sun Mulbruk\'s Room', locations: ['Location: Temple of the Sun [Main]'], logic: 'Seal: O2', key: 'seal-o2'},
    {human: 'Sun Flooded Exits', locations: ['Location: Temple of the Sun [East]'], logic: 'Seal: O3', key: 'seal-o3'},
    {human: 'Spring Mr. Fishman Shop', locations: ['Location: Spring in the Sky [Upper]'], logic: 'Seal: O4', key: 'seal-o4'},
    {human: 'Spring Water Release', locations: ['Location: Spring in the Sky [Waterfall]'], logic: 'Seal: O5', key: 'seal-o5'},
    {human: 'Endless Shop', locations: ['Location: Endless Corridor [1F]'], logic: 'Seal: O6', key: 'seal-o6'},
    {human: 'Shrine Sacred Orb Seal A', locations: ['Location: Shrine of the Mother [Main]'], logic: 'Seal: O7', key: 'seal-o7'},
    {human: 'Mother Ankh Seal A', locations: ['Location: True Shrine of the Mother'], logic: 'Seal: O8', key: 'seal-o8'},
    {human: 'Spring Sacred Orb Chest', locations: ['Location: Spring in the Sky [Main]'], logic: 'Seal: B1', key: 'seal-b1'},
    {human: 'Inferno Pazuzu Seal', locations: ['Location: Inferno Cavern [Main]'], logic: 'Seal: B2', key: 'seal-b2'},
    {human: 'Extinction Life Seal Chest', locations: ['Location: Chamber of Extinction [Main]'],  logic: 'Seal: B3', key: 'seal-b3'},
    {human: 'Shrine Sacred Orb Seal B', locations: ['Location: Shrine of the Mother [Main]'], logic: 'Seal: B4', key: 'seal-b4'},
    {human: 'Illusion Chi You', locations: ['Location: Gate of Illusion [Grail]'], logic: 'Seal: B5', key: 'seal-b5'},
    // {human: 'Illusion Chi You', locations: ['Location: Gate of Illusion [Grail]', 'Location: Gate of Illusion [Ruin]'], logic: 'Seal: B5', key: 'seal-b5'},
    {human: 'Moonlight Anubis', locations: ['Location: Temple of Moonlight [Lower]'], logic: 'Seal: B6', key: 'seal-b6'},
    {human: 'Mother Ankh Seal B', locations: ['Location: True Shrine of the Mother'], logic: 'Seal: B7', key: 'seal-b7'},
    {human: 'Guidance Crucifix Chest', locations: ['Location: Gate of Guidance [Main]'], logic: 'Seal: L1', key: 'seal-l1'},
    {human: 'Surface Coin Chest', locations: ['Location: Surface [Main]'], logic: 'Seal: L2', key: 'seal-l2'},
    {human: 'Extinction Perma-light', locations: ['Location: Chamber of Extinction [Main]'], logic: 'Seal: L3', key: 'seal-l3'},
    {human: 'Shrine Crystal Skull Chest', locations: ['Location: Shrine of the Mother [Main]'], logic: 'Seal: L4', key: 'seal-l4'},
    {human: 'Shrine Sacred Orb Seal C', locations: ['Location: Shrine of the Mother [Main]'], logic: 'Seal: L5', key: 'seal-l5'},
    {human: 'Graveyard Gauntlet Chest', locations: ['Location: Graveyard of the Giants [West]'], logic: 'Seal: L6', key: 'seal-l6'},
    {human: 'Birth Perma-light', locations: ['Location: Chamber of Birth [Southeast]'], logic: 'Seal: L7', key: 'seal-l7'},
    {human: 'Mother Ankh Seal C', locations: ['Location: True Shrine of the Mother'], logic: 'Seal: L8', key: 'seal-l8'},
    {human: 'Sun Discount Shop', locations: ['Location: Temple of the Sun [Main]'], logic: 'Seal: D1', key: 'seal-d1'},
    {human: 'Shrine Sacred Orb Seal D', locations: ['Location: Shrine of the Mother [Main]'], logic: 'Seal: D2', key: 'seal-d2'},
    // {human: 'Shrine Laptop', locations: [], logic: 'Seal: D3', key: 'seal-d3'},
    {human: 'Ruin Nuwa', locations: ['Location: Tower of Ruin [Top]'], logic: 'Seal: D4', key: 'seal-d4'},
    {human: 'DC Sacred Orb', locations: ['Location: Dimensional Corridor [Upper]'], logic: 'Seal: D5', key: 'seal-d5'},
    {human: 'Mother Ankh Seal D', locations: ['Location: True Shrine of the Mother'], logic: 'Seal: D6', key: 'seal-d6'},
];

export let sealLocations = {};
sealLocations.all = sealLocationDefs.map(data => new SealLocation(data));
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

// These might look backwards at first glance, but doors are defined by their *destination*.
let doorLocationDefs = [
    {human: 'Illusion', location: 'Location: Gate of Illusion [Grail]', logic: 'Door: F1', key: 'door-f1'},
    {human: 'Graveyard', location: 'Location: Graveyard of the Giants [West]', logic: 'Door: F2', key: 'door-f2'},
    {human: 'Moonlight', location: 'Location: Temple of Moonlight [Lower]', logic: 'Door: F3', key: 'door-f3'},
    {human: 'Ruin Lower (Earth Spear)', location: 'Location: Tower of Ruin [Southwest Door]', logic: 'Door: F4', key: 'door-f4'},
    {human: 'Goddess', location: 'Location: Tower of the Goddess [Lower]', logic: 'Door: F5', key: 'door-f5'},
    {human: 'Birth', location: 'Location: Chamber of Birth [Northeast]', logic: 'Door: F6', key: 'door-f6'},
    {human: 'Ruin Upper (Nuwa)', location: 'Location: Tower of Ruin [Top]', logic: 'Door: F7', key: 'door-f7'},
    {human: 'DC', location: 'Location: Dimensional Corridor [Grail]', logic: 'Door: F8', key: 'door-f8'},

    {human: 'Gate of Time', location: 'Location: Gate of Time [Mausoleum Lower]', logic: 'Door: F9', key: 'door-f9'},

    {human: 'Guidance', location: 'Location: Gate of Guidance [Door]', logic: 'Door: B1', key: 'door-b1'},
    {human: 'Mausoleum', location: 'Location: Mausoleum of the Giants', logic: 'Door: B2', key: 'door-b2'},
    {human: 'Sun', location: 'Location: Temple of the Sun [Main]', logic: 'Door: B3', key: 'door-b3'},
    {human: 'Inferno Lower (Ankh)', location: 'Location: Inferno Cavern [Viy]', logic: 'Door: B4', key: 'door-b4'},
    {human: 'Surface (Waterfall)', location: 'Location: Surface [Main]', logic: 'Door: B5', key: 'door-b5'},
    {human: 'Extinction Upper (Magatama)', location: 'Location: Chamber of Extinction [Magatama Left]', logic: 'Door: B6', key: 'door-b6'},
    {human: 'Inferno Upper (Spikes)', location: 'Location: Inferno Cavern [Spikes]', logic: 'Door: B7', key: 'door-b7'},
    {human: 'Endless (Exit Only)', location: 'Location: Endless Corridor [1F]', logic: 'Door: B8', key: 'door-b8'},
    {human: 'Extinction Lower (Main)', location: 'Location: Chamber of Extinction [Main]', logic: 'Door: B9', key: 'door-b9'},
];

export let doorLocations = {};
doorLocations.all = doorLocationDefs.map(data => new DoorLocation(data));
doorLocations.byLocation = new Map(doorLocations.all.map(loc => [loc.location, loc]));
doorLocations.byLogic = new Map(doorLocations.all.map(loc => [loc.logic, loc]));
doorLocations.byKey = new Map(doorLocations.all.map(loc => [loc.key, loc]));
window.doorLocations = doorLocations;
