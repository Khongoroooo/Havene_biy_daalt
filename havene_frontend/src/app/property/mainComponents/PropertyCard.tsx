"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function PropertyCard({ property }: any) {
  return (
    <Link
      href={`/property/${property.id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
    >
      <div className="relative">
        <Image
          src={property.image}
          alt={property.title}
          width={400}
          height={250}
          className="object-cover w-full h-[220px]"
        />
        <div className="absolute bottom-2 right-2 bg-white/80 text-gray-700 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
          <Eye size={14} /> 25
        </div>
      </div>
      <div className="p-4 space-y-1">
        <p className="font-semibold text-lg text-[#2A2A2A]">
          {property.price}
        </p>
        <p className="text-gray-700 text-sm line-clamp-2">{property.title}</p>
        <p className="text-gray-500 text-xs">{property.location}</p>
        <p className="text-gray-400 text-xs">{property.date}</p>
      </div>
    </Link>
  );
}
