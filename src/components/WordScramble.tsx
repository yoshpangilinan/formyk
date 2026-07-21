import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

interface Props {
  onNext: () => void;
}

// ✏️ TODO: replace these with your own inside jokes, nicknames, memories, etc.
const WORDS = [
  { word: "RININI",    clue: "your favourite little character 🌸"         },
  { word: "GYUNINI",   clue: "the tiny cow who follows you everywhere 🐮"  },
  { word: "SLOVAKIA",  clue: "the country of the prettiest girl i know 🇸🇰" },
  { word: "FORMYBABY", clue: "what this whole website is called 💕"         },
  { word: "KRISTINA",  clue: "hmm. who could this be? 🤔"                  },
  { word: "MUSHROOM",  clue: "// TODO: add an inside joke here 🍄"          },
  { word: "SUNSHINE",  clue: "// TODO: a nickname or memory"                },
  { word: "FOREVER",   clue: "how long i'm keeping you 🫶"                  },
];

const scramble = (word: string): string => {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // avoid accidentally landing on the correct word
  return arr.join("") === word ? scramble(word) : arr.join("");
};

const WordScramble = ({ onNext }: Props) => {
  const [idx, setIdx]           = useState(0);
  const [scrambled, setScrambled] = useState(() => scramble(WORDS[0].word));
  const [input, setInput]       = useState("");
  const [status, setStatus]     = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore]       = useState(0);

  const current = WORDS[idx];

  useEffect(() => {
    setScrambled(scramble(current.word));
    setInput("");
    setStatus("idle");
  }, [idx]);

  const handleSubmit = () => {
    if (input.trim().toUpperCase() === current.word) {
      setStatus("correct");
      setScore((s) => s + 1);
      setTimeout(() => {
        if (idx === WORDS.length - 1) {
          onNext();
        } else {
          setIdx((i) => i + 1);
        }
      }, 900);
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus("idle"), 700);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md flex flex-col items-center gap-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-love-deep mb-1">
            unscramble me! 🔤
          </h2>
          <p className="text-muted-foreground text-sm">
            {idx + 1} / {WORDS.length} &nbsp;·&nbsp; {score} correct
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full bg-card rounded-3xl p-8 shadow-2xl border border-border flex flex-col items-center gap-6"
          >
            {/* Clue */}
            <p className="text-base text-muted-foreground text-center italic">
              {current.clue}
            </p>

            {/* Scrambled letters */}
            <div className="flex flex-wrap justify-center gap-2">
              {scrambled.split("").map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="w-10 h-10 rounded-xl bg-love-blush/30 border-2 border-love-rose/40 flex items-center justify-center text-xl font-bold text-love-deep select-none"
                >
                  {letter}
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="type your answer..."
              maxLength={current.word.length + 2}
              className={`w-full text-center text-xl font-bold tracking-widest bg-background border-2 rounded-2xl px-4 py-3 focus:outline-none transition-colors ${
                status === "correct"
                  ? "border-green-400 text-green-600"
                  : status === "wrong"
                  ? "border-destructive text-destructive"
                  : "border-input focus:border-primary text-foreground"
              }`}
              autoFocus
            />

            {/* Feedback */}
            <AnimatePresence>
              {status === "correct" && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-green-500 font-semibold text-lg"
                >
                  ✓ yes!! 🎉
                </motion.p>
              )}
              {status === "wrong" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-destructive font-semibold"
                >
                  nope, try again! 🙈
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={status === "correct"}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base disabled:opacity-50"
            >
              check ✓
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WordScramble;
