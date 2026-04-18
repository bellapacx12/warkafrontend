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
  const visibleCards = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {visibleCards.map((id) => {
          const isTaken = taken.includes(id);
          const isSelected = selected === id;
          const isAvailable = available.includes(id);

          let style =
            "bg-gray-800 text-gray-200 hover:bg-gray-700 active:scale-95";

          if (isSelected) {
            style = "bg-purple-500 text-white scale-105";
          } else if (isTaken) {
            style = "bg-red-500 text-white cursor-not-allowed";
          } else if (!isAvailable) {
            style = "bg-gray-900 text-gray-500";
          }

          return (
            <button
              key={id}
              disabled={isTaken}
              onClick={() => onSelect(id)}
              className={`aspect-square text-sm rounded-lg font-medium transition ${style}`}
            >
              {id}
            </button>
          );
        })}
      </div>
    </div>
  );
}
