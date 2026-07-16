import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/admin";
import {
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Maximize2,
} from "lucide-react";


function getDrivePreviewUrl(url) {
  if (!url) return null;

  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);

  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }

  return url;
}

export default function JeopardyBoard({ questions = [] }) {


  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealedIds, setRevealedIds] = useState(() => {
  return JSON.parse(
    localStorage.getItem("jeopardy-board") || "[]"
  );
});

  const gameContainerRef = useRef(null);
  const questionVideoRef = useRef(null);
  const answerVideoRef = useRef(null);
  const admin = isAdmin();
  const storageKey = "jeopardy-board";

  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    return (a.points || 0) - (b.points || 0);
  });

  const handleFullscreen = () => {
    gameContainerRef.current?.requestFullscreen?.();
  };

  const handleCellClick = (question) => {
    if (!question || question.is_revealed) return;

    setSelectedQuestion(question);
    setShowAnswer(false);
  };

const handleReveal = () => {
  if (!selectedQuestion) return;

  const updatedIds = [
    ...revealedIds,
    selectedQuestion.id,
  ];

  localStorage.setItem(
    "jeopardy-board",
    JSON.stringify(updatedIds)
  );

  setRevealedIds(updatedIds);

  setSelectedQuestion(null);
  setShowAnswer(false);
};


const handleResetBoard = () => {
  localStorage.removeItem("jeopardy-board");
  setRevealedIds([]);
};

  if (sortedQuestions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No Jeopardy questions added yet.</p>
      </div>
    );
  }

  return (
    <div ref={gameContainerRef} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Jeopardy Board</h3>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Full Screen
          </Button>

{admin && (
  <Button
    variant="outline"
    size="sm"
    onClick={handleResetBoard}
  >
    <RotateCcw className="w-4 h-4 mr-2" />
    Reset Board
  </Button>
)}
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(5,1fr)",
        }}
      >
{sortedQuestions.map((question, index) => {
  const isRevealed =
    question.is_revealed ||
    revealedIds.includes(question.id);

  return (
    <button
      key={question.id}
      disabled={isRevealed}

      onClick={() => {
  	if (!admin) return;

      handleCellClick(question);
	}}
      className={`aspect-square rounded-lg text-xl font-bold transition
        ${
          isRevealed
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-red-700 hover:bg-red-600 text-white"
        }`}
    >
      {isRevealed ? "—" : index + 1}
    </button>
  );
})}
      </div>

      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedQuestion(null);
              setShowAnswer(false);
            }}
          >
            <motion.div
              className="bg-primary text-primary-foreground rounded-xl w-[95vw] h-[95vh] p-6 overflow-auto"
              initial={{ scale: .9 }}
              animate={{ scale: 1 }}
              exit={{ scale: .9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-3xl font-bold">
                  Question #{sortedQuestions.indexOf(selectedQuestion) + 1}
                </h2>

                <button
                  onClick={() => {
                    setSelectedQuestion(null);
                    setShowAnswer(false);
                  }}
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              {!showAnswer ? (
                <>
                  {selectedQuestion.question_video_url ? (
                    <div className="relative mb-6">
                      <iframe
                        ref={questionVideoRef}
                        src={getDrivePreviewUrl(
                          selectedQuestion.question_video_url
                        )}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="w-full h-[75vh] rounded-xl bg-black"
                      />

                      <button
                        className="absolute top-2 right-2 bg-black/70 p-2 rounded"
                        onClick={() =>
                          questionVideoRef.current?.requestFullscreen?.()
                        }
                      >
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-2xl whitespace-pre-wrap">
                      {selectedQuestion.question}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {selectedQuestion.answer_video_url ? (
                    <div className="relative mb-6">
                      <iframe
                        ref={answerVideoRef}
                        src={getDrivePreviewUrl(
                          selectedQuestion.answer_video_url
                        )}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="w-full h-[75vh] rounded-xl bg-black"
                      />

                      <button
                        className="absolute top-2 right-2 bg-black/70 p-2 rounded"
                        onClick={() =>
                          answerVideoRef.current?.requestFullscreen?.()
                        }
                      >
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-xl p-5">
                      <div className="text-sm opacity-70 mb-2">
                        Answer
                      </div>

                      <div className="text-2xl font-semibold whitespace-pre-wrap">
                        {selectedQuestion.answer}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() =>
                    setShowAnswer((prev) => !prev)
                  }
                >
                  {showAnswer ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Answer
                    </>
                  )}
                </Button>

{admin && (
  <Button
    className="flex-1"
    onClick={handleReveal}
  >
    Mark as Done
  </Button>
)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}