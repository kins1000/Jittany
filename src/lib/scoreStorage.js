const STORAGE_KEY = "jittany-scores";

export function getScores() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );
}

export function saveScore(score) {
    const scores = getScores();

    const existing = scores.findIndex(
        s =>
            s.game_id === score.game_id &&
            s.team_id === score.team_id
    );

    if (existing >= 0) {
        scores[existing] = score;
    } else {
        scores.push(score);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(scores)
    );
}

export function clearScores() {
    localStorage.removeItem(STORAGE_KEY);
}