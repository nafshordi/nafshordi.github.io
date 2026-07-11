"use client";

import { useRef, useState } from "react";

type Topic = { id: string; title: string };

const layout = [
  [4, 8], [36, 22], [70, 7], [5, 45], [39, 51], [72, 38], [4, 78], [39, 77], [72, 73],
];

export function ResearchTopicCloud({ topics }: { topics: Topic[] }) {
  const cloudRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, active: false });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = cloudRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
      active: true,
    });
  }

  function resetPointer() {
    setPointer({ x: 0.5, y: 0.5, active: false });
  }

  return (
    <div
      className={`research-topic-cloud${pointer.active ? " is-active" : ""}`}
      ref={cloudRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="Interactive research topics"
    >
      <p className="research-topic-cloud-hint">Move across the topics to explore</p>
      {topics.map((topic, index) => {
        const [left, top] = layout[index % layout.length];
        const topicX = left / 100;
        const topicY = top / 100;
        const distance = Math.hypot(pointer.x - topicX, pointer.y - topicY);
        const proximity = Math.max(0, 1 - distance / 0.42);
        const scale = 1 + proximity * 0.22;
        const shiftX = (pointer.x - topicX) * -16 * proximity;
        const shiftY = (pointer.y - topicY) * -12 * proximity;
        return (
          <a
            className="research-topic"
            href={`#${topic.id}`}
            key={topic.id}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${scale})`,
              zIndex: 2 + Math.round(proximity * 10),
            }}
          >
            {topic.title}
          </a>
        );
      })}
    </div>
  );
}
