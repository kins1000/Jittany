import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScoreboardPage() {
  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: () => db.entities.Team.list("-total_score"),
  });

  const { data: games = [] } = useQuery({
    queryKey: ["games"],
    queryFn: () => db.entities.Game.list("order"),
  });

  const { data: allScores = [] } = useQuery({
    queryKey: ["allGameScores"],
    queryFn: () => db.entities.GameScore.list(),
  });

  const sortedGames = [...games].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return (a.order || 0) - (b.order || 0);
  });

  const getScoresForGame = (gameId) => {
    return allScores.filter(s => s.game_id === gameId);
  };

  const isGamePlayed = (gameId) => {
    const scores = getScoresForGame(gameId);
    return scores.some(s => s.points > 0);
  };

  const getTeamScore = (gameId, teamId) => {
    const score = allScores.find(s => s.game_id === gameId && s.team_id === teamId);
    return score?.points || 0;
  };

  const getMaxPoints = (game) => {
    // Jeopardy: sum of all point values (100+200+300+400+500 per category, assume 5 categories if unknown)
    return "—";
  };

  const sortedTeams = [...teams].sort((a, b) => (b.total_score || 0) - (a.total_score || 0));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Event
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-display font-bold">Scoreboard</h1>
        </motion.div>

        {/* Team totals summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl border p-6"
        >
          <h2 className="text-xl font-display font-bold mb-4">Overall Standings</h2>
          <div className="grid gap-3">
            {sortedTeams.map((team, index) => {
              const maxScore = sortedTeams[0]?.total_score || 1;
              return (
                <div key={team.id} className="relative bg-muted rounded-xl p-4 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-15 transition-all duration-700 rounded-xl"
                    style={{
                      width: `${((team.total_score || 0) / maxScore) * 100}%`,
                      backgroundColor: team.color || 'hsl(var(--primary))',
                    }}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-lg text-muted-foreground w-6">{index + 1}.</span>
                      {team.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />}
                      <span className="font-heading font-semibold text-lg">{team.name}</span>
                    </div>
                    <span className="font-display font-bold text-2xl">{team.total_score || 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Per-game breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border overflow-hidden"
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-display font-bold">Game Breakdown</h2>
          </div>

          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-heading font-semibold text-sm text-muted-foreground">Game</th>
                  <th className="text-center p-4 font-heading font-semibold text-sm text-muted-foreground">Day</th>
                  {sortedTeams.map(team => (
                    <th key={team.id} className="text-center p-4 font-heading font-semibold text-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        {team.color && <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }} />}
                        <span>{team.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedGames.map((game, index) => {
                  const played = isGamePlayed(game.id);
                  return (
                    <motion.tr
                      key={game.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.04 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{game.icon || "🎮"}</span>
                          <span className="font-body font-semibold">{game.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xs px-2 py-1 bg-muted rounded-full font-medium text-muted-foreground">
                          Day {game.day}
                        </span>
                      </td>
                      {sortedTeams.map(team => {
                        const pts = getTeamScore(game.id, team.id);
                        return (
                          <td key={team.id} className="p-4 text-center">
                            {played ? (
                              <span className={`font-display font-bold text-xl ${pts > 0 ? "text-primary" : "text-muted-foreground"}`}>
                                {pts}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm font-body italic">not played</span>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}