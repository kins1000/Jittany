import EventHeader from "@/components/event/EventHeader";
import Scoreboard from "@/components/event/Scoreboard";
import Schedule from "@/components/event/Schedule";
import AdminLogin from "@/components/AdminLogin";
import teamsData from "@/data/teams.json";
import gamesData from "@/data/games.json";
import { Link } from "react-router-dom";

export default function Home() {
  const teams = teamsData;
  const games = gamesData;

  const loadingTeams = false;
  const loadingGames = false;

  const isLoading = loadingTeams || loadingGames;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8">
        <EventHeader />
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Schedule games={games} />
          </div>

          <div className="md:col-span-2">
            <Link to="/pointsdetail">
              <div className="cursor-pointer hover:opacity-90 transition-opacity">
                <Scoreboard teams={teams} />
              </div>
            </Link>
          </div>
        </div>
<AdminLogin />
      </div>

    </div>
  );
}