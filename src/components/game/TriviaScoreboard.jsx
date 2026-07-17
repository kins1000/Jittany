import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { isAdmin } from "@/lib/admin";

export default function TriviaScoreboard({ gameId, teams }) {
    const admin = isAdmin();

    const storageKey = `trivia-score-${gameId}`;

    const [scores, setScores] = useState(() => {
        return JSON.parse(
            localStorage.getItem(storageKey) || "{}"
        );
    });

    const updateScore = (teamId, delta) => {
        const updated = {
            ...scores,
            [teamId]: Math.max(
                0,
                (scores[teamId] || 0) + delta
            ),
        };

        setScores(updated);

        localStorage.setItem(
            storageKey,
            JSON.stringify(updated)
        );
    };

    const resetScores = () => {
        localStorage.removeItem(storageKey);
        setScores({});
    };


    return (
        <div className="space-y-4">
            <h3 className="font-display font-bold text-lg">
                Trivia Scoreboard
            </h3>

            {teams.map((team) => (
                <div
                    key={team.id}
                    className="flex items-center justify-between p-3 border rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        {team.color && (
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                    backgroundColor: team.color,
                                }}
                            />
                        )}

                        <span className="font-semibold">
              {team.name}
            </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {admin && (
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                    updateScore(team.id, -10)
                                }
                            >
                                <Minus className="w-3 h-3" />
                            </Button>
                        )}

                        <span className="font-display font-bold text-2xl w-12 text-center">
              {scores[team.id] || 0}
            </span>

                        {admin && (
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                    updateScore(team.id, 10)
                                }
                            >
                                <Plus className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}

            {admin && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetScores}
                >
                    Reset Trivia Scores
                </Button>
            )}
        </div>
    );
}