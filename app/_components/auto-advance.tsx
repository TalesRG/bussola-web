"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoAdvance({ href, delay }: { href: string; delay: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => router.replace(href), delay);
    return () => clearTimeout(id);
  }, [router, href, delay]);

  return null;
}
