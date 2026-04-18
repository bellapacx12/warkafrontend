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
  // 🔥 limit for mobile performance
  const visibleCards = available.slice(0, 60);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {visibleCards.map((id) => {
        const isTaken = taken.includes(id);
        const isSelected = selected === id;

        let style =
          "bg-gray-800 text-gray-200 hover:bg-gray-700 active:scale-95";

        if (isSelected) {
          // 🔴 YOUR CARD
          style = "bg-red-500 text-white scale-105";
        } else if (isTaken) {
          // ⚫ OTHER PLAYERS
          style = "bg-gray-600 text-gray-300 cursor-not-allowed";
        }

        return (
          <button
            key={id}
            disabled={isTaken || !!selected} // 🔥 lock after selecting
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
