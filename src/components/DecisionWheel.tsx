import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

interface Props {
  onBack: () => void;
}

type ViewId =
  | "category"
  | "eat"
  | "eatCook"
  | "eatBuy"
  | "do"
  | "watch"
  | "watchMovie"
  | "watchKdrama"
  | "random";

type WheelAction =
  | { type: "push"; target: ViewId }
  | { type: "leaf"; message: string };

interface WheelOption {
  label: string;
  action: WheelAction;
}

const TITLES: Record<ViewId, string> = {
  category: "whenever we can't decide",
  eat: "what to eat",
  eatCook: "cooking it is",
  eatBuy: "buying it is",
  do: "what to do",
  watch: "what to watch",
  watchMovie: "movie night",
  watchKdrama: "kdrama pick",
  random: "ask yoshi",
};

const WHEEL_CONFIG: Partial<Record<ViewId, WheelOption[]>> = {
  category: [
    { label: "what to eat", action: { type: "push", target: "eat" } },
    { label: "what to do", action: { type: "push", target: "do" } },
    { label: "what to watch", action: { type: "push", target: "watch" } },
    { label: "ask my yoshi", action: { type: "push", target: "random" } },
  ],
  eat: [
    { label: "you should cook!", action: { type: "push", target: "eatCook" } },
    { label: "you should just buy it!", action: { type: "push", target: "eatBuy" } },
    {
      label: "order delivery instead!",
      action: { type: "leaf", message: "let delivery come to you tonight — no dishes, no effort." },
    },
  ],
  eatCook: [
    {
      label: "something under 10 minutes",
      action: { type: "leaf", message: "keep it under 10 minutes — eggs, instant ramen with extra toppings, or a quick stir fry all work." },
    },
    {
      label: "something from the fridge",
      action: { type: "leaf", message: "use up whatever's already in the fridge before it goes bad. bonus points for creativity." },
    },
    {
      label: "something simple with rice",
      action: { type: "leaf", message: "rice plus whatever protein or veggies you already have. simple, cheap, always good." },
    },
  ],
  eatBuy: [
    {
      label: "you've both had a long day",
      action: { type: "leaf", message: "you've both had a long day. let something else handle dinner tonight." },
    },
    {
      label: "cooking isn't relaxing right now",
      action: { type: "leaf", message: "cooking after a long day isn't relaxing, it's just another task. skip it tonight." },
    },
    {
      label: "it's not lazy, it's efficient",
      action: { type: "leaf", message: "buying dinner isn't lazy, it's efficient. save the energy for each other instead." },
    },
    {
      label: "the kitchen can wait",
      action: { type: "leaf", message: "the kitchen can wait until tomorrow. tonight, just eat." },
    },
  ],
  do: [
    { label: "just eat", action: { type: "push", target: "eat" } },
    { label: "watch something", action: { type: "push", target: "watch" } },
    {
      label: "call and just talk",
      action: { type: "leaf", message: "put everything down and just call each other. that's enough for tonight." },
    },
  ],
  watch: [
    { label: "a random kdrama episode", action: { type: "push", target: "watchKdrama" } },
    { label: "a random movie", action: { type: "push", target: "watchMovie" } },
    {
      label: "a random tbbt episode",
      action: { type: "leaf", message: "pick any random big bang theory episode and rewatch it together." },
    },
  ],
  watchMovie: [
    { label: "something funny", action: { type: "leaf", message: "maybe you two should watch something funny tonight." } },
    { label: "something thrilling", action: { type: "leaf", message: "maybe you two should watch something thrilling tonight." } },
    { label: "something romantic", action: { type: "leaf", message: "maybe you two should watch something romantic tonight." } },
  ],
  watchKdrama: [
    {
      label: "something kristína wants to try",
      action: { type: "leaf", message: "let kristína pick something she's been wanting to try." },
    },
    {
      label: "something yoshi wants to try",
      action: { type: "leaf", message: "let yoshi pick something he's been wanting to try." },
    },
    {
      label: "something you both talked about once",
      action: { type: "leaf", message: "watch that one you both talked about trying once but never got around to." },
    },
  ],
};

const WHEEL_COLORS = [
  "#fbcfe8", "#e9d5ff", "#fecdd3", "#fed7aa",
  "#f5d0fe", "#fda4af", "#f9a8d4", "#fdba74",
];

const WHEEL_SIZE = 260;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const LABEL_RADIUS = WHEEL_SIZE * 0.33;

interface WheelProps {
  options: string[];
  onResult: (index: number) => void;
}

const Wheel = ({ options, onResult }: WheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const n = options.length;
  const sliceAngle = 360 / n;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const landIndex = Math.floor(Math.random() * n);
    const sliceCenter = sliceAngle * landIndex + sliceAngle / 2;
    const currentMod = ((rotation % 360) + 360) % 360;
    const desiredMod = (360 - sliceCenter) % 360;
    let delta = desiredMod - currentMod;
    if (delta <= 0) delta += 360;
    const nextRotation = rotation + delta + 5 * 360;
    setRotation(nextRotation);
    setTimeout(() => {
      setSpinning(false);
      onResult(landIndex);
    }, 3200);
  };

  const gradient = options
    .map((_, i) => {
      const color = WHEEL_COLORS[i % WHEEL_COLORS.length];
      const start = (i * sliceAngle).toFixed(2);
      const end = ((i + 1) * sliceAngle).toFixed(2);
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
        {/* Pointer */}
        <div
          className="absolute left-1/2 -top-2 -translate-x-1/2 z-20 w-0 h-0
            border-l-[12px] border-l-transparent
            border-r-[12px] border-r-transparent
            border-t-[20px]"
          style={{ borderTopColor: "hsl(var(--love-deep))" }}
        />

        <motion.div
          className="absolute inset-0 rounded-full border-4"
          style={{ background: `conic-gradient(${gradient})`, borderColor: "hsl(var(--love-deep))" }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3.2, ease: [0.15, 0.85, 0.35, 1] }}
        >
          {options.map((label, i) => {
            const mid = sliceAngle * i + sliceAngle / 2;
            const rad = ((mid - 90) * Math.PI) / 180;
            const x = WHEEL_CENTER + LABEL_RADIUS * Math.cos(rad);
            const y = WHEEL_CENTER + LABEL_RADIUS * Math.sin(rad);
            return (
              <div
                key={i}
                className="absolute text-[10px] md:text-xs font-semibold text-love-deep text-center leading-tight px-1 select-none"
                style={{ left: x, top: y, width: 84, transform: "translate(-50%, -50%)" }}
              >
                {label}
              </div>
            );
          })}
        </motion.div>

        <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-card border-2 z-10" style={{ borderColor: "hsl(var(--love-deep))" }} />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={spin}
        disabled={spinning}
        className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base disabled:opacity-50"
      >
        {spinning ? "spinning..." : "spin"}
      </motion.button>
    </div>
  );
};

const POSITIVE_ANSWERS = [
  "yes, definitely.",
  "it's a yes from me.",
  "no doubt about it.",
  "the signs are all pointing yes.",
  "you can count on it.",
  "as far as i can tell, yes.",
  "very likely.",
  "things are looking good.",
  "yes.",
  "everything says yes.",
  "absolutely.",
  "without question, yes.",
  "all signals say go.",
  "you can bet on this one.",
  "it's looking bright.",
  "the answer is a clear yes.",
  "everything points to yes.",
  "you can rely on this.",
  "very promising.",
  "yes, and i mean it.",
  "trust it, the answer's yes.",
  "it checks out.",
  "the odds are in your favor.",
  "confidently, yes.",
  "this one's a yes.",
  "go for it.",
  "yes, no hesitation.",
  "it's a solid yes.",
  "the outlook is great.",
  "yes, obviously.",
];

const NEUTRAL_ANSWERS = [
  "hard to say right now.",
  "ask again in a bit.",
  "too early to tell.",
  "not clear yet.",
  "give it some time.",
  "i can't say for sure.",
  "the answer isn't clear yet.",
  "check back later.",
  "still figuring that out.",
  "ask me again soon.",
  "undecided for now.",
  "the answer's still forming.",
  "come back to this one.",
  "no clear answer yet.",
  "let's revisit this later.",
];

const NEGATIVE_ANSWERS = [
  "probably not.",
  "doesn't look likely.",
  "i wouldn't count on it.",
  "the answer is no.",
  "highly doubtful.",
  "not looking good.",
  "chances are slim.",
  "i'd say no.",
  "not this time.",
  "the odds aren't in your favor.",
  "unlikely.",
  "don't get your hopes up.",
  "that's a no.",
  "not really, no.",
  "the answer leans no.",
];

const ALL_ANSWERS = [...POSITIVE_ANSWERS, ...NEUTRAL_ANSWERS, ...NEGATIVE_ANSWERS];

// rigged: anything asking whether someone loves someone gets an affirmative answer
const isLoveQuestion = (q: string) => {
  const lower = q.toLowerCase();
  const hasLove = lower.includes("love");
  const hasDo = /\b(do|does|did|don't|doesn't|didn't)\b/.test(lower);
  return hasLove && hasDo;
};

const AskYoshiBall = () => {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<"idle" | "thinking" | "answered">("idle");
  const [answer, setAnswer] = useState("");

  const reveal = () => {
    setPhase("thinking");
    setTimeout(() => {
      const pool = isLoveQuestion(question) ? POSITIVE_ANSWERS : ALL_ANSWERS;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setAnswer(pick);
      setPhase("answered");
    }, 1800);
  };

  const ask = () => {
    if (!question.trim() || phase === "thinking") return;
    reveal();
  };

  const shakeAgain = () => {
    if (phase === "thinking") return;
    reveal();
  };

  const askNew = () => {
    setQuestion("");
    setAnswer("");
    setPhase("idle");
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <motion.div
        animate={
          phase === "thinking"
            ? {
                rotate: [0, -18, 16, -20, 18, -14, 14, -8, 8, 0],
                x: [0, -8, 8, -10, 10, -6, 6, -3, 3, 0],
                y: [0, 5, -5, 6, -6, 4, -4, 2, -2, 0],
              }
            : { rotate: 0, x: 0, y: 0 }
        }
        transition={
          phase === "thinking"
            ? { duration: 1.8, ease: "easeInOut" }
            : { duration: 0.3 }
        }
        className="w-56 h-56 rounded-full bg-gradient-to-br from-love-deep to-black shadow-2xl flex items-center justify-center relative"
      >
        <AnimatePresence mode="wait">
          {phase !== "answered" ? (
            <motion.span
              key="letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white text-7xl font-bold select-none"
            >
              Y
            </motion.span>
          ) : (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-36 h-36 rounded-full bg-black/70 border-2 border-white/20 flex items-center justify-center p-4"
            >
              <p className="text-white text-sm font-semibold text-center leading-snug">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {phase !== "answered" ? (
        <div className="w-full flex flex-col items-center gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="type your question..."
            disabled={phase === "thinking"}
            className="w-full bg-background border-2 border-input rounded-2xl px-4 py-3 text-center focus:outline-none focus:border-primary text-foreground disabled:opacity-60"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={ask}
            disabled={!question.trim() || phase === "thinking"}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base disabled:opacity-50"
          >
            {phase === "thinking" ? "thinking..." : "ask"}
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shakeAgain}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold shadow-lg text-sm"
          >
            shake again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={askNew}
            className="bg-muted text-foreground px-6 py-2.5 rounded-full font-semibold text-sm border border-border"
          >
            ask something else
          </motion.button>
        </div>
      )}
    </div>
  );
};

const DecisionWheel = ({ onBack }: Props) => {
  const [view, setView] = useState<ViewId>("category");
  const [stack, setStack] = useState<ViewId[]>([]);
  const [landed, setLanded] = useState<WheelOption | null>(null);

  useEffect(() => {
    setLanded(null);
  }, [view]);

  const push = (next: ViewId) => {
    setStack((s) => [...s, view]);
    setView(next);
  };

  const goBack = () => {
    setStack((s) => {
      if (s.length === 0) return s;
      const copy = [...s];
      const prev = copy.pop()!;
      setView(prev);
      return copy;
    });
  };

  const goHome = () => {
    setStack([]);
    setView("category");
  };

  const options = WHEEL_CONFIG[view];

  const handleResult = (index: number) => {
    if (!options) return;
    setLanded(options[index]);
  };

  const proceed = () => {
    if (landed?.action.type === "push") push(landed.action.target);
    setLanded(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <div className="z-10 w-full max-w-sm flex flex-col items-center gap-6">
        <div className="w-full flex items-center justify-between">
          {stack.length > 0 ? (
            <button
              onClick={goBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← back
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            close
          </button>
        </div>

        <motion.h2
          key={view}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-love-deep text-center"
        >
          {TITLES[view]}
        </motion.h2>

        <AnimatePresence mode="wait">
          {view === "random" ? (
            <motion.div
              key="random"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <AskYoshiBall />
            </motion.div>
          ) : view === "category" ? (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-3"
            >
              {WHEEL_CONFIG.category!.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => opt.action.type === "push" && push(opt.action.target)}
                  className="bg-card border border-border rounded-full px-6 py-4 font-semibold text-love-deep shadow hover:shadow-md transition-shadow text-base"
                >
                  {opt.label}
                </motion.button>
              ))}
            </motion.div>
          ) : landed ? (
            <motion.div
              key="landed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-3xl p-8 shadow-2xl border border-border flex flex-col items-center gap-5 w-full text-center"
            >
              <p className="text-lg font-semibold text-love-deep">{landed.label}</p>
              {landed.action.type === "leaf" && (
                <p className="text-muted-foreground text-sm">{landed.action.message}</p>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                {landed.action.type === "push" ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={proceed}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base"
                  >
                    continue
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLanded(null)}
                      className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold shadow-lg text-sm"
                    >
                      spin again
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goHome}
                      className="bg-muted text-foreground px-6 py-2.5 rounded-full font-semibold text-sm border border-border"
                    >
                      start over
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          ) : options ? (
            <motion.div
              key={`wheel-${view}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Wheel options={options.map((o) => o.label)} onResult={handleResult} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DecisionWheel;
