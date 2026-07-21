import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

// ✏️ TODO: swap this import for a real photo of you two once you have one
import puzzleImg from "@/assets/fliprinini-1.png";

interface Props {
  onNext: () => void;
}

const COLS    = 4;
const ROWS    = 4;
const N       = COLS * ROWS; // 16 pieces
const PIECE_PX = 80;         // px per piece in the puzzle display

/** Shuffle array in place (Fisher-Yates) */
const shuffleArr = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Jigsaw = ({ onNext }: Props) => {
  // `tiles[i]` = which original piece is currently at position i
  const [tiles, setTiles]     = useState<number[]>(() => shuffleArr([...Array(N).keys()]));
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved]   = useState(false);
  const [moves, setMoves]     = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.src = puzzleImg;
  }, []);

  const isSolved = (t: number[]) => t.every((v, i) => v === i);

  const handleTileClick = (pos: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(pos);
    } else {
      if (selected === pos) {
        setSelected(null);
        return;
      }
      // Swap
      const next = [...tiles];
      [next[pos], next[selected]] = [next[selected], next[pos]];
      setTiles(next);
      setMoves((m) => m + 1);
      setSelected(null);
      if (isSolved(next)) {
        setTimeout(() => setSolved(true), 400);
      }
    }
  };

  const resetPuzzle = () => {
    setTiles(shuffleArr([...Array(N).keys()]));
    setSelected(null);
    setSolved(false);
    setMoves(0);
  };

  const totalW = COLS * PIECE_PX;
  const totalH = ROWS * PIECE_PX;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <div className="z-10 flex flex-col items-center gap-5 w-full max-w-lg">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-love-deep mb-1">
            put me back together 🧩
          </h2>
          <p className="text-muted-foreground text-sm">
            tap a piece, then tap where it goes · moves: {moves}
          </p>
        </motion.div>

        {!imgLoaded ? (
          <p className="text-muted-foreground animate-pulse">loading...</p>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Puzzle grid */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-border"
              style={{ width: totalW, height: totalH }}
            >
              {tiles.map((pieceIdx, pos) => {
                const srcCol  = pieceIdx % COLS;
                const srcRow  = Math.floor(pieceIdx / COLS);
                const isCorrect = pieceIdx === pos;
                const isSel     = selected === pos;

                return (
                  <motion.div
                    key={pos}
                    layout
                    onClick={() => handleTileClick(pos)}
                    whileHover={{ scale: solved ? 1 : 1.04, zIndex: 10 }}
                    whileTap={{ scale: 0.96 }}
                    className={`absolute cursor-pointer overflow-hidden transition-all ${
                      isSel
                        ? "ring-4 ring-primary ring-offset-1 brightness-110 z-10"
                        : solved && isCorrect
                        ? "brightness-100"
                        : ""
                    }`}
                    style={{
                      width:  PIECE_PX,
                      height: PIECE_PX,
                      left:   (pos % COLS) * PIECE_PX,
                      top:    Math.floor(pos / COLS) * PIECE_PX,
                    }}
                  >
                    <img
                      src={puzzleImg}
                      alt=""
                      draggable={false}
                      style={{
                        width:           totalW,
                        height:          totalH,
                        position:        "absolute",
                        top:             -(srcRow * PIECE_PX),
                        left:            -(srcCol * PIECE_PX),
                        userSelect:      "none",
                      }}
                    />
                    {/* Subtle grid line */}
                    <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                  </motion.div>
                );
              })}

              {/* Solved overlay */}
              <AnimatePresence>
                {solved && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-love-rose/20 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-5xl drop-shadow-lg">🎉</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Preview + controls */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                reference
              </div>
              <img
                src={puzzleImg}
                alt="preview"
                className="rounded-xl shadow-md border border-border opacity-80"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />

              <button
                onClick={resetPuzzle}
                className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-full px-4 py-1.5 transition-colors"
              >
                shuffle 🔀
              </button>

              <AnimatePresence>
                {solved && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold shadow-lg text-sm"
                  >
                    next →
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Solved message */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-love-deep font-bold text-xl">
                you did it in {moves} moves! 💕
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Jigsaw;
