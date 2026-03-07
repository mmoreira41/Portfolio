"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="custom-cursor-dot"
      style={{
        left: pos.x,
        top: pos.y,
      }}
      aria-hidden
    />
  );
}
