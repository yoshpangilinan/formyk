import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

interface Props {
  onNext: () => void;
}

// ✏️ TODO: replace these with your actual reasons / messages for her
const LETTERS = [
  {
    from:    "reason #1",
    message: "// TODO: write something sweet here — a reason you love her, a memory, anything 💕",
  },
  {
    from:    "reason #2",
    message: "// TODO: maybe something funny that only you two would get 😄",
  },
  {
    from:    "reason #3",
    message: "// TODO: a moment you want her to remember 🌸",
  },
  {
    from:    "reason #4",
    message: "// TODO: something about the way she makes you feel",
  },
  {
    from:    "reason #5",
    message: "// TODO: a promise or something you're looking forward to 🌻",
  },
  {
    from:    "reason #6",
    message: "// TODO: an inside joke or a nickname",
  },
  {
    from:    "reason #7",
    message: "// TODO: something about her laugh, her voice, or how she looks when she's sleepy",
  },
  {
    from:    "reason #8",
    message: "// TODO: the most important reason of all 💌",
  },
];

const ENVELOPE_COLORS = [
  "from-pink-200 to-rose-200",
  "from-purple-200 to-pink-200",
  "from-rose-200 to-orange-200",
  "from-fuchsia-200 to-rose-200",
  "from-pink-300 to-purple-200",
  "from-orange-200 to-pink-200",
  "from-rose-300 to-pink-200",
  "from-purple-300 to-fuchsia-200",
];

const SealedLetters = ({ onNext }: Props) => {
  const [opened, setOpened]   = useState<Set<number>>(new Set());
  const [reading, setReading] = useState<number | null>(null);

  const openLetter = (i: number) => {
    setOpened((prev) => new Set([...prev, i]));
    setReading(i);
  };

  const allOpened = opened.size === LETTERS.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <div className="z-10 w-full max-w-lg flex flex-col items-center gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-love-deep mb-1">
            letters for you 💌
          </h2>
          <p className="text-muted-foreground text-sm">
            {opened.size} / {LETTERS.length} opened
          </p>
        </motion.div>

        {/* Envelope grid */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {LETTERS.map((_, i) => {
            const isOpen = opened.has(i);
            const color  = ENVELOPE_COLORS[i % ENVELOPE_COLORS.length];
            return (
              <motion.button
                key={i}
                whileHover={{ scale: isOpen ? 1 : 1.08, y: isOpen ? 0 : -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openLetter(i)}
                className={`aspect-[3/2] rounded-2xl bg-gradient-to-br ${color} shadow-md border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                  isOpen ? "opacity-70 border-love-rose/60" : "border-transparent cursor-pointer"
                }`}
              >
                {/* Envelope flap line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-white/40"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "rgba(255,255,255,0.25)",
                  }}
                />

                <span className="text-2xl relative z-10">
                  {isOpen ? "💌" : "✉️"}
                </span>

                {isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs text-white font-bold"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Next button */}
        <AnimatePresence>
          {allOpened && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base"
            >
              next →
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Letter reading modal */}
      <AnimatePresence>
        {reading !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setReading(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-8 shadow-2xl border border-border max-w-sm w-full flex flex-col items-center gap-4"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <div className="text-4xl">💌</div>
              <h3 className="text-lg font-bold text-love-deep">
                {LETTERS[reading].from}
              </h3>
              <p className="text-foreground text-base leading-relaxed text-center italic">
                {LETTERS[reading].message}
              </p>
              <button
                onClick={() => setReading(null)}
                className="mt-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SealedLetters;
