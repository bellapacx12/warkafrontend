"use client";

export default function TopStats() {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
      <div className="bg-[#1a2a3d] p-2 rounded-lg">
        <p className="text-xs text-gray-400">Wallet</p>
        <p className="font-bold">203.72</p>
      </div>

      <div className="bg-[#1a2a3d] p-2 rounded-lg">
        <p className="text-xs text-gray-400">Bonus</p>
        <p className="font-bold">4</p>
      </div>

      <div className="bg-[#1a2a3d] p-2 rounded-lg">
        <p className="text-xs text-gray-400">Active Game</p>
        <p className="font-bold">2</p>
      </div>

      <div className="bg-[#1a2a3d] p-2 rounded-lg">
        <p className="text-xs text-gray-400">Stake</p>
        <p className="font-bold">10</p>
      </div>
    </div>
  );
}
