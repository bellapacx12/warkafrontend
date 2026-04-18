"use client";

import { useState } from "react";

export default function CardGrid({
  available,
  taken,
  onSelect,
}: {
  available: number[];
  taken: number[];
  onSelect: (id: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (id: number) => {
    if (!available.includes(id)) return;
    if (taken.includes(id)) return;

    setSelected(id);
  };

  return (
    <div>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((id) => {
          const isAvailable = available.includes(id);
          const isTaken = taken.includes(id);
          const isSelected = selected === id;

          let style = "bg-gray-900 text-gray-600"; // default

          if (isTaken) style = "bg-gray-700 text-gray-400";
          else if (isSelected) style = "bg-purple-500 text-white";
          else if (isAvailable) style = "bg-gray-800 text-gray-200";

          return (
            <div
              key={id}
              onClick={() => handleClick(id)}
              className={`p-3 text-center rounded-lg cursor-pointer ${style}`}
            >
              {id}
            </div>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-6">
        <button
          className="flex-1 bg-blue-500 py-2 rounded"
          onClick={() => setSelected(null)}
        >
          Refresh
        </button>

        <button
          disabled={!selected}
          className={`flex-1 py-2 rounded ${
            selected ? "bg-orange-500" : "bg-gray-600"
          }`}
          onClick={() => selected && onSelect(selected)}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
