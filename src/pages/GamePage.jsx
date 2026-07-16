import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameRules from "@/components/game/GameRules";
import ScoreEntry from "@/components/game/ScoreEntry";
import JeopardyBoard from "@/components/game/JeopardyBoard";
import SpinnerSection from "@/components/game/SpinnerSection";
import gamesData from "@/data/games.json";
import teamsData from "@/data/teams.json";
import gameScoresData from "@/data/gamescore.json";
import jeopardyQuestionsData from "@/data/jeopardyquestion.json";


export default function GamePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split("/");
  const gameId = pathParts[pathParts.length - 1];

  const games = gamesData;

  const game = games.find(g => g.id === gameId);

  const teams = teamsData;

  const gameScores = gameScoresData.filter(
    score => score.game_id === gameId
  );

  const jeopardyQuestions = jeopardyQuestionsData.filter(
   question => question.game_id === gameId
  );

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Loading game...</p>
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
        {/* Navigation */}
        <Link to="/">
          <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Event
          </Button>
        </Link>

        {/* Game Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border p-6 md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
              {game.icon || "🎮"}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">{game.name}</h1>
              {game.description && (
                <p className="text-muted-foreground mt-1 text-lg">{game.description}</p>
              )}
              <div className="flex gap-3 mt-3 text-sm text-muted-foreground">
                <span className="px-3 py-1 bg-muted rounded-full font-medium">Day {game.day}</span>
                {(game.start_time || game.end_time) && (
                  <span className="px-3 py-1 bg-muted rounded-full font-medium">
                    {game.start_time}{game.end_time ? ` – ${game.end_time}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Spinner Section (if applicable) */}
        {game.is_spinner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border p-6 md:p-8"
          >
            <SpinnerSection game={game} teams={teams} />
          </motion.div>
        )}

        {/* Jeopardy Board (if applicable) */}
        {game.is_jeopardy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border p-6 md:p-8"
          >
            <JeopardyBoard questions={jeopardyQuestions} gameId={gameId} />
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl border p-6 md:p-8"
          >
            <GameRules rules={game.rules} />
          </motion.div>

          {/* Score Entry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border p-6 md:p-8"
          >
            <ScoreEntry gameId={gameId} teams={teams} gameScores={gameScores} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}