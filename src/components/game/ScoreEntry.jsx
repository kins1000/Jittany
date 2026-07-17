import { useState, useEffect } from "react";
import { isAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { saveScore } from "@/lib/scoreStorage";
import { getScores } from "@/lib/scoreStorage";

export default function ScoreEntry({
                                     gameId,
                                     teams,
                                     gameScores = [],
                                   }) {
  const [scores, setScores] = useState({});
  const [saving, setSaving] = useState(false);

  const admin = isAdmin();

    if (!admin) {
        return (
            <div className="space-y-4">
                <h3 className="font-display font-bold text-lg">
                    Current Points
                </h3>

                <div className="space-y-3">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="flex items-center justify-between p-3 bg-card rounded-xl border"
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

                                <span className="font-heading font-semibold">
                {team.name}
              </span>
                            </div>

                            <span className="font-display font-bold text-xl">
              {scores[team.id] || 0}
            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    useEffect(() => {
        const savedScores = getScores();

        const initial = {};

        teams.forEach((team) => {
            const existing = savedScores.find(
                (s) =>
                    s.game_id === gameId &&
                    s.team_id === team.id
            );

            initial[team.id] = existing?.points || 0;
        });

        setScores(initial);
    }, [teams, gameId]);


    const adjustScore = (teamId, delta) => {
        setScores((prev) => ({
                ...prev,
                [teamId]: Math.max (
                0,
            (prev[teamId] || 0) + delta
        ),
    }));
    };


  const handleSave = async () => {
    setSaving(true);

    try {
      for (const team of teams) {
        saveScore({
          game_id: gameId,
          team_id: team.id,
          points: scores[team.id] || 0,
        });
      }

      toast.success("Scores saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save scores");
    }

    setSaving(false);
  };

  return (
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg">
          Enter Points
        </h3>

        <div className="space-y-3">
          {teams.map((team) => (
              <div
                  key={team.id}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border"
              >
                {team.color && (
                    <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: team.color,
                        }}
                    />
                )}

                <span className="font-heading font-semibold flex-1">
              {team.name}
            </span>

                <div className="flex items-center gap-2">
                  <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                          adjustScore(team.id, -1)
                      }
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <Input
                      type="number"
                      value={scores[team.id] || 0}
                      onChange={(e) =>
                          setScores((prev) => ({
                            ...prev,
                            [team.id]:
                            parseInt(
                                e.target.value,
                                10
                            ) || 0,
                          }))
                      }
                      className="w-24 text-center font-display font-bold text-lg"
                  />

                  <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                          adjustScore(team.id, 1)
                      }
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
          ))}
        </div>

        <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-2"
        >
          <Save className="w-4 h-4" />

          {saving
              ? "Saving..."
              : "Save Scores"}
        </Button>
      </div>
  );
}