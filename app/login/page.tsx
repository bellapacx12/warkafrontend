"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginClient() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    // ✅ manually read URL
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();

        const user = await res.json();

        setAuth(user, token);

        router.push("/");
      })
      .catch(() => {
        router.push("/");
      });
  }, []);

  return <div>Logging you in...</div>;
}
