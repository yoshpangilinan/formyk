import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

// ✏️ Change your message here — the card will auto-size to fit it
const MESSAGE = "you finally scratched it off! good girl for being so patient while i was acting like a nerd. i know you were wondering what i was doing, and honestly, this is just a random thing i put together to top that birthday cake drawing. consider it just the beginning, because i'm going to spend the rest of our time making things for you.";
// ✏️ And the text shown after scratching
const AFTER_SCRATCH_TITLE = "i love you so much, my wife.";
const AFTER_SCRATCH_SUB = "— rawr!";
const ScratchCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas size exactly to the card's rendered size
    const { width, height } = card.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#c9858f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#b0707a";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("so yeah!", canvas.width / 2, canvas.height / 2 + 6);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x * scaleX, y * scaleY, 28, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const percent = (transparent / (imageData.data.length / 4)) * 100;
    if (percent > 50) setRevealed(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative">
      {revealed && <FallingCharacters variant="rinini" />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 z-10 w-full max-w-sm"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-love-deep text-center">
          one last thing. to my pretty little princess, kristína
        </h2>

        {/* Card auto-sizes to content */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-love-rose/40 w-full">
          {/* The message — drives the card height naturally */}
          <div
            ref={cardRef}
            className="bg-card flex items-center justify-center p-8 min-h-[160px]"
          >
            <p className="text-2xl md:text-3xl font-bold text-love-deep text-center leading-relaxed">
              {MESSAGE}
            </p>
          </div>

          {/* Canvas sits on top and fills exactly the same space */}
          <canvas
            ref={canvasRef}
            onMouseDown={() => setIsScratching(true)}
            onMouseUp={() => setIsScratching(false)}
            onMouseLeave={() => setIsScratching(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsScratching(true)}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={handleTouchMove}
            className="absolute inset-0 w-full h-full cursor-pointer"
            style={{ touchAction: "none" }}
          />
        </div>

        {!revealed && (
          <p className="text-muted-foreground text-sm animate-pulse">
            use your finger or mouse to scratch
          </p>
        )}

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-love-deep">{AFTER_SCRATCH_TITLE}</p>
            <p className="text-muted-foreground mt-2">{AFTER_SCRATCH_SUB}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ScratchCard;
