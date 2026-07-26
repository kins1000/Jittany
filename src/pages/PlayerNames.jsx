import { useState } from "react";
import { Link } from "react-router-dom";
import {
    getPlayers,
    savePlayers,
} from "@/lib/playerStorage";
import { Button } from "@/components/ui/button";

export default function PlayerNames() {
    const [players, setPlayers] = useState(
        getPlayers()
    );

    const updatePlayer = (team, index, value) => {
        const updated = {
            ...players,
            [team]: [...players[team]],
        };

        updated[team][index] = value;

        setPlayers(updated);
    };

    const handleSave = () => {
        savePlayers(players);
        alert("Players saved");
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    Player Names
                </h1>

                <Link to="/">
                    <Button variant="outline">
                        Back
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(players).map(
                    ([team, names]) => (
                        <div
                            key={team}
                            className="border rounded-xl p-4"
                        >
                            <h2 className="font-bold mb-4">
                                {team}
                            </h2>

                            {names.map(
                                (player, index) => (
                                    <input
                                        key={index}
                                        value={player}
                                        onChange={(e) =>
                                            updatePlayer(
                                                team,
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded p-2 mb-2"
                                    />
                                )
                            )}
                        </div>
                    )
                )}
            </div>

            <Button
                className="mt-6"
                onClick={handleSave}
            >
                Save Names
            </Button>
        </div>
    );
}