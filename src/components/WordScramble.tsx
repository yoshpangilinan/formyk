import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

interface Props {
  onNext: () => void;
}

const WORDS = [
  { word: "NUNUN",           clue: "your lovely baby" },
  { word: "GYUNINI",         clue: "the tiny puppy who follows you everywhere" },
  { word: "FRIEDCHEESE",     clue: "the snack you can never say no to" },
  { word: "MYKRISTINA",      clue: "what this whole website is called" },
  { word: "KRISTINA",        clue: "hmm. who could this be?" },
  { word: "BABYBEE",         clue: "the nickname i accidentally called you once" },
  { word: "THEBIGBANGTHEORY", clue: "the show you introduced me to that i ended up loving" },
  { word: "FOREVER",         clue: "how long i'm keeping you" },
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

// not case sensitive, not space sensitive
const normalize = (s: string) => s.replace(/\s+/g, "").toUpperCase();

const PASSCODE = "0613";
const SURPRISE_URL = "https://www.youtube.com";

const WordScramble = ({ onNext }: Props) => {
  const [idx, setIdx]           = useState(0);
  const [scrambled, setScrambled] = useState(() => scramble(WORDS[0].word));
  const [input, setInput]       = useState("");
  const [status, setStatus]     = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore]       = useState(0);
  const [phase, setPhase]       = useState<"playing" | "locked" | "unlocked">("playing");
  const [code, setCode]         = useState("");
  const [wrongCode, setWrongCode] = useState(0);

  const current = WORDS[idx];

  useEffect(() => {
    setScrambled(scramble(current.word));
    setInput("");
    setStatus("idle");
  }, [idx]);

  const handleSubmit = () => {
    if (normalize(input) === normalize(current.word)) {
      setStatus("correct");
      setScore((s) => s + 1);
      setTimeout(() => {
        if (idx === WORDS.length - 1) {
          setPhase("locked");
        } else {
          setIdx((i) => i + 1);
        }
      }, 900);
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus("idle"), 700);
    }
  };

  const submitCode = () => {
    if (code === PASSCODE) {
      setPhase("unlocked");
    } else {
      setWrongCode((w) => w + 1);
      setCode("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-6">
        {phase === "playing" && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-love-deep mb-1">
                unscramble me!
              </h2>
              <p className="text-muted-foreground text-sm">
                {idx + 1} / {WORDS.length} &nbsp;·&nbsp; {score} correct
              </p>
            </motion.div>

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
                  maxLength={current.word.length + 4}
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
                      yes!!
                    </motion.p>
                  )}
                  {status === "wrong" && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-destructive font-semibold"
                    >
                      nope, try again!
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
                  check
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* Passcode gate */}
        {phase === "locked" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-5 w-full max-w-sm"
          >
            <h3 className="text-xl font-bold text-love-deep text-center">
              enter the code
            </h3>
            <p className="text-muted-foreground text-sm text-center">
              you'll know it
            </p>

            <motion.input
              key={wrongCode}
              animate={wrongCode > 0 ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="tel"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && submitCode()}
              placeholder="••••"
              autoFocus
              className="w-40 bg-background border border-input rounded-2xl px-4 py-3 text-3xl tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {wrongCode > 0 && (
              <p className="text-love-rose text-sm">not quite — try again</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={submitCode}
              disabled={code.length < 4}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base w-full disabled:opacity-40"
            >
              unlock
            </motion.button>
          </motion.div>
        )}

        {/* Unlocked surprise */}
        {phase === "unlocked" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-5 w-full max-w-sm text-center"
          >
            <p className="text-muted-foreground text-sm">
              you got them all. one more thing for you.
            </p>
            <motion.a
              href={SURPRISE_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-love-deep text-2xl font-bold underline decoration-love-rose decoration-2 underline-offset-4"
            >
              tap this
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="mt-2 bg-muted text-foreground px-6 py-2.5 rounded-full font-semibold text-sm border border-border"
            >
              continue →
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WordScramble;
