import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD PHOTOS:
//   1. Drop any .jpg / .jpeg / .png / .webp / .gif into src/assets/gallery/
//   2. Push to git → Vercel rebuilds automatically
//   That's it. No code to edit here.
// ─────────────────────────────────────────────────────────────────────────────

const imageModules = import.meta.glob(
  "../assets/gallery/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}",
  { eager: true }
) as Record<string, { default: string }>;

const ALL_PHOTOS = Object.values(imageModules).map((m) => m.default);

// ── Lazy image that fades in when it enters the viewport ─────────────────────

const LazyPhoto = ({
  src,
  onClick,
}: {
  src: string;
  onClick: () => void;
}) => {
  const ref                         = useRef<HTMLDivElement>(null);
  const [visible, setVisible]       = useState(false);
  const [loaded, setLoaded]         = useState(false);

  useEffect(() => {
    const el  = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="cursor-zoom-in overflow-hidden rounded-2xl mb-3 bg-muted/30 relative group"
    >
      {visible ? (
        <>
          {!loaded && (
            <div className="w-full h-28 bg-love-blush/20 animate-pulse rounded-2xl" />
          )}
          <motion.img
            src={src}
            alt=""
            onLoad={() => setLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-2xl object-cover block"
            draggable={false}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-love-rose/0 group-hover:bg-love-rose/10 transition-colors rounded-2xl" />
        </>
      ) : (
        <div className="w-full h-28 bg-love-blush/20 rounded-2xl" />
      )}
    </div>
  );
};

// ── Masonry layout using CSS columns ─────────────────────────────────────────

const COLUMN_OPTIONS = [
  { label: "2", cols: 2 },
  { label: "3", cols: 3 },
  { label: "4", cols: 4 },
];

interface Props {
  onBack: () => void;
}

const Gallery = ({ onBack }: Props) => {
  const [cols, setCols]         = useState(3);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const photos = ALL_PHOTOS;

  // Split photos into column arrays for masonry
  const columns: string[][] = Array.from({ length: cols }, () => []);
  photos.forEach((p, i) => columns[i % cols].push(p));

  const openLightbox = (idx: number) => setLightbox(idx);

  const prevPhoto = () =>
    setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  const nextPhoto = () =>
    setLightbox((i) => (i !== null ? (i + 1) % photos.length : null));

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft")  prevPhoto();
      if (e.key === "Escape")     setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-background relative">
      <FallingCharacters variant="rinini" />

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
            >
              ← back
            </motion.button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-xl font-bold text-love-deep">
              memories
            </h1>
            <span className="text-xs text-muted-foreground">
              {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Column switcher */}
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {COLUMN_OPTIONS.map((o) => (
              <button
                key={o.cols}
                onClick={() => setCols(o.cols)}
                className={`w-8 h-7 rounded-lg text-xs font-semibold transition-all ${
                  cols === o.cols
                    ? "bg-card shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <div className="text-6xl">📂</div>
          <h2 className="text-2xl font-bold text-love-deep">no photos yet!</h2>
          <p className="text-muted-foreground max-w-xs text-sm">
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            </code>{" "}
          </p>
        </div>
      )}

      {/* ── Masonry grid ── */}
      {photos.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-6 z-10 relative">
          <div
            className="flex gap-3"
            style={{ alignItems: "flex-start" }}
          >
            {columns.map((col, ci) => (
              <div key={ci} className="flex-1 min-w-0">
                {col.map((src, ri) => {
                  const globalIdx = ri * cols + ci;
                  return (
                    <LazyPhoto
                      key={src}
                      src={src}
                      onClick={() => openLightbox(globalIdx)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            >
              ‹
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              src={photos[lightbox]}
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              draggable={false}
            />

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            >
              ›
            </button>

            {/* Counter + close */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <span className="text-white/60 text-sm">
                {lightbox + 1} / {photos.length}
              </span>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
