import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

// our photo
import puzzleImg from "@/assets/us-jigsaw.png";

interface Props {
  onNext: () => void;
}

// ── HARDCODED to the real photo's exact pixel size — change these two numbers if you swap the photo ──
const IMG_W = 1280;
const IMG_H = 720;

const COLS = 4;
const ROWS = 4;
const N = COLS * ROWS; // 16 pieces

const DISPLAY_W = 320; // total puzzle width on screen
const DISPLAY_H = Math.round((DISPLAY_W * IMG_H) / IMG_W); // derived once from the hardcoded real ratio — never measured at runtime
const PIECE_W = DISPLAY_W / COLS;
const PIECE_H = DISPLAY_H / ROWS;

const PASSCODE = "0416";
const INSTAGRAM_URL = "https://www.instagram.com/yoshiandkris";

/** Shuffle array in place (Fisher-Yates) */
const shuffleArr = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type Phase = "playing" | "celebrate" | "locked" | "unlocked";

const Jigsaw = ({ onNext }: Props) => {
  const [tiles, setTiles] = useState<number[]>(() => shuffleArr([...Array(N).keys()]));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [imgLoaded, setImgLoaded] = useState(false);

  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(0);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "celebrate") {
      const t = setTimeout(() => setPhase("locked"), 1300);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "locked") codeInputRef.current?.focus();
  }, [phase]);

  const isSolved = (t: number[]) => t.every((v, i) => v === i);

  const handleTileClick = (pos: number) => {
    if (phase !== "playing") return;
    if (selected === null) {
      setSelected(pos);
    } else {
      if (selected === pos) {
        setSelected(null);
        return;
      }
      const next = [...tiles];
      [next[pos], next[selected]] = [next[selected], next[pos]];
      setTiles(next);
      setMoves((m) => m + 1);
      setSelected(null);
      if (isSolved(next)) {
        setTimeout(() => setPhase("celebrate"), 400);
      }
    }
  };

  const resetPuzzle = () => {
    setTiles(shuffleArr([...Array(N).keys()]));
    setSelected(null);
    setMoves(0);
    setPhase("playing");
    setCode("");
  };

  const submitCode = () => {
    if (code === PASSCODE) {
      setPhase("unlocked");
    } else {
      setWrong((w) => w + 1);
      setCode("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <div className="z-10 flex flex-col items-center gap-5 w-full max-w-lg">

        {phase === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-love-deep mb-1">
              put me back together
            </h2>
            <p className="text-muted-foreground text-sm">
              tap a piece, then tap where it goes · moves: {moves}
            </p>
          </motion.div>
        )}

        {/* hidden preloader just so we don't flash a broken layout before the file is cached */}
        <img
          src={puzzleImg}
          alt=""
          className="hidden"
          onLoad={() => setImgLoaded(true)}
        />

        {!imgLoaded ? (
          <p className="text-muted-foreground animate-pulse">loading...</p>
        ) : (
          <AnimatePresence mode="wait">

            {/* ── PUZZLE (playing + celebrate) ── */}
            {(phase === "playing" || phase === "celebrate") && (
              <motion.div
                key="puzzle"
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-border shrink-0"
                  style={{ width: DISPLAY_W, height: DISPLAY_H }}
                >
                  {tiles.map((pieceIdx, pos) => {
                    const srcCol = pieceIdx % COLS;
                    const srcRow = Math.floor(pieceIdx / COLS);
                    const isCorrect = pieceIdx === pos;
                    const isSel = selected === pos;

                    return (
                      <motion.div
                        key={pos}
                        layout
                        onClick={() => handleTileClick(pos)}
                        whileHover={{ scale: phase === "playing" ? 1.04 : 1, zIndex: 10 }}
                        whileTap={{ scale: 0.96 }}
                        className={`absolute cursor-pointer transition-all ${
                          isSel
                            ? "ring-4 ring-primary ring-offset-1 brightness-110 z-10"
                            : phase === "celebrate" && isCorrect
                            ? "brightness-100"
                            : ""
                        }`}
                        style={{
                          width: PIECE_W,
                          height: PIECE_H,
                          left: (pos % COLS) * PIECE_W,
                          top: Math.floor(pos / COLS) * PIECE_H,
                          backgroundImage: `url(${puzzleImg})`,
                          backgroundSize: `${DISPLAY_W}px ${DISPLAY_H}px`,
                          backgroundPosition: `-${srcCol * PIECE_W}px -${srcRow * PIECE_H}px`,
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                      </motion.div>
                    );
                  })}

                  <AnimatePresence>
                    {phase === "celebrate" && (
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

                {phase === "playing" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                      reference
                    </div>
                    <div
                      className="rounded-xl shadow-md border border-border opacity-80"
                      style={{
                        width: 110,
                        height: Math.round((110 * IMG_H) / IMG_W),
                        backgroundImage: `url(${puzzleImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <button
                      onClick={resetPuzzle}
                      className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-full px-4 py-1.5 transition-colors"
                    >
                      shuffle
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── LOCK SCREEN ── */}
            {phase === "locked" && (
              <motion.div
                key="lock"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-5 w-full max-w-sm"
              >
                <div className="text-5xl">🔒</div>
                <h3 className="text-xl font-bold text-love-deep text-center">
                  enter the code
                </h3>
                <p className="text-muted-foreground text-sm text-center">
                  you'll know it
                </p>

                <motion.input
                  ref={codeInputRef}
                  key={wrong}
                  animate={wrong > 0 ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && submitCode()}
                  placeholder="••••"
                  className="w-40 bg-background border border-input rounded-2xl px-4 py-3 text-3xl tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {wrong > 0 && (
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

            {/* ── UNLOCKED ── */}
            {phase === "unlocked" && (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-5 w-full max-w-sm text-center"
              >
                <div className="text-4xl">💌</div>
                <p className="text-muted-foreground text-sm">
                  happy monthsary. i made you something.
                </p>
                <motion.a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-love-deep text-2xl font-bold underline decoration-love-rose decoration-2 underline-offset-4"
                >
                  i love you
                </motion.a>
                <p className="text-muted-foreground text-xs">
                  tap it
                </p>

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
          </AnimatePresence>
        )}

        <AnimatePresence>
          {phase === "celebrate" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-love-deep font-bold text-xl">
                you did it in {moves} moves
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Jigsaw;
