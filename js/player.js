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
            type: "debit",
            active: true
        }
    },

    transactions: []
};

let player;

function initializePlayer() {

    const saved = loadGame();

    if (saved && saved.player) {
        player = saved.player;
        return;
    }

    player = structuredClone(defaultPlayer);

    savePlayer();
}

function savePlayer() {

    saveGame({
        player: player
    });
}
