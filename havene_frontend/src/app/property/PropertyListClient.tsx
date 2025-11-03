"use client";

import React, { useMemo, useState, useEffect } from "react";
import PropertyCard from "./components/PropertyCard";
import { PropertySummary } from "./types";

type Props = {
  initialProperties: PropertySummary[];
  vipItems?: PropertySummary[];
};

export default function PropertyListClient({ initialProperties, vipItems = [] }: Props) {
  // client-side interactive state
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "sale" | "rent">("all");
  const [sortBy, setSortBy] = useState<"new" | "priceAsc" | "priceDesc">("new");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Derived arrays
  const filtered = useMemo(() => {
    let items = initialProperties.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location_text.toLowerCase().includes(q) ||
          (p.price ?? "").toString().toLowerCase().includes(q)
      );
    }

    if (type !== "all") {
      const t = type === "sale" ? ["з", "за"] : ["түр"];
      items = items.filter((p) =>
        (p.property_type ?? "").toLowerCase().split(/\s+/).some((v) => t.some((tok) => v.includes(tok)))
      );
    }

    if (sortBy === "priceAsc") {
      items.sort((a, b) => (a.priceNumber ?? parsePrice(a.price)) - (b.priceNumber ?? parsePrice(b.price)));
    } else if (sortBy === "priceDesc") {
      items.sort((a, b) => (b.priceNumber ?? parsePrice(b.price)) - (a.priceNumber ?? parsePrice(a.price)));
    } else {
      // fallback to newest by id (assumes id increases with time)
      items.sort((a, b) => b.id - a.id);
    }

    return items;
  }, [initialProperties, query, type, sortBy]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // ensure current page is valid when filters change
  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // helpers
  function parsePrice(p?: string | number) {
    if (!p) return 0;
    if (typeof p === "number") return p;
    const dig = p.toString().replace(/[^\d]/g, "");
    return dig ? Number(dig) : 0;
  }

  const goToPage = (n: number) => {
    if (n < 1) n = 1;
    if (n > pages) n = pages;
    setPage(n);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <div className="flex-1 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="w-full md:w-96 px-3 py-2 border rounded-md"
            placeholder="Хайх (байршил, үнэ, тодорхойлолт...)"
          />
          <select value={type} onChange={(e) => { setType(e.target.value as any); setPage(1); }} className="px-3 py-2 border rounded-md">
            <option value="all">Бүх зар</option>
            <option value="sale">Зарна</option>
            <option value="rent">Түрээслүүлнэ</option>
          </select>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }} className="px-3 py-2 border rounded-md">
            <option value="new">Огноогоор (Шинэ)</option>
            <option value="priceAsc">Үнэ өсөх</option>
            <option value="priceDesc">Үнэ буурах</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">Нийт: <span className="font-medium text-gray-800">{total.toLocaleString()}</span></div>
          <button onClick={() => { setQuery(""); setType("all"); setSortBy("new"); setPage(1); }} className="px-3 py-2 border rounded-md text-sm">Цэвэрлэх</button>
        </div>
      </div>

      {/* VIP carousel (horizontal) */}
      {vipItems.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">VIP — Онцлох зар</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {vipItems.map((v) => (
              <div key={v.id} className="min-w-[280px]">
                <PropertyCard
                  id={v.id}
                  title={v.title}
                  price={v.price}
                  location_text={v.location_text}
                  main_image={v.main_image}
                  view_count={v.view_count}
                  image_count={v.image_count}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((p) => (
          <PropertyCard
            key={p.id}
            id={p.id}
            title={p.title}
            price={p.price}
            location_text={p.location_text}
            main_image={p.main_image}
            view_count={p.view_count}
            image_count={p.image_count}
          />
        ))}

        {pageItems.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Тохирох зар олдсонгүй
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => goToPage(page - 1)} className="px-3 py-2 border rounded-md">{"<"} Өмнөх</button>
        {/* simple page numbers truncated */}
        {Array.from({ length: Math.min(pages, 9) }).map((_, i) => {
          const p = i + 1;
          if (p > pages) return null;
          const show = pages <= 9 || p === 1 || p === pages || (p >= page - 1 && p <= page + 1) || (p <= 3);
          return show ? (
            <button key={p} onClick={() => goToPage(p)} className={`px-3 py-2 border rounded-md ${p === page ? "bg-[#ABA48D] text-white" : ""}`}>
              {p}
            </button>
          ) : null;
        })}
        <button onClick={() => goToPage(page + 1)} className="px-3 py-2 border rounded-md">Дараах</button>
      </div>

      {/* Bottom banner */}
      <div className="bg-[#FDF7E9] border border-yellow-200 p-4 rounded-xl text-center">
        <div className="text-lg font-semibold">Заргaа илгээхэд бэлэн үү?</div>
        <p className="text-sm text-gray-600 mt-1">Бүртгүүлээд, зар нэмээд, онцлох болгож илүү хялбар зарна.</p>
        <div className="mt-3 flex justify-center gap-3">
          <button className="px-4 py-2 rounded-md bg-[#ABA48D] text-white">Зар нэмэх</button>
          <button className="px-4 py-2 rounded-md border">Дэлгэрэнгүй</button>
        </div>
      </div>
    </div>
  );
}
