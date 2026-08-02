"use client";

import { usePathname } from "next/navigation";
import { isChromeHidden } from "@/data/layout-config";
import Footer from "./footer";

export function FooterWrapper() {
  const pathname = usePathname();

  if (isChromeHidden(pathname)) return null;

  return <Footer />;
}
