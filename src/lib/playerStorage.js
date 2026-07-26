const STORAGE_KEY = "jittany-players";

const defaultPlayers = {
    "Team A": [
        "A-1",
        "A-2",
        "A-3",
        "A-4",
        "A-5",
        "A-6",
        "A-7"
    ],
    "Team B": [
        "B-1",
        "B-2",
        "B-3",
        "B-4",
        "B-5",
        "B-6",
        "B-7"
    ]
};

export function getPlayers() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEY) ||
        JSON.stringify(defaultPlayers)
    );
}

export function savePlayers(players) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(players)
    );
}