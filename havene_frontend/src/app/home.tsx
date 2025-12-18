"use client";

import Image from "next/image";
import PropertyCard  from "./components/PropertyCard";
import React, { useRef, useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Funnel,
  X,
} from "lucide-react";

/** Type */
type Property = {
  id: number;
  title: string;
  price: string; // human readable, e.g. "125,500,000₮"
  priceNumber?: number; // numeric price in ₮ (optional)
  location_text: string; // "УБ — Баянгол, Хороо 17"
  main_image: string;
  view_count?: number;
  image_count?: number;
  created_at?: string;
  property_type?: string;
  area_size?: number;
};

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Модны-2 World Mongolia Tower-т оффис өрөө",
    price: "125,500,000₮",
    priceNumber: 125500000,
    location_text: "УБ — Баянгол, Хороо 17",
    main_image: "/zar.jpg",
    view_count: 5,
    image_count: 6,
    created_at: "1 цагийн өмнө",
    property_type: "Оффис",
    area_size: 25,
  },
  {
    id: 2,
    title: "Grand Plaza-д оффисын талбай",
    price: "600,000,000₮",
    priceNumber: 600000000,
    location_text: "УБ — Баянгол, Баруун 4 зам",
    main_image: "/zar2.png",
    view_count: 25,
    image_count: 3,
    created_at: "3 цагийн өмнө",
    property_type: "Оффис",
    area_size: 120,
  },
  {
    id: 3,
    title: "World Mongolia Tower 25м² 1 өрөө үйлчилгээний талбай",
    price: "112,500,000₮",
    priceNumber: 112500000,
    location_text: "УБ — Баянгол, Модны 2",
    main_image: "/zar1.webp",
    view_count: 15,
    image_count: 4,
    created_at: "Өчигдөр",
    property_type: "Оффис",
    area_size: 25,
  },
  {
    id: 4,
    title: "Cali center-т оффис 53мк талбай",
    price: "6,800,000₮",
    priceNumber: 6800000,
    location_text: "УБ — Баянгол, Хороо 24",
    main_image: "/zar2.png",
    view_count: 10,
    image_count: 2,
    created_at: "3 өдрийн өмнө",
    property_type: "Оффис",
    area_size: 53,
  },
  {
    id: 5,
    title: "Grand plaza 122.9 мкв оффис",
    price: "1,380,000,000₮",
    priceNumber: 1380000000,
    location_text: "УБ — Баянгол, Баруун 4 зам",
    main_image: "/zar.jpg",
    view_count: 8,
    image_count: 5,
    created_at: "7 өдрийн өмнө",
    property_type: "Оффис",
    area_size: 122.9,
  },
];

const DISTRICTS = [
  "Сүхбаатар",
  "Хан-Уул",
  "Баянзүрх",
  "Баянгол",
  "Сонгинохайрхан",
  "Чингэлтэй",
  "Налайх",
  "Багануур",
  "Багахангай",
];

const PROPERTY_TYPES = ["Бүгд", "Орон сууц", "Оффис", "Газар", "Хаус"];

export default function Home() {
  // UI refs for scrolling lists
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Filter states
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Бүгд");
  const [selectedType, setSelectedType] = useState<string>("Бүгд");
  const [minPrice, setMinPrice] = useState<string>(""); // input as string for UX
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<"new" | "priceAsc" | "priceDesc">("new");
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile collapse

  // parse helper: accept '125,500,000₮' etc -> number
  const parsePrice = (p?: string | number) => {
    if (typeof p === "number") return p;
    if (!p) return 0;
    // Remove non digits
    const digits = p.toString().replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  // Apply filters & sorting (memoized)
  const filtered = useMemo(() => {
    let items = mockProperties.slice();

    // query filter (title/location)
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.location_text.toLowerCase().includes(q)
      );
    }

    // district filter
    if (selectedDistrict && selectedDistrict !== "Бүгд") {
      items = items.filter((it) =>
        it.location_text.toLowerCase().includes(selectedDistrict.toLowerCase())
      );
    }

    // property type
    if (selectedType && selectedType !== "Бүгд") {
      items = items.filter(
        (it) =>
          (it.property_type ?? "").toLowerCase() === selectedType.toLowerCase()
      );
    }

    // price range
    const minN = parsePrice(minPrice) || undefined;
    const maxN = parsePrice(maxPrice) || undefined;
    if (minN !== undefined) items = items.filter((it) => (it.priceNumber ?? parsePrice(it.price)) >= minN);
    if (maxN !== undefined) items = items.filter((it) => (it.priceNumber ?? parsePrice(it.price)) <= maxN);

    // sorting
    if (sortBy === "priceAsc") {
      items.sort((a, b) => (a.priceNumber ?? parsePrice(a.price)) - (b.priceNumber ?? parsePrice(b.price)));
    } else if (sortBy === "priceDesc") {
      items.sort((a, b) => (b.priceNumber ?? parsePrice(b.price)) - (a.priceNumber ?? parsePrice(a.price)));
    } else {
      // "new" - keep mock order or sort by created_at if available (not reliable in mock)
      items.sort((a, b) => (b.id - a.id));
    }

    return items;
  }, [query, selectedDistrict, selectedType, minPrice, maxPrice, sortBy]);

  // scroll helper
  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (!ref || !ref.current) return;
    const width = ref.current.clientWidth;
    const amount = Math.floor(width * 0.75);
    ref.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedDistrict("Бүгд");
    setSelectedType("Бүгд");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("new");
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <div className="relative w-full h-[440px]">
        <Image src="/house.jpg" alt="cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10" />

        <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 px-4">
          <h1 className="text-3xl md:text-4xl text-white font-semibold drop-shadow-md">Үл хөдлөх – Хайх, үзэх, нэмэх</h1>
          <p className="text-white/80 mt-1 mb-6">Зар, түрээс, худалдаа — бүгд нэг дор</p>

          {/* Search + Filters toggle */}
          <div className="relative w-full max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/90 pointer-events-none">
                <Search size={18} />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Жишээ: байр, дүүрэг, үнэ (жишээ: 2 өрөө Баянгол)"
                className="w-full pl-12 pr-12 h-12 md:h-14 rounded-full bg-white/10 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-[#ABA48D]"
              />
              <div className="absolute right-12 top-1/2 -translate-y-1/2 text-white/90 pointer-events-none">
                <SlidersHorizontal size={18} />
              </div>
            </div>

            {/* Mobile filters toggle */}
            <button
              onClick={() => setFiltersOpen((s) => !s)}
              className="md:hidden flex items-center gap-2 bg-white/90 px-3 rounded-full shadow"
              aria-expanded={filtersOpen}
            >
              <Funnel size={16} />
              <span className="text-sm font-medium">Шүүлт</span>
            </button>

            {/* Desktop quick CTA */}
            <button className="hidden md:flex items-center gap-2 bg-[#ABA48D] text-white px-4 rounded-full shadow">
          <a href="/ul-hudluh/">Зар хайх</a> 
              <ArrowRight size={16} />
            </button>
          </div>
          {/* Desktop Filters (visible md+) */}
          <div className="hidden md:flex justify-center mt-6 w-full">
            <div className="hidden md:flex justify-center mt-8 w-full">
              {/* District */}
              <a
                href="/ul-hudluh/create"
                className="
                flex items-center gap-3
                bg-[#ABA48D] text-white
                px-8 py-4
                rounded-full
                shadow-lg
                text-lg font-semibold
                hover:scale-105 hover:shadow-xl
                transition-all duration-200"
              >
                Зар оруулах
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters panel */}
      {filtersOpen && (
        <div className="md:hidden max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Шүүлт</div>
              <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-full bg-gray-100">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs text-gray-600">Дүүрэг</label>
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                <option>Бүгд</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              <label className="block text-xs text-gray-600">Төрөл</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Доод үнэ (₮)</label>
                  <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="₮" className="w-full px-3 py-2 border rounded-md" inputMode="numeric" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Дээд үнэ (₮)</label>
                  <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="₮" className="w-full px-3 py-2 border rounded-md" inputMode="numeric" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 border rounded-md">
                  <option value="new">Шинэ</option>
                  <option value="priceAsc">Үнэ өсөх</option>
                  <option value="priceDesc">Үнэ буурах</option>
                </select>
                <button onClick={() => clearFilters()} className="ml-auto px-3 py-2 rounded-md border">Цэвэрлэх</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured / VIP carousel */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">Онцлох зар</h2>
          <div className="flex items-center gap-2">
            <button aria-label="Scroll featured left" onClick={() => scrollContainer(featuredRef, "left")} className="p-2 rounded-full bg-white shadow hover:shadow-md">
              <ArrowLeft size={18} />
            </button>
            <button aria-label="Scroll featured right" onClick={() => scrollContainer(featuredRef, "right")} className="p-2 rounded-full bg-white shadow hover:shadow-md">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div ref={featuredRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar" tabIndex={0}>
          {filtered.slice(0, 6).map((p) => (
            <div key={p.id} className="snap-start">
              <div className="w-[520px] min-w-[520px]">
                <PropertyCard
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  location_text={p.location_text}
                  main_image={p.main_image}
                  view_count={p.view_count}
                  image_count={p.image_count}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New listings (horizontal) */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">Шинэ зарууд</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollContainer(listRef, "left")} className="p-2 rounded-full bg-white shadow" aria-label="prev">
              <ArrowLeft size={16} />
            </button>
            <button onClick={() => scrollContainer(listRef, "right")} className="p-2 rounded-full bg-white shadow" aria-label="next">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div ref={listRef} className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar">
          {filtered.map((p) => (
            <div key={p.id} className="snap-start">
              <PropertyCard
                id={p.id}
                title={p.title}
                price={p.price}
                location_text={p.location_text}
                main_image={p.main_image}
                view_count={p.view_count}
                image_count={p.image_count}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
