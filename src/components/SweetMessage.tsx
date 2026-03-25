import { motion } from "framer-motion";

interface Props {
  onNext: () => void;
}

const SweetMessage = ({ onNext }: Props) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-md"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-love-deep mb-4 leading-tight">
          thankfully. knowing that my pretty little doll is happy with me is the only thing i care about.
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-2xl text-primary mb-8 font-medium"
        >
          you make me happy, too. i love you, my silly little baby.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-lg"
        >
          hehehe!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SweetMessage;
