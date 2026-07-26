import { getPlayers } from "@/lib/playerStorage";

export default function Matchups({ gameId }) {
    const players = getPlayers();

    const resolve = (code) => {
        if (code.startsWith("A-")) {
            const index = Number(code.split("-")[1]) - 1;
            return players["Team A"]?.[index] || code;
        }

        if (code.startsWith("B-")) {
            const index = Number(code.split("-")[1]) - 1;
            return players["Team B"]?.[index] || code;
        }

        return code;
    };

    const matchupConfigs = {
        darkness: [
            ["A-1", "B-6"],
            ["A-2", "B-5"],
            ["A-3", "B-4"],
            ["A-4", "B-3"],
            ["A-5", "B-2"],
            ["A-6", "B-1"],
        ],

        bocce: [
            ["A-1 & A-2", "B-1 & B-2"],
            ["A-3 & A-4", "B-3 & B-4"],
            ["A-5 & A-6", "B-5 & B-6"],
        ],

        passthepigs: [
            ["A-1 & A-2", "B-1 & B-2"],
            ["A-3 & A-4", "B-3 & B-4"],
            ["A-5 & A-6", "B-5 & B-6"],
        ],

        frisbee: [
            ["A-1 & A-4", "B-6 & B-3"],
            ["A-2 & A-5", "B-5 & B-2"],
            ["A-3 & A-6", "B-4 & B-1"],
        ],

        poker: [
            ["A-1 & A-3 & A-5", "B-2 & B-4 & B-6"],
            ["A-2 & A-4 & A-6", "B-1 & B-3 & B-5"],
        ],
    };

    const matchups = matchupConfigs[gameId];

    if (!matchups) {
        return null;
    }

    const replaceNames = (text) => {
        return text.replace(
            /([AB]-\d)/g,
            (match) => resolve(match)
        );
    };

    return (
        <div>
            <h3 className="font-display font-bold text-lg mb-4">
                Matchups
            </h3>

            <div className="space-y-2">
                {matchups.map(([left, right], index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_auto_1fr] gap-4 p-3 border rounded-lg"
                    >
                        <div className="text-right font-medium">
                            {replaceNames(left)}
                        </div>

                        <div className="text-muted-foreground font-bold">
                            vs.
                        </div>

                        <div className="font-medium">
                            {replaceNames(right)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}