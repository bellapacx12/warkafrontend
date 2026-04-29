"use client";

import { useEffect, useState } from "react";

export function useBalance(token: string | null) {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    if (!token) return;

    try {
      const res = await fetch("https://warkabackend.onrender.com/api/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBalance(data.balance || 0);
    } catch (err) {
      console.log("balance error:", err);
    }
  };

  useEffect(() => {
    fetchBalance();

    const interval = setInterval(fetchBalance, 10000); // optional refresh

    return () => clearInterval(interval);
  }, [token]);

  return { balance, refresh: fetchBalance };
}
