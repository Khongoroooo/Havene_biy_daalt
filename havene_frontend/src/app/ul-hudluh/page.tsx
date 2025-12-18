"use client";

import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

type ApiProperty = {
  id: number;
  title?: string | null;
  price?: number | null;
  location_text?: string | null;
  main_image?: string | null;
  view_count?: number | null;
  image_count?: number | null;
  area_size?: number | null;
};

const DISTRICTS = [
  "Бүгд",
  "Баянзүрх",
  "Баянгол",
  "Сүхбаатар",
  "Хан-Уул",
  "Чингэлтэй",
  "Сонгинохайрхан",
];

const PROPERTY_TYPES = [
  "Бүгд",
  "Орон сууц",
  "Газар",
  "Хашаа байшин",
  "Оффис",
  "Худалдааны талбай",
];

export default function ListingsPage() {
  const [items, setItems] = useState<ApiProperty[]>([]);
  const [page, setPage] = useState<number>(1);
  const perPage = 30;
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Filters
  const [query, setQuery] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Бүгд");
  const [selectedType, setSelectedType] = useState<string>("Бүгд");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minArea, setMinArea] = useState<string>("");
  const [maxArea, setMaxArea] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    void load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function load(pg = 1) {
    setLoading(true);
    try {
      const body = {
        page: pg,
        per_page: perPage,
        query: query || undefined,
        district: selectedDistrict !== "Бүгд" ? selectedDistrict : undefined,
        type: selectedType !== "Бүгд" ? selectedType : undefined,
        min_price: minPrice ? parseFloat(minPrice) : undefined,
        max_price: maxPrice ? parseFloat(maxPrice) : undefined,
        min_area: minArea ? parseFloat(minArea) : undefined,
        max_area: maxArea ? parseFloat(maxArea) : undefined,
        sort_by: sortBy,
      };

      const res = await fetch("/api/property/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("list error", json);
        setItems([]);
        setTotal(0);
      } else {
        setItems(Array.isArray(json.data) ? json.data : []);
        setTotal(Number(json.total ?? (Array.isArray(json.data) ? json.data.length : 0)));
      }
    } catch (err) {
      console.error("load error", err);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setPage(1);
    void load(1);
  }

  function handleClearFilters() {
    setQuery("");
    setSelectedDistrict("Бүгд");
    setSelectedType("Бүгд");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setSortBy("newest");
    setPage(1);
    setTimeout(() => void load(1), 100);
  }

  function gotoDetail(id: number) {
    router.push(`/ul-hudluh/${id}`);
  }

  function formatPrice(p?: number | null): string {
    if (typeof p === "number") {
      return p.toLocaleString("en-US") + "₮";
    }
    return "Үнэ тохиролцоно";
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Үл хөдлөх хөрөнгө</h1>
          <p className="text-gray-600">Нийт {total} зар олдлоо</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Хайх... (Гарчиг, байршил)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#ABA48D] text-white rounded-lg hover:bg-[#9A9380] transition-colors"
            >
              Хайх
            </button>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Шүүлт
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${showMobileFilters ? "block" : "hidden md:block"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дүүрэг</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Төрөл</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Доод үнэ</label>
              <input
                type="text"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="₮"
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дээд үнэ</label>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="₮"
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              />
            </div>

            {/* Min Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Доод талбай</label>
              <input
                type="text"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="м²"
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              />
            </div>

            {/* Max Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дээд талбай</label>
              <input
                type="text"
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="м²"
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Эрэмбэлэх</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABA48D] focus:border-transparent"
              >
                <option value="newest">Шинэ эхлээд</option>
                <option value="price_asc">Үнэ өсөхөөр</option>
                <option value="price_desc">Үнэ буурахаар</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#ABA48D] text-white rounded-lg hover:bg-[#9A9380] transition-colors"
            >
              Шүүх
            </button>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X size={18} />
              Цэвэрлэх
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABA48D]"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">Зар олдсонгүй</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-[#ABA48D] hover:underline"
            >
              Шүүлтийг цэвэрлэх
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {items.map((p) => {
                const id = Number(p.id);
                const title = String(p.title ?? "Гарчиггүй зар");
                const priceStr = formatPrice(p.price);
                const loc = String(p.location_text ?? "Байршил тодорхойгүй");
                const main_image = p.main_image ?? "/placeholder.png";
                const view_count = Number(p.view_count ?? 0);
                const image_count = Number(p.image_count ?? 0);
                const area_size = p.area_size ?? undefined;

                return (
                  <div key={id} onClick={() => gotoDetail(id)} className="cursor-pointer">
                    <PropertyCard
                      id={id}
                      title={title}
                      price={priceStr}
                      location_text={loc}
                      main_image={main_image}
                      view_count={view_count}
                      image_count={image_count}
                      area_size={area_size}
                    />
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Өмнөх
                </button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum:number;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (page <= 3) {
                      pageNum = idx + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = page - 2 + idx;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === pageNum
                            ? "bg-[#ABA48D] text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Дараах
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}