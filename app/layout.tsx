"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout({ children }: any) {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, []);

  return <>{children}</>;
}
