import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

import tapBinini  from "@/assets/tap_binini.png";
import tapGunini  from "@/assets/tap_gunini.png";
import tapGyunini from "@/assets/tap_gyunini.png";
import tapHanini  from "@/assets/tap_hanini.png";
import tapRinini  from "@/assets/tap_rinini.png";
import tapTae     from "@/assets/tap_tae.png";
import tapTthew   from "@/assets/tap_tthew.png";
import tapWoong   from "@/assets/tap_woong.png";

interface Props {
  onNext: () => void;
}

const CHARACTERS = [
  { src: tapRinini,  name: "Rinini 🌸"  },
  { src: tapGyunini, name: "Gyunini 🐮" },
  { src: tapBinini,  name: "Binini 🍓"  },
  { src: tapGunini,  name: "Gunini 🌙"  },
  { src: tapHanini,  name: "Hanini 🌷"  },
  { src: tapTae,     name: "Tae 🌊"     },
  { src: tapTthew,   name: "Tthew ☀️"   },
  { src: tapWoong,   name: "Woong 🐻"   },
];

const TARGET_SCORE   = 20;   // taps needed to win
const VISIBLE_MS     = 1200; // how long each character stays
const SPAWN_INTERVAL = 900;  // ms between new spawns
const MAX_VISIBLE    = 3;    // max characters on screen at once

interface Bubble {
  id:    number;
  src:   string;
  name:  string;
  x:     number; // % from left
  y:     number; // % from top
}

const TapCharacter = ({ onNext }: Props) => {
  const [phase, setPhase]     = useState<"intro" | "playing" | "done">("intro");
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore]     = useState(0);
  const [missed, setMissed]   = useState(0);
  const [combo, setCombo]     = useState(0);
  const [flash, setFlash]     = useState<string | null>(null);

  const counterRef = useRef(0);
  const spawnRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnBubble = useCallback(() => {
    setBubbles((prev) => {
      if (prev.length >= MAX_VISIBLE) return prev;
      const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      const id   = ++counterRef.current;
      const bubble: Bubble = {
        id,
        src:  char.src,
        name: char.name,
        x:    10 + Math.random() * 72,
        y:    10 + Math.random() * 65,
      };

      // Auto-remove after VISIBLE_MS
      setTimeout(() => {
        setBubbles((b) => {
          const still = b.find((x) => x.id === id);
          if (still) setMissed((m) => m + 1);
          return b.filter((x) => x.id !== id);
        });
        setCombo(0);
      }, VISIBLE_MS);

      return [...prev, bubble];
    });
  }, []);

  const startGame = () => {
    setPhase("playing");
    setScore(0);
    setMissed(0);
    setCombo(0);
    setBubbles([]);
    spawnRef.current = setInterval(spawnBubble, SPAWN_INTERVAL);
  };

  // Stop spawning when target reached
  useEffect(() => {
    if (score >= TARGET_SCORE) {
      if (spawnRef.current) clearInterval(spawnRef.current);
      setTimeout(() => setPhase("done"), 600);
    }
  }, [score]);

  // Cleanup on unmount
  useEffect(() => () => { if (spawnRef.current) clearInterval(spawnRef.current); }, []);

  const tap = (id: number, name: string) => {
    setBubbles((b) => b.filter((x) => x.id !== id));
    setScore((s) => s + 1);
    setCombo((c) => c + 1);

    const c = combo + 1;
    if (c >= 3) {
      setFlash(`${c}x combo!! 🔥`);
      setTimeout(() => setFlash(null), 700);
    }
    _ = name; // suppress unused warning
  };
  let _ = "";

  // ── Intro ──
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative">
        <FallingCharacters variant="gyunini" />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 bg-card rounded-3xl p-10 shadow-2xl border border-border text-center max-w-sm"
        >
          <div className="text-6xl mb-4">👆</div>
          <h2 className="text-3xl font-bold text-love-deep mb-3">tap the characters!</h2>
          <p className="text-muted-foreground mb-2">
            they'll pop up all over the screen — tap them before they disappear!
          </p>
          <p className="text-sm text-love-rose font-semibold mb-6">
            goal: {TARGET_SCORE} taps 💕
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-lg"
          >
            let's go! →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Done ──
  if (phase === "done") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
        <FallingCharacters variant="rinini" />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="z-10 bg-card/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-border text-center max-w-sm"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-love-deep mb-2">you got them all!</h2>
          <p className="text-muted-foreground mb-1">score: {score} taps</p>
          <p className="text-sm text-muted-foreground mb-6">missed: {missed}</p>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-lg"
          >
            next →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Playing ──
  const pct = Math.min((score / TARGET_SCORE) * 100, 100);

  return (
    <div className="h-screen overflow-hidden bg-background relative select-none">
      <FallingCharacters variant="gyunini" />

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3 bg-card/70 backdrop-blur-sm border-b border-border">
        <div className="text-base font-bold text-love-deep">
          taps: <span className="text-xl">{score}</span>
          <span className="text-muted-foreground font-normal text-sm"> / {TARGET_SCORE}</span>
        </div>
        <div className="w-36 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          missed: {missed}
        </div>
      </div>

      {/* Characters */}
      <AnimatePresence>
        {bubbles.map((b) => (
          <motion.button
            key={b.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => tap(b.id, b.name)}
            className="absolute z-10 cursor-pointer"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            <div className="w-20 h-20 rounded-full bg-love-blush/60 border-4 border-love-rose shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
              <img src={b.src} alt={b.name} className="w-16 h-16 object-contain rounded-full" />
            </div>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Combo flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-love-rose/90 text-white rounded-2xl px-6 py-3 text-xl font-bold shadow-xl">
              {flash}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TapCharacter;
