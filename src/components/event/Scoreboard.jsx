import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award } from "lucide-react";

const rankIcons = [
  <Trophy className="w-6 h-6 text-yellow-500" />,
  <Medal className="w-6 h-6 text-gray-400" />,
  <Award className="w-6 h-6 text-amber-700" />,
];

export default function Scoreboard({ teams }) {
  const sorted = [...teams].sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  const maxScore = sorted[0]?.total_score || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-accent" />
        <Link to="/scoreboard">
          <h2 className="text-2xl font-display font-bold hover:text-primary transition-colors cursor-pointer">Scoreboard</h2>
        </Link>
      </div>

      {sorted.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No teams added yet</p>
      )}

      <div className="space-y-3">
        {sorted.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-card rounded-xl border p-4 overflow-hidden group hover:shadow-lg transition-shadow"
          >
            {/* Score bar background */}
            <div
              className="absolute inset-0 opacity-10 transition-all duration-700"
              style={{
                width: `${((team.total_score || 0) / maxScore) * 100}%`,
                backgroundColor: team.color || 'hsl(var(--primary))',
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted font-display font-bold text-lg">
                  {index < 3 ? rankIcons[index] : <span className="text-muted-foreground">{index + 1}</span>}
                </div>
                <div className="flex items-center gap-3">
                  {team.color && (
                    <div
                      className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                      style={{ backgroundColor: team.color }}
                    />
                  )}
                  <span className="font-heading font-semibold text-lg">{team.name}</span>
                </div>
              </div>
              <div className="font-display font-bold text-2xl tabular-nums">
                {team.total_score || 0}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}