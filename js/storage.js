const SAVE_KEY = "404_no_way_out_save";

function saveGame(data) {
    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );
}

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);

    if (!saved) {
        return null;
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error("Save data is corrupted.");
        return null;
    }
}

function deleteSave() {
    localStorage.removeItem(SAVE_KEY);
}
