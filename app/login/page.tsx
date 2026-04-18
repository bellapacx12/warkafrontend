"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = params.get("token");

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
