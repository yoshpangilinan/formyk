import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";
import jarGyunini1 from "@/assets/jar_gyunini1.png";
import jarGyunini2 from "@/assets/jar_gyunini2.png";
import jarGyunini3 from "@/assets/jar_gyunini3.png";

interface Props {
  onNext: () => void;
}

const REASONS = [
  "the way you handle serious talks. you don't play games. you're so vulnerable and honest about what confuses you, and it makes me want to protect that honesty forever. you're my wifey, and i love that we can just talk.",
  "how you're my safe space. i've always had those whirlwind starts where everything was just a blur. with you, it feels like i can finally breathe. you're the only person who makes me want to slow down and do things the right  way.",
  "your curiosity about my mind. when you say you want to go inside my mind, it makes me feel so seen. it's a little scary how much i want to show you every single thought i have about my pretty princess.",
  "the way you made me yappy.  i'm usually the guy who keeps to himself, but with you, i can't stop talking. you've successfully ruined my quiet side, and honestly, i love that you're the only one who gets to hear all this.",
  "the way you annoy me. i love being playful with you. teasing you and getting under your skin is how i show you that you're my favorite toy and my favorite person all at once",
  "the way you ask if i'm okay. even when we're talking about your needs, you always check on me. you're so selfless, kristína, and it makes me want to be selfish for both of us",
  "the sense of ownership. i love calling you mine, and i just love it when you call me yours too. it's not just a word. it's the fact that i feel a responsibility to keep you safe, happy, and loved every single day. and that, you feel the same way.",
  "i know i talk about being a dummy, but you make me feel like i'm exactly who you need",
  "sometimes you say something so sweet or so possessive that my brain just stops working. i love the feeling of losing control to my wifey",
  "you're sweet, you're mine, and you're the only thing i want to taste for the rest of my life",
  "just... you being you. you're still just kristína. and that's the only reason this dummy will ever need.",
  "how you probably haven't noticed i'm still yapping. you're just sitting there reading all this, aren't you? good girl.",
  "the way you love taiki and cha. seeing you embrace my cats as your own family is one of the most comforting things i've ever experienced",
  "your effort to enter my world. the fact that you want to learn and even watch the things i like just so we can bond means everything to me",
  "the way you see us everywhere. when you send me videos and posts that remind you of us, it tells me that i am always on your mind. even when we aren't talking, you are finding pieces of me",
  "i have to mention the way you tease me, and it works every single time. like wow, you're such a menace (positive)",
  "it is rare to find someone whose mind works in such sync with mine. whether it is a small observation or a huge life goal, the fact that we relate on so many levels makes me feel like this was always meant to be",
  "beyond just relating to things, i love that there is no topic off-limits between us. i can be a total nerd, a yappy dummy, or deeply serious, and you meet me there every single time",
  "seeing the places where you grew up and where you spend your days now makes my heart melt. it's like i'm finally getting to see the backdrop of your life, from the streets you walk to the buildings you study in every day",
];

const GYUNINI_IMAGES = [jarGyunini1, jarGyunini2, jarGyunini3];

// Dynamically build rows: max 5 per row, centered pyramid-ish layout
const buildRows = (total: number): number[][] => {
  const rows: number[][] = [];
  const maxPerRow = 5;
  let i = 0;
  while (i < total) {
    const remaining = total - i;
    // Gradually grow row size up to max, then keep at max
    const rowSize = Math.min(maxPerRow, remaining);
    rows.push(Array.from({ length: rowSize }, (_, j) => i + j));
    i += rowSize;
  }
  return rows;
};

// Pre-generate stable rotation & image per slot
const SLOT_DATA = REASONS.map((_, i) => ({
  image: GYUNINI_IMAGES[i % GYUNINI_IMAGES.length],
  rotation: Math.round(Math.random() * 40 - 20),
}));

const ROWS = buildRows(REASONS.length);

const JarOfHearts = ({ onNext }: Props) => {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [currentReason, setCurrentReason] = useState<string | null>(null);

  const handleClick = (index: number) => {
    if (revealed.includes(index)) return;
    setRevealed((prev) => [...prev, index]);
    setCurrentReason(REASONS[index]);
  };

  const allRevealed = revealed.length === REASONS.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative">
      <FallingCharacters variant="gyunini" />

      <div className="z-10 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-love-deep mb-2 text-center"
        >
          well, you often ask me why i love you so much. 
          there are a bunch of reasons, but 
          here are some of the ones that come to mind right now.
        </motion.h2>
        <p className="text-muted-foreground mb-6 text-center">
          check each one — {revealed.length}/{REASONS.length}
        </p>

        <div className="relative mx-auto mb-6">
          <div className="w-40 h-5 bg-love-deep rounded-t-lg mx-auto relative z-10" />
          <div className="w-44 h-3 bg-love-deep/80 rounded-sm mx-auto relative z-10 -mt-0.5" />

          <div
            className="relative bg-love-blush/50 border-2 border-love-rose/30 backdrop-blur-sm mx-auto pt-4 pb-6 px-4"
            style={{
              width: "320px",
              clipPath:
                "polygon(8% 0%, 92% 0%, 100% 15%, 100% 85%, 92% 100%, 8% 100%, 0% 85%, 0% 15%)",
            }}
          >
            <div
              className="absolute top-0 left-3 w-4 h-full bg-white/20 rounded-full"
              style={{ filter: "blur(6px)" }}
            />

            <div className="flex flex-col items-center gap-2 py-2">
              {ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-2 justify-center">
                  {row.map((i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.2, rotate: 0 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleClick(i)}
                      className={`w-12 h-12 md:w-14 md:h-14 cursor-pointer transition-all duration-300 select-none ${
                        revealed.includes(i)
                          ? "opacity-30 grayscale"
                          : "animate-float"
                      }`}
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        rotate: revealed.includes(i) ? 0 : SLOT_DATA[i].rotation,
                      }}
                    >
                      <img
                        src={SLOT_DATA[i].image}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentReason && (
            <motion.div
              key={currentReason}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card rounded-2xl p-6 shadow-xl border border-border max-w-sm text-center"
            >
              <p className="text-foreground text-lg">{currentReason}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {allRevealed && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="mt-6 bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-lg"
          >
            one last thing
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default JarOfHearts;
