// src/app/property/components/PropertySidebar.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Phone, Share2 } from "lucide-react";

interface Owner {
  id?: number;
  name?: string;
  phone?: string;
  avatar?: string;
  other_count?: number;
}

interface Props {
  owner?: Owner;
  phoneMasked: string;
  phoneRaw: string;
  propertyId: number;
  propertyTitle: string;
  propertyPrice: string;
  propertyUrl: string;
  related?: any[];
  latitude?: number;
  longitude?: number;
}

export default function PropertySidebar({
  owner,
  phoneMasked,
  phoneRaw,
  propertyId,
  propertyTitle,
  propertyPrice,
  propertyUrl,
  latitude,
  longitude,
}: Props) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneRaw);
      alert("Тоо хуулбарлагдлаа: " + phoneRaw);
    } catch {
      alert("Хуулбарлаж чадсангүй");
    }
  };

  const handleShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: propertyTitle,
          text: `${propertyPrice} — ${propertyTitle}`,
          url: propertyUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(propertyUrl);
      alert("Зарын холбоос clipboard-д хуулбарлагдлаа");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
      <div className="text-sm text-gray-500">Зарын дугаар: <span className="font-medium">#{propertyId}</span></div>

      <div className="text-2xl font-semibold">{propertyPrice}</div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
          <Image src={owner?.avatar ?? "/avatar-placeholder.png"} alt={owner?.name ?? "owner"} width={48} height={48} className="object-cover" />
        </div>
        <div>
          <div className="text-sm font-medium">{owner?.name ?? "Зарын эзэн"}</div>
          <div className="text-xs text-gray-500">{owner?.other_count ?? 0} бусад зар</div>
        </div>
      </div>

      <div className="space-y-2">
        <a href={`tel:${phoneRaw}`} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#ABA48D] text-white">
          <Phone size={16} /> Утас: {phoneMasked}
        </a>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm">Дугаарыг хуул</button>
          <button onClick={handleShare} className="px-3 py-2 rounded-xl border border-gray-200 text-sm"><Share2 size={16} /></button>
        </div>
      </div>

      {/* Map (responsive embed) */}
      <div>
        <h3 className="text-sm font-medium mb-2">Байршил</h3>
        {latitude && longitude ? (
          <div className="w-full rounded-md overflow-hidden border">
            <iframe
              title="map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01}%2C${latitude-0.01}%2C${longitude+0.01}%2C${latitude+0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
              className="w-full h-48"
            />
            <div className="text-xs text-gray-500 pt-1">© OpenStreetMap</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Байршил тодорхойгүй</div>
        )}
      </div>
    </div>
  );
}
