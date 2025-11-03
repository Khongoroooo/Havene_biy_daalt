// src/app/property/components/RelatedCarousel.tsx
"use client";
import React, { useEffect, useState } from "react";
import { getAllProperties } from "../service";
import Link from "next/link";
import Image from "next/image";

export default function RelatedCarousel({ currentId }: { currentId?: number }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const all = await getAllProperties();
      const filtered = all.filter((p) => p.id !== currentId).slice(0, 8);
      setItems(filtered);
    })();
  }, [currentId]);

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      {items.map((it) => (
        <Link key={it.id} href={`/property/${it.id}`} className="min-w-[220px] rounded-xl overflow-hidden border bg-white flex-shrink-0">
          <div className="relative w-[220px] h-[120px]">
            <Image src={it.main_image ?? "/placeholder.png"} alt={it.title} fill className="object-cover" />
          </div>
          <div className="p-3">
            <div className="text-sm font-semibold">{it.price}</div>
            <div className="text-xs text-gray-500">{it.location_text}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
