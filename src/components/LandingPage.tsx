import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";
import bouquetCover from "@/assets/bouquet-cover.png";
import flowerImg from "@/assets/flower-for-the-bouquet.png";

interface Props {
  onNext: () => void;
}

interface FlowerItem {
  id: number;
  rotation: number;
  placed: boolean;
  bouquetX: number | null;
  bouquetY: number | null;
  scale: number;
}

const TOTAL_FLOWERS = 10;

const LandingPage = ({ onNext }: Props) => {
  const [flowers, setFlowers] = useState<FlowerItem[]>(() =>
    Array.from({ length: TOTAL_FLOWERS }, (_, i) => ({
      id: i,
      rotation: Math.random() * 40 - 20,
      placed: false,
      bouquetX: null,
      bouquetY: null,
      scale: 0.7 + Math.random() * 0.4,
    }))
  );

  const bouquetRef = useRef<HTMLDivElement>(null);
  // Use a ref so we always have the latest dragging id without stale closures
  const activeDragId = useRef<number | null>(null);

  const placedCount = flowers.filter((f) => f.placed).length;
  const allPlaced = placedCount >= TOTAL_FLOWERS;

  const placeFlower = (flowerId: number, clientX: number, clientY: number) => {
    if (!bouquetRef.current) return false;
    const rect = bouquetRef.current.getBoundingClientRect();
    // Generous hit area — expand by 20px on all sides
    const inBouquet =
      clientX >= rect.left - 20 &&
      clientX <= rect.right + 20 &&
      clientY >= rect.top - 20 &&
      clientY <= rect.bottom + 20;

    if (!inBouquet) return false;

    const pctX = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    const pctY = Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100));

    setFlowers((prev) =>
      prev.map((f) =>
        f.id === flowerId
          ? { ...f, placed: true, bouquetX: pctX, bouquetY: pctY }
          : f
      )
    );
    return true;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <FallingCharacters variant="rinini" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center w-full max-w-md">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-love-deep tracking-tight"
        >
          to my pretty wife, kristína
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl text-muted-foreground max-w-md"
        >
          i figured out you might be a little bored, so i made you this interactive bouquet game!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-sm text-muted-foreground"
        >
            drag the flowers into the bouquet to reveal a surprise.  ({placedCount}/{TOTAL_FLOWERS})
        </motion.p>

        {/* Bouquet drop target */}
        <motion.div
          ref={bouquetRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center"
        >
          <img
            src={bouquetCover}
            alt="Bouquet"
            className="w-full h-full object-contain drop-shadow-lg absolute inset-0 z-0"
          />

          {/* Placed flowers sit on top of bouquet cover */}
          {flowers
            .filter((f) => f.placed)
            .map((flower) => (
              <motion.img
                key={`placed-${flower.id}`}
                src={flowerImg}
                alt=""
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: flower.scale,
                  opacity: 1,
                  rotate: flower.rotation,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute w-14 h-14 md:w-16 md:h-16 object-contain pointer-events-none z-10"
                style={{
                  left: `${flower.bouquetX ?? 50}%`,
                  top: `${flower.bouquetY ?? 50}%`,
                  transform: `translate(-50%, -50%)`,
                }}
              />
            ))}
        </motion.div>

        {/* Draggable flowers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-wrap gap-3 justify-center mt-4 min-h-[120px] w-full max-w-xs"
        >
          {flowers
            .filter((f) => !f.placed)
            .map((flower) => (
              <motion.div
                key={flower.id}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                whileDrag={{ scale: 1.25, zIndex: 50, cursor: "grabbing" }}
                onDragStart={() => {
                  activeDragId.current = flower.id;
                }}
                onDragEnd={(event) => {
                  const id = activeDragId.current;
                  activeDragId.current = null;
                  if (id === null) return;

                  // Use native pointer coords for reliable hit detection
                  const e = event as PointerEvent | MouseEvent | TouchEvent;
                  let clientX: number, clientY: number;
                  if ("touches" in e && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                  } else if ("changedTouches" in e && (e as TouchEvent).changedTouches.length > 0) {
                    clientX = (e as TouchEvent).changedTouches[0].clientX;
                    clientY = (e as TouchEvent).changedTouches[0].clientY;
                  } else {
                    clientX = (e as MouseEvent).clientX;
                    clientY = (e as MouseEvent).clientY;
                  }

                  placeFlower(id, clientX, clientY);
                }}
                className="cursor-grab"
                style={{ rotate: flower.rotation }}
              >
                <img
                  src={flowerImg}
                  alt="Flower"
                  className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md pointer-events-none select-none"
                  draggable={false}
                />
              </motion.div>
            ))}
        </motion.div>

        <AnimatePresence>
          {allPlaced && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 mt-4"
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border max-w-sm">
                <p className="text-xl font-semibold text-love-deep mb-2">
                  do you recognize the flower, baby? of course you do. 
                </p>
                <p className="text-muted-foreground">
                  i have a few surprises for you — but you'll have to play a
                  little to unlock them
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow text-lg"
              >
                okay, let's go!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;
