"use client";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";

interface Props {
  id: number;
  title: string;
  price: string;
  location_text: string;
  main_image?: string;
  view_count?: number;
  image_count?: number;
}

export default function PropertyCard({
  id,
  title,
  price,
  location_text,
  main_image = "/placeholder.png",
  view_count = 0,
  image_count = 0,
}: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white border border-[#E6E2DB] rounded-2xl shadow-sm overflow-hidden w-[320px] md:w-[360px]">
      <Link href={`/property/${id}`} className="block relative h-44 md:h-52">
        <Image src={main_image} alt={title} fill className="object-cover" />
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/property/${id}`}>
              <p className="text-lg font-semibold text-[#1F2937] line-clamp-2">{title}</p>
              <p className="text-sm text-gray-600 mt-1">{location_text}</p>
            </Link>
          </div>

          <div className="flex flex-col items-end">
            <button
              onClick={() => setLiked((s) => !s)}
              aria-label="like"
              className="mb-2 p-2 rounded-full bg-white border hover:shadow"
            >
              <Heart size={16} className={liked ? "text-red-500 fill-red-500" : "text-gray-500"} />
            </button>
            <div className="text-sm font-semibold text-[#111827]">{price}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><Eye size={14} /> <span>{view_count}</span></div>
            <div>· {image_count} зураг</div>
          </div>
          <div className="text-xs text-gray-400">Шинэ</div>
        </div>
      </div>
    </div>
  );
}
