import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



export default function Schedule({ games }) {
  const day1 = games.filter(g => g.day === 1).sort((a, b) => (a.order || 0) - (b.order || 0));
  const day2 = games.filter(g => g.day === 2).sort((a, b) => (a.order || 0) - (b.order || 0));

console.log(games);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-display font-bold">Schedule</h2>
      </div>

      <Tabs defaultValue="day1">
        <TabsList className="mb-4 bg-muted/80">
          <TabsTrigger value="day1" className="font-heading font-semibold">Day 1</TabsTrigger>
          <TabsTrigger value="day2" className="font-heading font-semibold">Day 2</TabsTrigger>
        </TabsList>
        <TabsContent value="day1">
          <GameList games={day1} />
        </TabsContent>
        <TabsContent value="day2">
          <GameList games={day2} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GameList({ games }) {
  if (games.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No games scheduled for this day</p>;
  }

  return (
    <div className="space-y-3">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={`/game/${game.id}`}
            className="group flex items-center gap-4 p-4 bg-card rounded-xl border hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
              {game.icon || "🎮"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-base truncate">{game.name}</h3>
                {game.is_jeopardy && (
                  <span className="flex-shrink-0 px-2 py-0.5 bg-accent/15 text-accent rounded-full text-xs font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Jeopardy
                  </span>
                )}
              </div>
              {game.description && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">{game.description}</p>
              )}
            </div>
            {(game.start_time || game.end_time) && (
              <div className="flex-shrink-0 text-right">
                <span className="text-sm font-medium text-muted-foreground">
                  {game.start_time}{game.end_time ? ` – ${game.end_time}` : ''}
                </span>
              </div>
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}