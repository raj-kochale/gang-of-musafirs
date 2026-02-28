"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyRequestPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        color: "var(--color-muted)",
        fontFamily: "var(--font-inter)",
      }}
    >
      Redirecting to sign in...
    </div>
  );
}
