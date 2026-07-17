import { Link } from "react-router-dom";
import teams from "@/data/teams.json";
import gameConfig from "@/data/gameConfig.json";
import { getScores } from "@/lib/scoreStorage";

export default function PointsDetail() {
    const scores = getScores();

    const getTeamScore = (gameId, teamId) => {
        const scoreRecord = scores.find(
            (s) =>
                s.game_id === gameId &&
                s.team_id === teamId
        );

        return scoreRecord?.points ?? "-";
    };

    const getTeamTotal = (teamId) => {
        return scores
            .filter((s) => s.team_id === teamId)
            .reduce(
                (sum, s) => sum + Number(s.points || 0),
                0
            );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        Points Detail
                    </h1>

                    <Link
                        to="/"
                        className="text-primary hover:underline"
                    >
                        Back to Event
                    </Link>
                </div>

                <div className="overflow-auto rounded-xl border bg-card">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-muted">
                            <th className="border p-3 text-left">
                                Game
                            </th>

                            <th className="border p-3 text-center">
                                Max Points
                            </th>

                            {teams.map((team) => (
                                <th
                                    key={team.id}
                                    className="border p-3 text-center"
                                    style={{
                                        color: team.color,
                                    }}
                                >
                                    {team.name}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {gameConfig.map((game) => (
                            <tr key={game.id}>
                                <td className="border p-3">
                                    {game.name}
                                </td>

                                <td className="border p-3 text-center">
                                    {game.maxPoints}
                                </td>

                                {teams.map((team) => (
                                    <td
                                        key={team.id}
                                        className="border p-3 text-center"
                                    >
                                        {getTeamScore(
                                            game.id,
                                            team.id
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        <tr className="bg-muted font-bold">
                            <td className="border p-3">
                                Total
                            </td>

                            <td className="border p-3"></td>

                            {teams.map((team) => (
                                <td
                                    key={team.id}
                                    className="border p-3 text-center"
                                >
                                    {getTeamTotal(team.id)}
                                </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}