import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  onNext: () => void;
}

const TrickQuestion = ({ onNext }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [yesPos, setYesPos] = useState({ x: 0, y: 0 });
  const [escaped, setEscaped] = useState(false);

  const moveYesButton = () => {
    setEscaped(true);
    const x = (Math.random() - 0.5) * 250;
    const y = (Math.random() - 0.5) * 300;
    setYesPos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-8 max-w-sm w-full"
      >
        <h2 className="text-3xl font-bold text-love-deep text-center">
          baby, are you happy with me?
        </h2>

        <div className="flex gap-6 items-center relative min-h-[80px] w-full justify-center">
          <motion.button
            animate={{ x: yesPos.x, y: yesPos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={moveYesButton}
            onTouchStart={moveYesButton}
            className="bg-love-rose text-love-deep px-8 py-3 rounded-full font-semibold shadow-md text-lg absolute"
          >
            absolutely yes!
          </motion.button>

          {!escaped && <div className="w-24" />}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="bg-muted text-foreground px-8 py-3 rounded-full font-semibold shadow-md text-lg"
          >
            let me think about it...
          </motion.button>
        </div>

        {escaped && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            hmm, that button seems to have a mind of its own
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default TrickQuestion;
