// src/app/property/components/PropertyGallery.tsx
"use client";
import Image from "next/image";
import React, { useState } from "react";

type Img = { id?: number; image_url: string; is_main?: boolean };

interface Props {
  images: Img[];
  mainImage?: string | null;
  title?: string;
}

export default function PropertyGallery({ images, mainImage, title }: Props) {
  const initial = mainImage ?? images?.[0]?.image_url ?? "/placeholder.png";
  const [active, setActive] = useState<string>(initial);

  return (
    <div className="space-y-3">
      {/* Large image */}
      <div className="w-full rounded-xl overflow-hidden bg-gray-100">
        <div className="relative w-full aspect-[16/9]">
          <Image src={active} alt="sdf" fill className="object-cover" />
        </div>
      </div>

      {/* Thumbnails - horizontal scroll on small screens */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {images.map((img, i) => (
          <button
            key={img.id ?? i}
            onClick={() => setActive(img.image_url)}
            className={`flex-none rounded-md overflow-hidden border ${active === img.image_url ? "ring-2 ring-[#ABA48D]" : "border-gray-200"}`}
            style={{ width: 96, height: 64 }}
            aria-label={`Thumbnail ${i + 1}`}
          >
            <div className="relative w-[96px] h-[64px]">
              <Image src={img.image_url} alt={`thumb-${i}`} fill className="object-cover" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
