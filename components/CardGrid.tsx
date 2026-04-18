"use client";

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
  // show 1–100 cards
  const visibleCards = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {visibleCards.map((id) => {
        const isTaken = taken.includes(id);
        const isSelected = selected === id;
        const isAvailable = available.includes(id);

        let style =
          "bg-gray-800 text-gray-200 hover:bg-gray-700 active:scale-95";

        // 🟣 YOUR CARD (highest priority)
        if (isSelected) {
          style = "bg-purple-500 text-white scale-105";
        }
        // 🔴 TAKEN BY OTHERS
        else if (isTaken) {
          style = "bg-red-500 text-white cursor-not-allowed";
        }
        // ⚪ NOT AVAILABLE (optional fallback)
        else if (!isAvailable) {
          style = "bg-gray-900 text-gray-500";
        }

        return (
          <button
            key={id}
            disabled={isTaken} // ✅ only disable taken
            onClick={() => onSelect(id)}
            className={`p-4 rounded-xl font-semibold transition ${style}`}
          >
            {id}
          </button>
        );
      })}
    </div>
  );
}
