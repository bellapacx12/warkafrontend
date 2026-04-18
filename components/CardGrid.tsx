"use client";

import { useState, useMemo } from "react";

export default function CardGrid({
  available,
  taken,
  selected,
  onSelect,
}: {
  available: number[];
  taken: number[];
  selected?: number | null;
  onSelect: (id: number) => void;
}) {
  const [localSelected, setLocalSelected] = useState<number | null>(null);

  // 🔥 use external selected if exists, fallback to local
  const activeSelected = selected ?? localSelected;

  // 🔥 limit cards (performance + mobile)
  const visibleCards = useMemo(() => {
    return available.slice(0, 60);
  }, [available]);

  const handleClick = (id: number) => {
    if (taken.includes(id)) return;
    if (activeSelected) return;

    setLocalSelected(id);
  };

  return (
    <div>
      {/* GRID */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {visibleCards.map((id) => {
          const isTaken = taken.includes(id);
          const isSelected = activeSelected === id;

          let style =
            "bg-gray-800 text-gray-200 hover:bg-gray-700 active:scale-95";

          if (isTaken) {
            style = "bg-red-500/70 text-white cursor-not-allowed";
          } else if (isSelected) {
            style = "bg-yellow-400 text-black scale-105";
          }

          return (
            <button
              key={id}
              disabled={isTaken || !!activeSelected}
              onClick={() => handleClick(id)}
              className={`p-4 rounded-xl font-semibold transition ${style}`}
            >
              #{id}
            </button>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 bg-gray-700 py-2 rounded-lg"
          onClick={() => setLocalSelected(null)}
        >
          Refresh
        </button>

        <button
          disabled={!activeSelected}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            activeSelected ? "bg-green-500 hover:bg-green-600" : "bg-gray-600"
          }`}
          onClick={() => activeSelected && onSelect(activeSelected)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
