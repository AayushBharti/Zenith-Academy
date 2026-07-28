"use client";

import Image from "next/image";
import { useMemo } from "react";

/** Curated Unsplash photo IDs — dark, abstract, cinematic, high-quality. All verified 200. */
const UNSPLASH_PHOTOS = [
  // Abstract gradients & color
  "photo-1618005182384-a83a8bd57fbe", // gradient spheres
  "photo-1579546929518-9e396f3cc809", // gradient mesh
  "photo-1620641788421-7a1c342ea42e", // colorful gradient
  "photo-1557672172-298e090bd0f1", // pink blue gradient splash
  "photo-1553356084-58ef4a67b2a7", // purple gradient abstract
  "photo-1550684376-efcbd6e3f031", // neon light trails
  "photo-1541701494587-cb58502866ab", // vibrant ink in water
  "photo-1557682250-33bd709cbe85", // purple gradient
  // Dark & moody textures
  "photo-1634017839464-5c339ebe3cb4", // dark abstract waves
  "photo-1635776062127-d379bfcba9f8", // abstract dark textures
  "photo-1614850523459-c2f4c699c52e", // dark abstract
  "photo-1558591710-4b4a1ae0f04d", // abstract marble dark
  "photo-1518531933037-91b2f5f229cc", // dark fluid art
  "photo-1534796636912-3b95b3ab5986", // dark blue abstract
  "photo-1544256718-3bcf237f3974", // dark neon glow
  "photo-1608501078713-8e445a709b39", // dark smoke texture
  // Cosmic & space
  "photo-1451187580459-43490279c0fa", // earth from space
  "photo-1462331940025-496dfbfc7564", // galaxy nebula
  "photo-1464802686167-b939a6910659", // milky way stars
  "photo-1419242902214-272b3f66ee7a", // northern lights
  "photo-1507908708918-778587c9e563", // star field
  "photo-1543722530-d2c3201371e7", // aurora borealis
  // Atmospheric & cinematic
  "photo-1563089145-599997674d42", // neon city abstract
  "photo-1605106702842-01a887a31122", // dark crystal abstract
  "photo-1604871000636-074fa5117945", // dark geometric pattern
  "photo-1624628639856-100bf817fd35", // abstract dark gradient
  "photo-1516553174826-d05833723cd4", // moody atmospheric
  "photo-1550745165-9bc0b252726f", // colorful light leak
  "photo-1549317661-bd32c8ce0db2", // abstract wave dark
  "photo-1596727147705-61a532a659bd", // dark liquid texture
  "photo-1569982175971-d92b01cf8694", // abstract smoke
  "photo-1531366936337-7c912a4589a7", // dark aurora sky
  "photo-1470813740244-df37b8c1edcb", // neon light abstract
  "photo-1507400492013-162706c8c05e", // dark ocean waves
  "photo-1525547719571-a2d4ac8945e2", // moody laptop dark
  "photo-1617957718614-8c23f060c2d0", // abstract fluid dark
];

/** Returns a random Unsplash image URL at the given dimensions. */
function getRandomImageUrl(width: number, height: number): string {
  const photo =
    UNSPLASH_PHOTOS[Math.floor(Math.random() * UNSPLASH_PHOTOS.length)];
  return `https://images.unsplash.com/${photo}?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
}

/** Full-bleed image panel for auth pages. Shows a random abstract image on each mount. */
export function AuthImagePanel() {
  const imageUrl = useMemo(() => getRandomImageUrl(1920, 1080), []);

  return (
    <div className="relative hidden overflow-hidden lg:block">
      <Image
        alt=""
        className="object-cover"
        fill
        priority
        sizes="50vw"
        src={imageUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30" />
      <p className="absolute right-6 bottom-6 text-white/50 text-xs">
        Built by{" "}
        <a
          className="text-white/70 underline underline-offset-4 transition-colors hover:text-white"
          href="https://aayushbharti.in"
          rel="noopener noreferrer"
          target="_blank"
        >
          Aayush Bharti
        </a>
      </p>
    </div>
  );
}
