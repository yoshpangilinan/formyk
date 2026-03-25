import { useEffect, useState } from "react";
import fallingRinini from "@/assets/falling-rinini.jpg";
import fallingGyunini from "@/assets/falling-gyunini.jpg";

interface FallingItem {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Props {
  variant: "rinini" | "gyunini";
}

const FallingCharacters = ({ variant }: Props) => {
  const [items, setItems] = useState<FallingItem[]>([]);
  const imageSrc = variant === "rinini" ? fallingRinini : fallingGyunini;

  useEffect(() => {
    const generated: FallingItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 30 + Math.random() * 40,
      duration: 5 + Math.random() * 7,
      delay: -(Math.random() * 10),
      opacity: 0.25 + Math.random() * 0.35,
    }));
    setItems(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((h) => (
        <img
          key={h.id}
          src={imageSrc}
          alt=""
          className="absolute animate-heartfall"
          style={{
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            objectFit: "contain",
          }}
        />
      ))}
    </div>
  );
};

export default FallingCharacters;
