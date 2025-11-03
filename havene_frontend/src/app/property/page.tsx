// src/app/property/page.tsx
"use client";

import { useState } from "react";
import PropertyFilter from "./mainComponents/PropertyFilter";
import PropertyList from "./mainComponents/PropertyList";

/**
 * Property page:
 * - Top banner (simple, no long phrase)
 * - Filter row (compact)
 * - Property list with pagination
 *
 * This file assumes you already have:
 *  ./mainComponents/PropertyFilter
 *  ./mainComponents/PropertyList
 */

export default function PropertyPage() {
  const [filter, setFilter] = useState({
    search: "",
    category: "all",
    priceRange: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Simp
      <div className="relative w-full h-[300px] md:h-[360px]">
        <img
          src="/house.jpg"
          alt="Banner"
          className="w-full h-full object-cover brightness-[0.75]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-2xl md:text-4xl font-semibold">Үл хөдлөх зарууд</h1>
          <p className="mt-2 text-sm md:text-base text-gray-200 max-w-2xl">
            Орон сууц, оффис, үйлчилгээ — оновчтой хайлт болон шүүлтүүрээр хурдан олно.
          </p>
        </div>
      </div>
    le Banner (custom text, no long phrase) --- */}

      {/* --- Filter area (compact, under banner) --- */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <PropertyFilter filter={filter} setFilter={setFilter} />
      </div>

      {/* --- Properties list with pagination --- */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-16">
        <PropertyList
          filter={filter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
