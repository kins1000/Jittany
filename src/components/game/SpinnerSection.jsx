import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shuffle, RotateCcw } from "lucide-react";
import { isAdmin } from "@/lib/admin";

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 3;


// All reels start simultaneously; each keeps spinning until its stop time.
// Reel 1 stops at 3s, reel 2 at 4s (1s pause), reel 3 at 6s (2s pause).
const SPIN_DURATION_1 = 3000;
const SPIN_DURATION_2 = 4000;
const SPIN_DURATION_3 = 6000;

function SlotReel({ items, targetIndex, spinNonce, spinDuration, label, wide }) {
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    if (spinNonce === 0) return;
    setAnimating(true);
  }, [spinNonce]);

const totalLoops = 20;
const totalItems = items.length;

const repeatedItems = [];
for (let i = 0; i < (totalLoops + 2) * totalItems; i++) {
  repeatedItems.push(items[i % totalItems]);
}

const centerOffset = Math.floor(VISIBLE_ITEMS / 2);
const finalIndex =
  totalLoops * totalItems +
  targetIndex -
  centerOffset;

const targetY =
  spinNonce > 0
    ? -finalIndex * ITEM_HEIGHT
    : 0;

  const RED = "#E53E3E";
  const GOLD = "#8a6d3b";
  const FRAME_DARK = "#120202";
  const FRAME_MID = "#2a0606";

  const cornerPositions = [
    "top-0 left-0",
    "top-0 right-0",
    "bottom-0 left-0",
    "bottom-0 right-0",
  ];

  return (
    <div className="flex flex-col items-center gap-2 w-full" style={{ width: wide ? "360px" : "180px" }}>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      {/* Gothic frame */}
      <div className="relative w-full" style={{ padding: "10px" }}>
        {/* Outer ornate border */}
        <div className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${FRAME_DARK} 0%, ${FRAME_MID} 40%, ${FRAME_DARK} 60%, ${FRAME_MID} 100%)`,
            boxShadow: `0 0 0 1px ${GOLD}55, 0 0 0 3px ${FRAME_DARK}, 0 0 0 4px ${GOLD}33, 0 4px 16px rgba(0,0,0,0.7), 0 0 14px rgba(229,62,62,0.12)`,
          }}
        />
        {/* Inner bevel border */}
        <div className="absolute rounded-md pointer-events-none"
          style={{ top: "4px", left: "4px", right: "4px", bottom: "4px", boxShadow: `inset 0 0 0 1px ${GOLD}44, inset 0 0 6px rgba(0,0,0,0.5)` }} />
        {/* Corner ornaments */}
        {cornerPositions.map((pos, i) => (
          <div key={i} className={`absolute ${pos} z-20`} style={{ width: "16px", height: "16px" }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 rounded-sm"
              style={{ background: GOLD, boxShadow: `0 0 4px ${GOLD}88` }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rotate-45 border"
              style={{ borderColor: `${GOLD}66` }} />
          </div>
        ))}
        {/* Inner viewport */}
        <div
          className="relative rounded-md overflow-hidden w-full"
          style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, border: `1px solid ${FRAME_MID}`, background: "hsl(var(--card))" }}
        >
          <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
            style={{ height: ITEM_HEIGHT, background: "linear-gradient(to bottom, hsl(var(--card)), transparent)" }} />
          <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{ height: ITEM_HEIGHT, background: "linear-gradient(to top, hsl(var(--card)), transparent)" }} />
          <div className="absolute inset-x-0 z-10 pointer-events-none border-y-2"
            style={{ top: ITEM_HEIGHT * centerOffset, height: ITEM_HEIGHT, borderColor: RED, background: `${RED}18` }} />

          <motion.div
            key={spinNonce}
            initial={{ y: 0 }}
            animate={{ y: targetY }}
            transition={{
              y: { duration: spinNonce > 0 ? spinDuration / 1000 : 0, ease: [0.15, 0.85, 0.45, 1.0] },
            }}
            onAnimationComplete={() => setAnimating(false)}
            className="absolute top-0 left-0 right-0"
            style={{
  		filter: animating || spinNonce === 0 ? "blur(8px)" : "blur(0px)",
  		transition: "filter 0.3s ease"
		}}

          >
            {repeatedItems.map((item, i) => (
              <div key={i} className="flex items-center justify-center px-2 font-heading font-semibold text-sm text-center"
                style={{ height: ITEM_HEIGHT, color: RED }}>
                {item}
              </div>
            ))}
          </motion.div>

          {/* Winner overlay — covers non-winning rows after spin completes */}
          {!animating && spinNonce > 0 && (
            <>
              <div className="absolute inset-x-0 top-0 z-20 pointer-events-none"
                style={{ height: ITEM_HEIGHT * centerOffset, background: "hsl(var(--card))", transition: "opacity 0.3s ease" }} />
              <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
                style={{ height: ITEM_HEIGHT * centerOffset, background: "hsl(var(--card))", transition: "opacity 0.3s ease" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SpinnerSection({ game, teams }) {
const admin = isAdmin();
	
let config = game.spinner_config || {};

if (typeof config === "string") {
  try {
    config = JSON.parse(config.replace(/""/g, '"'));
  } catch (e) {
    console.error("Invalid spinner config", e);
    config = {};
  }
}


  const team1 = teams.find(t => t.id === config.team1_id);
  const team2 = teams.find(t => t.id === config.team2_id);
  const miniGames = config.minigame_options || [];
  const spins = config.spins || [];

  const players1 = team1?.players || [];
  const players2 = team2?.players || [];

const [completedSpins, setCompletedSpins] = useState(() => {
  return Number(
    localStorage.getItem(`spinner-${game.id}`) || 0
  );
});
  const [spinNonce, setSpinNonce] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedSpinIndex, setDisplayedSpinIndex] = useState(-1);
  const timers = useRef([]);

  const currentResult = spins[displayedSpinIndex];
  const target1 = players1.indexOf(currentResult?.predetermined_player1);
  const target2 = players2.indexOf(currentResult?.predetermined_player2);
  const target3 = miniGames.indexOf(currentResult?.predetermined_minigame);
  const safeTarget1 = target1 >= 0 ? target1 : 0;
  const safeTarget2 = target2 >= 0 ? target2 : 0;
  const safeTarget3 = target3 >= 0 ? target3 : 0;

  const allDone = completedSpins >= spins.length;

  const clearTimers = () => { timers.current.forEach(t => clearTimeout(t)); timers.current = []; };

  const handleSpin = () => {
    if (isSpinning || allDone) return;
    setDisplayedSpinIndex(completedSpins);
    setSpinNonce(n => n + 1);
    setIsSpinning(true);
    clearTimers();

    timers.current.push(setTimeout(() => {
      setIsSpinning(false);
setCompletedSpins(prev => {
  const next = prev + 1;

  localStorage.setItem(
    `spinner-${game.id}`,
    next
  );

  return next;
});

    }, SPIN_DURATION_3 + 300));
  };

const handleReset = () => {
  clearTimers();

  localStorage.removeItem(`spinner-${game.id}`);

  setCompletedSpins(0);
  setSpinNonce(0);
  setIsSpinning(false);
  setDisplayedSpinIndex(-1);
};

  const missingConfig =
    !config.team1_id || !config.team2_id ||
    players1.length === 0 || players2.length === 0 ||
    miniGames.length === 0 || spins.length === 0;

  if (missingConfig) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Shuffle className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>Spinner not configured yet.</p>
        <p className="text-xs mt-1">Set up team players, mini-game options, and spin results in the admin dashboard.</p>
      </div>
    );
  }

  const lastResult = completedSpins > 0 ? spins[completedSpins - 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shuffle className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold text-lg">Player Selector</h3>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">
          {Math.min(completedSpins, spins.length)} / {spins.length}
        </span>
      </div>

      {/* Triangle layout */}
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex justify-center gap-6 md:gap-24 w-full">
          <SlotReel
            items={players1}
            targetIndex={safeTarget1}
            spinNonce={spinNonce}
            spinDuration={SPIN_DURATION_1}
            label={team1?.name || "Team 1"}
          />
          <div className="flex items-center self-center mt-6">
            <span className="text-xl font-bold text-muted-foreground">vs</span>
          </div>
          <SlotReel
            items={players2}
            targetIndex={safeTarget2}
            spinNonce={spinNonce}
            spinDuration={SPIN_DURATION_2}
            label={team2?.name || "Team 2"}
          />
        </div>
        <div className="flex justify-center">
          <SlotReel
            items={miniGames}
            targetIndex={safeTarget3}
            spinNonce={spinNonce}
            spinDuration={SPIN_DURATION_3}
            label="Mini-Game"
            wide
          />
        </div>
      </div>





      {/* Controls */}
      <div className="flex gap-3">
	{admin && (
        <Button
          onClick={handleSpin}
          disabled={isSpinning || allDone}
          className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Shuffle className="w-4 h-4" />
          {isSpinning ? "Spinning…" : allDone ? "All Spins Complete" : completedSpins === 0 ? "Spin!" : `Spin (${completedSpins + 1}/${spins.length})`}
        </Button>
	)}
	{admin && completedSpins > 0 && !isSpinning && (
  <Button variant="outline" onClick={handleReset} className="gap-2">
    <RotateCcw className="w-4 h-4" />
    Reset
  </Button>
)}
      </div>
    </div>
  );
}