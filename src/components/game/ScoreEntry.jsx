import { useState, useEffect } from "react";
import { isAdmin } from "@/lib/admin";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export default function ScoreEntry({ gameId, teams, gameScores }) {
  const queryClient = useQueryClient();
  const [scores, setScores] = useState({});
  const [saving, setSaving] = useState(false);
  const admin = isAdmin();


  if (!admin) {
    return (
      <div className="text-muted-foreground">
      </div>
    );
  }


  useEffect(() => {
    const initial = {};
    teams.forEach(team => {
      const existing = gameScores.find(gs => gs.team_id === team.id);
      initial[team.id] = existing?.points || 0;
    });
    setScores(initial);
  }, [teams, gameScores]);

  const adjustScore = (teamId, delta) => {
    setScores(prev => ({
      ...prev,
      [teamId]: Math.max(0, (prev[teamId] || 0) + delta),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    for (const team of teams) {
      const existing = gameScores.find(gs => gs.team_id === team.id);
      const newPoints = scores[team.id] || 0;

      if (existing) {
        const oldPoints = existing.points || 0;
        const diff = newPoints - oldPoints;
        await db.entities.GameScore.update(existing.id, { points: newPoints });
        await db.entities.Team.update(team.id, {
          total_score: (team.total_score || 0) + diff,
        });
      } else {
        await db.entities.GameScore.create({
          game_id: gameId,
          team_id: team.id,
          points: newPoints,
        });
        await db.entities.Team.update(team.id, {
          total_score: (team.total_score || 0) + newPoints,
        });
      }
    }
    queryClient.invalidateQueries({ queryKey: ["gameScores"] });
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    toast.success("Scores saved!");
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-lg">Enter Points</h3>
      <div className="space-y-3">
        {teams.map(team => (
          <div key={team.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border">
            {team.color && (
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }} />
            )}
            <span className="font-heading font-semibold flex-1">{team.name}</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => adjustScore(team.id, -10)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={scores[team.id] || 0}
                onChange={e => setScores(prev => ({ ...prev, [team.id]: parseInt(e.target.value) || 0 }))}
                className="w-24 text-center font-display font-bold text-lg"
              />
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => adjustScore(team.id, 10)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Scores"}
      </Button>
    </div>
  );
}