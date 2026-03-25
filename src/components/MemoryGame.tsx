import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FallingCharacters from "./FallingCharacters";
import flip1 from "@/assets/fliprinini-1.png";
import flip2 from "@/assets/fliprinini-2.png";
import flip3 from "@/assets/fliprinini-3.png";
import flip4 from "@/assets/fliprinini-4.png";
import flip5 from "@/assets/fliprinini-5.png";
import flip6 from "@/assets/fliprinini-6.jpg";
import flip7 from "@/assets/fliprinini-7.jpg";
import flip8 from "@/assets/fliprinini-8.jpg";

interface Props {
  onNext: () => void;
}

const IMAGES = [flip1, flip2, flip3, flip4, flip5, flip6, flip7, flip8];

const generateCards = () => {
  const pairs = [...IMAGES, ...IMAGES];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((image, i) => ({ id: i, image, flipped: false, matched: false }));
};

const MemoryGame = ({ onNext }: Props) => {
  const [cards, setCards] = useState(generateCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [checking, setChecking] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const preloaded = useRef(false);

  useEffect(() => {
    if (preloaded.current) return;
    preloaded.current = true;
    let loaded = 0;
    IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === IMAGES.length) setImagesReady(true);
      };
      img.src = src;
    });
  }, []);

  const handleFlip = (id: number) => {
    if (!imagesReady || checking) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;
    if (selected.length >= 2) return;

    const newCards = cards.map((c) =>
      c.id === id ? { ...c, flipped: true } : c
    );
    setCards(newCards);
    setSelected((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (selected.length === 2) {
      setChecking(true);
      const [a, b] = selected;
      if (cards[a].image === cards[b].image) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, matched: true } : c
            )
          );
          setMatchedCount((prev) => prev + 1);
          setSelected([]);
          setChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setChecking(false);
        }, 800);
      }
    }
  }, [selected, cards]);

  useEffect(() => {
    if (matchedCount === 8) {
      setTimeout(onNext, 1000);
    }
  }, [matchedCount, onNext]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative">
      <FallingCharacters variant="rinini" />

      <div className="z-10 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-love-deep mb-2"
        >
          it's your daughter! find them all for me. 
        </motion.h2>

        {!imagesReady ? (
          <p className="text-muted-foreground my-8 animate-pulse">Loading...</p>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              {matchedCount}/8 matched
            </p>
            <div className="grid grid-cols-4 gap-3 max-w-sm w-full">
              {cards.map((card) => (
                <motion.button
                  key={card.id}
                  whileHover={{
                    scale: card.flipped || card.matched ? 1 : 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFlip(card.id)}
                  className={`aspect-square rounded-xl flex items-center justify-center shadow-md transition-colors duration-300 overflow-hidden ${
                    card.matched
                      ? "bg-love-rose/30 border-2 border-love-rose"
                      : card.flipped
                      ? "bg-card border-2 border-primary"
                      : "bg-primary cursor-pointer hover:bg-love-deep"
                  }`}
                >
                  {card.flipped || card.matched ? (
                    <img
                      src={card.image}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-primary-foreground text-2xl font-bold">
                      ?
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
