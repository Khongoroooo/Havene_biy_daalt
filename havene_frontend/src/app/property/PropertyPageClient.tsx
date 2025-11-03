"use client";

import React, { useState, useMemo } from "react";
import { PropertySummary } from "./types";
import PropertyCard from "./components/PropertyCard";

type Props = {
  initialProperties: PropertySummary[];
  vipItems?: PropertySummary[];
};

const DISTRICTS = ["Бүгд", "Сүхбаатар", "Хан-Уул", "Баянзүрх", "Баянгол", "Сонгинохайрхан", "Чингэлтэй"];
const PROPERTY_TYPES = ["Бүгд", "Орон сууц", "Оффис", "Газар", "Хаус"];

export default function PropertyPageClient({ initialProperties, vipItems = [] }: Props) {
  const [selectedDistrict, setSelectedDistrict] = useState("Бүгд");
  const [selectedType, setSelectedType] = useState("Бүгд");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<"new" | "priceAsc" | "priceDesc">("new");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Фильтр
  const filtered = useMemo(() => {
    let items = [...initialProperties];

    if (selectedDistrict !== "Бүгд") {
      items = items.filter((p) => p.location_text.toLowerCase().includes(selectedDistrict.toLowerCase()));
    }

    if (selectedType !== "Бүгд") {
      items = items.filter((p) => p.title.toLowerCase().includes(selectedType.toLowerCase()));
    }

    const parsePrice = (str: string) => parseInt(str.replace(/[^\d]/g, "")) || 0;
    const min = minPrice ? parsePrice(minPrice) : 0;
    const max = maxPrice ? parsePrice(maxPrice) : 0;
    if (min) items = items.filter((p) => parsePrice(p.price) >= min);
    if (max) items = items.filter((p) => parsePrice(p.price) <= max);

    if (sortBy === "priceAsc") items.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    else if (sortBy === "priceDesc") items.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    else items.sort((a, b) => b.id - a.id);

    return items;
  }, [initialProperties, selectedDistrict, selectedType, minPrice, maxPrice, sortBy]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (n: number) => setPage(Math.min(Math.max(1, n), pages));
  const clearFilters = () => {
    setSelectedDistrict("Бүгд");
    setSelectedType("Бүгд");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("new");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select className="border rounded-md px-3 py-2" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="border rounded-md px-3 py-2" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input placeholder="Доод үнэ" className="border rounded-md px-3 py-2 w-24" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input placeholder="Дээд үнэ" className="border rounded-md px-3 py-2 w-24" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <select className="border rounded-md px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="new">Шинэ</option>
            <option value="priceAsc">Үнэ өсөх</option>
            <option value="priceDesc">Үнэ буурах</option>
          </select>
        </div>
        <button className="bg-[#ABA48D] text-white px-4 py-2 rounded-md" onClick={clearFilters}>Цэвэрлэх</button>
      </div>

      {/* VIP Section */}
      {vipItems.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h3 className="font-semibold mb-3">VIP — Онцлох зар</h3>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {vipItems.map(v => (
              <div key={v.id} className="min-w-[260px]"><PropertyCard {...v} /></div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map(p => <PropertyCard key={p.id} {...p} />)}
          {pageItems.length === 0 && <div className="col-span-full bg-white p-10 text-center rounded-xl text-gray-500">Тохирох зар олдсонгүй</div>}
        </main>

        {/* Ads */}
        <aside className="hidden lg:block w-[340px] xl:w-[380px] flex-shrink-0 space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-6 rounded-xl text-white shadow-md">
            <h3 className="text-lg font-bold">REMAX</h3>
            <p className="text-sm mt-1 mb-4">Монголын тэргүүлэгч үл хөдлөх агентлаг</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100">Дэлгэрэнгүй</button>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-400 p-6 rounded-xl text-white shadow-md">
            <h3 className="text-lg font-bold">Автомашин</h3>
            <p className="text-sm mb-4 opacity-90">Таны хүссэн автомашиныг амархан нөхцлөөр</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100">Үзэх</button>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h4 className="font-semibold mb-2">Зөвлөгөө авах</h4>
            <p className="text-sm text-gray-600 mb-3">Үл хөдлөхийн зөвлөгөө авахыг хүсэж байна уу?</p>
            <button className="w-full bg-[#ABA48D] text-white py-2 rounded-md hover:bg-[#958d76]">Холбогдох</button>
          </div>
        </aside>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-3 py-2 border rounded-md disabled:opacity-50">«</button>
          {Array.from({ length: pages }).slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => goToPage(i+1)} className={`px-3 py-2 border rounded-md ${page === i+1 ? "bg-[#ABA48D] text-white" : ""}`}>{i+1}</button>
          ))}
          <button onClick={() => goToPage(page + 1)} disabled={page === pages} className="px-3 py-2 border rounded-md disabled:opacity-50">»</button>
        </div>
      )}
    </div>
  );
}
