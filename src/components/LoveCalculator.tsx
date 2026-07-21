import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

interface Props {
  onNext: () => void;
}

// ✏️ TODO: customise these reasons — they show one at random after calculating
const REASONS = [
  "because she laughs at everything even when it's not funny 💀",
  "because she sends voice messages that are somehow 3 minutes long",
  "because she's the prettiest girl in the whole country 🇸🇰",
  "because gyunini approves and gyunini is never wrong 🐮",
  "because she makes everything better just by existing",
  "because she's my rinini 🌸",
  // ✏️ add more here
];

const LoveCalculator = ({ onNext }: Props) => {
  const [name1, setName1]   = useState("");
  const [name2, setName2]   = useState("");
  const [phase, setPhase]   = useState<"input" | "loading" | "result">("input");
  const [reason, setReason] = useState("");
  const [step, setStep]     = useState(0);

  const LOADING_STEPS = [
    "analysing compatibility... 🔬",
    "checking heart rates... 💓",
    "consulting gyunini... 🐮",
    "running calculations... 🧮",
    "final check... ✨",
    "result ready! 💕",
  ];

  const calculate = () => {
    if (!name1.trim() || !name2.trim()) return;
    setPhase("loading");
    setStep(0);

    let i = 0;
    const tick = () => {
      i++;
      setStep(i);
      if (i < LOADING_STEPS.length - 1) {
        setTimeout(tick, 500 + Math.random() * 300);
      } else {
        const r = REASONS[Math.floor(Math.random() * REASONS.length)];
        setReason(r);
        setTimeout(() => setPhase("result"), 600);
      }
    };
    setTimeout(tick, 400);
  };

  const reset = () => {
    setPhase("input");
    setName1("");
    setName2("");
    setStep(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <AnimatePresence mode="wait">

        {/* ── INPUT ── */}
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10 bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-6 w-full max-w-sm"
          >
            <div className="text-5xl">💘</div>
            <h2 className="text-3xl font-bold text-love-deep text-center">
              love calculator
            </h2>
            <p className="text-muted-foreground text-sm text-center">
              enter two names and find out your score
            </p>

            <div className="w-full flex flex-col gap-3">
              <input
                type="text"
                placeholder="your name..."
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="w-full bg-background border border-input rounded-2xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary text-center font-medium"
              />
              <div className="text-center text-love-rose text-xl font-bold">+</div>
              <input
                type="text"
                placeholder="their name..."
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
                className="w-full bg-background border border-input rounded-2xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary text-center font-medium"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={calculate}
              disabled={!name1.trim() || !name2.trim()}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base w-full disabled:opacity-40"
            >
              calculate 💕
            </motion.button>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-5 w-full max-w-sm"
          >
            <div className="text-5xl animate-spin">💫</div>
            <h3 className="text-xl font-bold text-love-deep text-center">
              calculating...
            </h3>
            <div className="w-full space-y-2">
              {LOADING_STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
                  className={`text-sm flex items-center gap-2 ${
                    i <= step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span>{i < step ? "✓" : i === step ? "→" : "○"}</span>
                  {s}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="z-10 bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-5 w-full max-w-sm text-center"
          >
            <div className="text-5xl">💯</div>
            <h3 className="text-lg text-muted-foreground font-medium">
              {name1} + {name2}
            </h3>

            {/* Big score */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="relative"
            >
              <span className="text-8xl font-black text-love-rose">100</span>
              <span className="text-4xl font-black text-love-deep">%</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-sm italic"
            >
              {reason}
            </motion.p>

            <div className="flex gap-3 w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={reset}
                className="flex-1 bg-muted text-foreground px-4 py-2.5 rounded-full font-semibold text-sm border border-border"
              >
                try again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-semibold text-sm shadow"
              >
                next →
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default LoveCalculator;
