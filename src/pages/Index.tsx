import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import MemoryGame from "@/components/MemoryGame";
import TrickQuestion from "@/components/TrickQuestion";
import CatchHearts from "@/components/CatchHearts";
import SweetMessage from "@/components/SweetMessage";
import JarOfHearts from "@/components/JarOfHearts";
import ScratchCard from "@/components/ScratchCard";

const PAGES = [
  "landing",
  "memory",
  "trick",
  "catch",
  "sweet",
  "jar",
  "scratch",
] as const;

type Page = (typeof PAGES)[number];

const Index = () => {
  const [page, setPage] = useState<Page>("landing");

  const goTo = (p: Page) => setPage(p);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {page === "landing" && <LandingPage onNext={() => goTo("memory")} />}
        {page === "memory" && <MemoryGame onNext={() => goTo("trick")} />}
        {page === "trick" && <TrickQuestion onNext={() => goTo("catch")} />}
        {page === "catch" && <CatchHearts onNext={() => goTo("sweet")} />}
        {page === "sweet" && <SweetMessage onNext={() => goTo("jar")} />}
        {page === "jar" && <JarOfHearts onNext={() => goTo("scratch")} />}
        {page === "scratch" && <ScratchCard />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
