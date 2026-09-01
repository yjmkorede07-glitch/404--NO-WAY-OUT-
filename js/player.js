const defaultPlayer = {
    id: "player_darius_cole",

    name: "Darius Cole",

    age: 24,

    cash: 500,

    bank: {
        accountNumber: "40400001",

        balance: 5000,

        card: {
            id: "card_40400001",
            number: "4040-0000-0000-0001",
            type: "debit",
            active: true
        }
    },

    transactions: []
};


/*
    These are the first NPC financial accounts.

    Later this system will be connected to the
    actual NPC system and physical locations.
*/

const defaultNPCs = {

    malik_reed: {
        id: "malik_reed",

        name: "Malik Reed",

        cash: 300,

        bank: {
            accountNumber: "40400002",
            balance: 1200
        },

        transactions: []
    },

    amara_vale: {
        id: "amara_vale",

        name: "Amara Vale",

        cash: 250,

        bank: {
            accountNumber: "40400003",
            balance: 2500
        },

        transactions: []
    }
};


let player;
let npcs;


function initializePlayer() {

    const saved = loadGame();

    if (saved && saved.player) {

        player = saved.player;

    } else {

        player = JSON.parse(
            JSON.stringify(defaultPlayer)
        );
    }


    /*
        Load NPC accounts.

        If an older save does not contain NPCs,
        create them automatically.
    */

    if (saved && saved.npcs) {

        npcs = saved.npcs;

    } else {

        npcs = JSON.parse(
            JSON.stringify(defaultNPCs)
        );
    }


    savePlayer();
}


function savePlayer() {

    saveGame({

        player: player,

        npcs: npcs

    });
}


function getNPCById(id) {

    return npcs[id] || null;
}


function getNPCList() {

    return Object.values(npcs);
}
