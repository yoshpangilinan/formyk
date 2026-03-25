import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";
import tapRinini from "@/assets/tap_rinini.png";
import tapBinini from "@/assets/tap_binini.png";
import tapGunini from "@/assets/tap_gunini.png";
import tapGyunini from "@/assets/tap_gyunini.png";
import tapHanini from "@/assets/tap_hanini.png";
import tapTae from "@/assets/tap_tae.png";
import tapTthew from "@/assets/tap_tthew.png";
import tapWoong from "@/assets/tap_woong.png";
import tapYunini from "@/assets/tap_yunini.png";

interface Props {
  onNext: () => void;
}

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
  image: string;
}

const DECOY_IMAGES = [tapBinini, tapGunini, tapGyunini, tapHanini, tapTae, tapTthew, tapWoong, tapYunini];
const ITEM_LIFETIME_MS = 2200;

const CatchHearts = ({ onNext }: Props) => {
  const [caught, setCaught] = useState(0);
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const nextId = useRef(0);

  // Spawn items on an interval
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        // Only allow 1 Rinini on screen at a time
        const hasRinini = prev.some((i) => i.isTarget);
        // 25% chance of Rinini, but only if none currently visible
        const isTarget = !hasRinini && Math.random() < 0.25;
        const image = isTarget
          ? tapRinini
          : DECOY_IMAGES[Math.floor(Math.random() * DECOY_IMAGES.length)];

        const id = nextId.current++;
        const x = 8 + Math.random() * 78;
        const y = 8 + Math.random() * 72;

        // Keep max 7 items on screen
        const trimmed = prev.slice(-6);
        return [...trimmed, { id, x, y, isTarget, image }];
      });
    }, 900);

    return () => clearInterval(interval);
  }, []);

  // Auto-expire items after ITEM_LIFETIME_MS
  useEffect(() => {
    const expiry = setInterval(() => {
      setItems((prev) => prev.slice(1));
    }, ITEM_LIFETIME_MS);
    return () => clearInterval(expiry);
  }, []);

  useEffect(() => {
    if (caught >= 10) {
      setTimeout(onNext, 800);
    }
  }, [caught, onNext]);

  const handleClick = (item: FloatingItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (item.isTarget) {
      setCaught((prev) => prev + 1);
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 py-8 relative overflow-hidden">
      <FallingCharacters variant="gyunini" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-love-deep mb-1">
          you're not happy with me? 
        </h2>
        <p className="text-muted-foreground text-lg">
          well if that's not the case, catch the rininis and maybe i'll be convinced otherwise!
        </p>
        <div className="mt-3 flex gap-4 justify-center">
          <div className="bg-card rounded-full px-5 py-2 shadow-md">
            <span className="font-bold text-love-deep text-lg">
              {caught}/10 caught
            </span>
          </div>
          {mistakes > 0 && (
            <div className="bg-muted rounded-full px-5 py-2 shadow-md">
              <span className="font-medium text-muted-foreground text-lg">
                {mistakes} oops
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="relative flex-1 w-full max-w-lg min-h-[400px] z-10">
        <AnimatePresence>
          {items.map((item) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: [1, 1.1, 1],
                y: [0, -6, 0],
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 0.4,
                y: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
              }}
              onClick={() => handleClick(item)}
              className="absolute cursor-pointer hover:scale-125 transition-transform select-none"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <img
                src={item.image}
                alt=""
                className="w-14 h-14 object-contain pointer-events-none"
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-1 mt-4 z-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 transition-all duration-300 ${
              i < caught ? "scale-110 opacity-100" : "opacity-20 grayscale"
            }`}
          >
            <img src={tapRinini} alt="" className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatchHearts;
