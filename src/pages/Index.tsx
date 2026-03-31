import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage    from "@/components/LandingPage";
import CafePOS        from "@/components/CafePOS";
import MemoryGame     from "@/components/MemoryGame";
import TrickQuestion  from "@/components/TrickQuestion";
import CatchHearts    from "@/components/CatchHearts";
import SweetMessage   from "@/components/SweetMessage";
import JarOfHearts    from "@/components/JarOfHearts";
import WordScramble   from "@/components/WordScramble";
import TapCharacter   from "@/components/TapCharacter";
import LoveCalculator from "@/components/LoveCalculator";
import SealedLetters  from "@/components/SealedLetters";
import Jigsaw         from "@/components/Jigsaw";
import ScratchCard    from "@/components/ScratchCard";
import Gallery        from "@/components/Gallery";

const PAGES = [
  "landing",
  "gallery",
  "cafe",
  "memory",
  "trick",
  "catch",
  "sweet",
  "jar",
  "wordscramble",
  "tapcharacter",
  "lovecalculator",
  "sealedletters",
  "jigsaw",
  "scratch",
] as const;

type Page = (typeof PAGES)[number];

const PAGE_LABELS: Record<Page, string> = {
  landing:       "🏠 Landing",
  gallery:       "📸 Memories Gallery",
  cafe:          "🧋 Café POS",
  memory:        "🃏 Memory Game",
  trick:         "😏 Trick Question",
  catch:         "💝 Catch Hearts",
  sweet:         "💬 Sweet Message",
  jar:           "🫙 Jar of Hearts",
  wordscramble:  "🔤 Word Scramble",
  tapcharacter:  "👆 Tap the Character",
  lovecalculator:"💯 Love Calculator",
  sealedletters: "💌 Sealed Letters",
  jigsaw:        "🧩 Jigsaw",
  scratch:       "🪙 Scratch Card",
};

// Dev nav is only visible during local development (npm run dev)
const IS_DEV = import.meta.env.DEV;

const Index = () => {
  const [page, setPage]         = useState<Page>("landing");
  const [devOpen, setDevOpen]   = useState(false);

  const goTo = (p: Page) => {
    setPage(p);
    setDevOpen(false);
  };

  const currentIdx = PAGES.indexOf(page);
  const goNext = () => {
    const next = PAGES[currentIdx + 1];
    if (next) goTo(next);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {page === "landing"        && <LandingPage    onNext={() => goTo("cafe")} onArchive={() => goTo("gallery")} />}
          {page === "gallery"         && <Gallery         onBack={() => goTo("landing")} />}
          {page === "cafe"           && <CafePOS         onNext={() => goTo("memory")}         />}
          {page === "memory"         && <MemoryGame      onNext={() => goTo("trick")}          />}
          {page === "trick"          && <TrickQuestion   onNext={() => goTo("catch")}          />}
          {page === "catch"          && <CatchHearts     onNext={() => goTo("sweet")}          />}
          {page === "sweet"          && <SweetMessage    onNext={() => goTo("jar")}            />}
          {page === "jar"            && <JarOfHearts     onNext={() => goTo("wordscramble")}   />}
          {page === "wordscramble"   && <WordScramble    onNext={() => goTo("tapcharacter")}   />}
          {page === "tapcharacter"   && <TapCharacter    onNext={() => goTo("lovecalculator")} />}
          {page === "lovecalculator" && <LoveCalculator  onNext={() => goTo("sealedletters")}  />}
          {page === "sealedletters"  && <SealedLetters   onNext={() => goTo("jigsaw")}         />}
          {page === "jigsaw"         && <Jigsaw          onNext={() => goTo("scratch")}        />}
          {page === "scratch"        && <ScratchCard />}
        </motion.div>
      </AnimatePresence>

      {/* ── Dev navigation — only shows during `npm run dev` ── */}
      {IS_DEV && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <AnimatePresence>
            {devOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="mb-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden w-52"
              >
                <div className="px-4 py-2.5 border-b border-border bg-muted/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    dev · jump to page
                  </p>
                </div>
                <div className="flex flex-col py-1 max-h-80 overflow-y-auto">
                  {PAGES.map((p) => (
                    <button
                      key={p}
                      onClick={() => goTo(p)}
                      className={`text-left px-4 py-2 text-sm transition-colors hover:bg-muted ${
                        page === p
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-foreground"
                      }`}
                    >
                      {page === p && "→ "}
                      {PAGE_LABELS[p]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDevOpen((o) => !o)}
            className="bg-card border border-border shadow-lg rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            🔧 dev
          </motion.button>
        </div>
      )}
    </>
  );
};

export default Index;
