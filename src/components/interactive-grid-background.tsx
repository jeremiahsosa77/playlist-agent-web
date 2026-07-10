"use client";

import {
  type CSSProperties,
  useEffect,
  useRef,
} from "react";

type InteractiveStyles = CSSProperties & {
  "--mouse-x": string;
  "--mouse-y": string;
};

export default function InteractiveGridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame: number | null = null;

    function handlePointerMove(event: PointerEvent) {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      animationFrame = window.requestAnimationFrame(() => {
        const container = containerRef.current;

        if (!container) {
          return;
        }

        container.style.setProperty(
          "--mouse-x",
          `${event.clientX}px`,
        );

        container.style.setProperty(
          "--mouse-y",
          `${event.clientY}px`,
        );
      });
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const interactiveStyles: InteractiveStyles = {
    "--mouse-x": "50vw",
    "--mouse-y": "50vh",
  };

  return (
    <div
      ref={containerRef}
      style={interactiveStyles}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-purple-700/20 blur-[120px]" />

      <div className="absolute right-[-8rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-blue-700/15 blur-[130px]" />

      <div className="absolute bottom-[-14rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-pink-700/10 blur-[140px]" />

      {/* Base grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Slight glow around the cursor */}
      <div
        className="absolute inset-0 opacity-70 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle 150px at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.035), transparent 75%)",
        }}
      />

      {/* Locally raised copy of the grid */}
      <div
        className="absolute inset-0 origin-center translate-y-[-2px] scale-[1.003] bg-[linear-gradient(to_right,rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[size:48px_48px]"
        style={{
          maskImage:
            "radial-gradient(circle 145px at var(--mouse-x) var(--mouse-y), black 0%, rgba(0,0,0,0.65) 45%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(circle 145px at var(--mouse-x) var(--mouse-y), black 0%, rgba(0,0,0,0.65) 45%, transparent 78%)",
        }}
      />
    </div>
  );
}