"use client";

import Image from "next/image";
import PropertyCard from "../components/PropertyCard";
import React, { useRef, useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Search, SlidersHorizontal, Funnel, X } from "lucide-react";

/** Types */
type Property = {
  id: number;
  title: string;
  price: string;
  priceNumber?: number;
  location_text: string;
  main_image: string;
  view_count?: number;
  image_count?: number;
  created_at?: string;
  property_type?: string;
  area_size?: number;
};

/** Mock Data */
const mockProperties: Property[] = [
  { id:1, title:"Модны-2 World Mongolia Tower-т оффис өрөө", price:"125,500,000₮", priceNumber:125500000, location_text:"УБ — Баянгол, Хороо 17", main_image:"/zar.jpg", view_count:5, image_count:6, property_type:"Оффис", area_size:25 },
  { id:2, title:"Grand Plaza-д оффисын талбай", price:"600,000,000₮", priceNumber:600000000, location_text:"УБ — Баянгол, Баруун 4 зам", main_image:"/zar2.png", view_count:25, image_count:3, property_type:"Оффис", area_size:120 },
  { id:3, title:"World Mongolia Tower 25м² 1 өрөө үйлчилгээний талбай", price:"112,500,000₮", priceNumber:112500000, location_text:"УБ — Баянгол, Модны 2", main_image:"/zar1.webp", view_count:15, image_count:4, property_type:"Оффис", area_size:25 },
  { id:4, title:"Cali center-т оффис 53мк талбай", price:"6,800,000₮", priceNumber:6800000, location_text:"УБ — Баянгол, Хороо 24", main_image:"/zar2.png", view_count:10, image_count:2, property_type:"Оффис", area_size:53 },
  { id:5, title:"Grand plaza 122.9 мкв оффис", price:"1,380,000,000₮", priceNumber:1380000000, location_text:"УБ — Баянгол, Баруун 4 зам", main_image:"/zar.jpg", view_count:8, image_count:5, property_type:"Оффис", area_size:122.9 },
];

const DISTRICTS = ["Бүгд","Сүхбаатар","Хан-Уул","Баянзүрх","Баянгол","Сонгинохайрхан"];
const PROPERTY_TYPES = ["Бүгд","Орон сууц","Оффис","Газар","Хаус"];

export default function Page() {
  /** Refs */
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  /** Filters */
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("Бүгд");
  const [selectedType, setSelectedType] = useState("Бүгд");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [sortBy, setSortBy] = useState<"new"|"priceAsc"|"priceDesc">("new");
  const [filtersOpen, setFiltersOpen] = useState(false);

  /** Parse helpers */
  const parsePrice = (p?: string|number) => {
    if(typeof p==="number") return p;
    if(!p) return 0;
    const digits = p.toString().replace(/[^\d]/g,"");
    return digits ? parseInt(digits,10):0;
  };
  const parseArea = (a?: string|number) => {
    if(typeof a==="number") return a;
    if(!a) return 0;
    const digits = a.toString().replace(/[^\d.]/g,"");
    return digits ? parseFloat(digits) : 0;
  };

  /** Filtered & sorted */
  const filtered = useMemo(()=>{
    let items = mockProperties.slice();

    if(query.trim()){
      const q = query.toLowerCase();
      items = items.filter(it=>it.title.toLowerCase().includes(q) || it.location_text.toLowerCase().includes(q));
    }
    if(selectedDistrict!=="Бүгд") items = items.filter(it=>it.location_text.toLowerCase().includes(selectedDistrict.toLowerCase()));
    if(selectedType!=="Бүгд") items = items.filter(it=>(it.property_type??"").toLowerCase()===selectedType.toLowerCase());

    const minN = parsePrice(minPrice) || undefined;
    const maxN = parsePrice(maxPrice) || undefined;
    if(minN!==undefined) items = items.filter(it=>(it.priceNumber??parsePrice(it.price))>=minN);
    if(maxN!==undefined) items = items.filter(it=>(it.priceNumber??parsePrice(it.price))<=maxN);

    const minA = minArea ? parseArea(minArea):undefined;
    const maxA = maxArea ? parseArea(maxArea):undefined;
    if(minA!==undefined) items = items.filter(it=>(it.area_size??0)>=minA);
    if(maxA!==undefined) items = items.filter(it=>(it.area_size??0)<=maxA);

    if(sortBy==="priceAsc") items.sort((a,b)=>(a.priceNumber??parsePrice(a.price))-(b.priceNumber??parsePrice(b.price)));
    else if(sortBy==="priceDesc") items.sort((a,b)=>(b.priceNumber??parsePrice(b.price))-(a.priceNumber??parsePrice(a.price)));
    else items.sort((a,b)=>b.id-a.id);

    return items;
  },[query,selectedDistrict,selectedType,minPrice,maxPrice,minArea,maxArea,sortBy]);

  /** Scroll helpers */
  const scrollContainer = (ref:React.RefObject<HTMLDivElement|null>, dir:"left"|"right")=>{
    if(!ref.current) return;
    const width = ref.current.clientWidth;
    const amount = Math.floor(width*0.75);
    ref.current.scrollBy({left:dir==="left"?-amount:amount,behavior:"smooth"});
  };

  const clearFilters = ()=>{
    setQuery(""); setSelectedDistrict("Бүгд"); setSelectedType("Бүгд");
    setMinPrice(""); setMaxPrice(""); setMinArea(""); setMaxArea("");
    setSortBy("new");
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <div className="relative w-full h-[480px] md:h-[550px]">
        <Image src="/house.jpg" alt="cover" fill className="object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10"/>
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 px-4">
          <h1 className="text-3xl md:text-5xl font-semibold text-white drop-shadow-lg text-center">Үл хөдлөх – Хайх, үзэх, нэмэх</h1>
          <p className="text-white/80 mt-2 mb-6 text-center md:text-lg">Зар, түрээс, худалдаа — бүгд нэг дор</p>

          {/* Search + Filters */}
          <div className="relative w-full max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/90 pointer-events-none">
                <Search size={20}/>
              </div>
              <input
                value={query}
                onChange={e=>setQuery(e.target.value)}
                placeholder="Жишээ: байр, дүүрэг, үнэ (жишээ: 2 өрөө Баянгол)"
                className="w-full h-12 md:h-14 pl-12 pr-12 rounded-full bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-[#ABA48D] shadow-md transition"
              />
              <div className="absolute right-12 top-1/2 -translate-y-1/2 text-white/90 pointer-events-none">
                <SlidersHorizontal size={20}/>
              </div>
            </div>

            <button onClick={()=>setFiltersOpen(s=>!s)} className="md:hidden flex items-center gap-2 bg-white px-3 rounded-full shadow hover:shadow-md transition">
              <Funnel size={18}/>
              <span className="text-sm font-medium">Шүүлт</span>
            </button>

            <button className="hidden md:flex items-center gap-2 bg-[#ABA48D] text-white px-4 py-2 rounded-full shadow hover:bg-[#958d76] transition">
              Хайх
            </button>
          </div>

          {/* Desktop filters */}
          <div className="hidden md:flex gap-3 mt-6 bg-white/90 rounded-2xl p-4 shadow-lg items-center">
            <select value={selectedDistrict} onChange={e=>setSelectedDistrict(e.target.value)} className="px-3 py-2 rounded-md border">{DISTRICTS.map(d=><option key={d}>{d}</option>)}</select>
            <select value={selectedType} onChange={e=>setSelectedType(e.target.value)} className="px-3 py-2 rounded-md border">{PROPERTY_TYPES.map(t=><option key={t}>{t}</option>)}</select>
            <input value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Доод үнэ (₮)" className="w-32 px-3 py-2 rounded-md border text-sm" inputMode="numeric"/>
            <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Дээд үнэ (₮)" className="w-32 px-3 py-2 rounded-md border text-sm" inputMode="numeric"/>
            <input value={minArea} onChange={e=>setMinArea(e.target.value)} placeholder="Доод талбай (м²)" className="w-28 px-3 py-2 rounded-md border text-sm" inputMode="numeric"/>
            <input value={maxArea} onChange={e=>setMaxArea(e.target.value)} placeholder="Дээд талбай (м²)" className="w-28 px-3 py-2 rounded-md border text-sm" inputMode="numeric"/>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="px-3 py-2 rounded-md border ml-auto">
              <option value="new">Шинэ</option>
              <option value="priceAsc">Үнэ өсөх</option>
              <option value="priceDesc">Үнэ буурах</option>
            </select>
            <button onClick={clearFilters} className="px-3 py-2 rounded-md border text-sm hover:bg-gray-100 transition">Цэвэрлэх</button>
          </div>
        </div>
      </div>

      {/* Mobile filters panel */}
      {filtersOpen && (
        <div className="md:hidden max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-gray-800">Шүүлт</div>
              <button onClick={()=>setFiltersOpen(false)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              <select value={selectedDistrict} onChange={e=>setSelectedDistrict(e.target.value)} className="w-full px-3 py-2 border rounded-md">{DISTRICTS.map(d=><option key={d}>{d}</option>)}</select>
              <select value={selectedType} onChange={e=>setSelectedType(e.target.value)} className="w-full px-3 py-2 border rounded-md">{PROPERTY_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              <div className="grid grid-cols-2 gap-2">
                <input value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Доод үнэ (₮)" className="w-full px-3 py-2 border rounded-md" inputMode="numeric"/>
                <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Дээд үнэ (₮)" className="w-full px-3 py-2 border rounded-md" inputMode="numeric"/>
                <input value={minArea} onChange={e=>setMinArea(e.target.value)} placeholder="Доод талбай (м²)" className="w-full px-3 py-2 border rounded-md" inputMode="numeric"/>
                <input value={maxArea} onChange={e=>setMaxArea(e.target.value)} placeholder="Дээд талбай (м²)" className="w-full px-3 py-2 border rounded-md" inputMode="numeric"/>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="px-3 py-2 border rounded-md flex-1">
                  <option value="new">Шинэ</option>
                  <option value="priceAsc">Үнэ өсөх</option>
                  <option value="priceDesc">Үнэ буурах</option>
                </select>
                <button onClick={clearFilters} className="px-3 py-2 rounded-md border hover:bg-gray-100 transition">Цэвэрлэх</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Listings */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Онцлох зар</h2>
          <div className="flex gap-2">
            <button onClick={()=>scrollContainer(featuredRef,"left")} className="p-2 rounded-full bg-white shadow hover:shadow-md transition"><ArrowLeft size={18}/></button>
            <button onClick={()=>scrollContainer(featuredRef,"right")} className="p-2 rounded-full bg-white shadow hover:shadow-md transition"><ArrowRight size={18}/></button>
          </div>
        </div>
        <div ref={featuredRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
          {filtered.slice(0,6).map(p=>(
            <div key={p.id} className="snap-start w-[520px] min-w-[520px]">
              <PropertyCard {...p}/>
            </div>
          ))}
        </div>
      </section>

      {/* New Listings */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Шинэ зарууд</h2>
          <div className="flex gap-2">
            <button onClick={()=>scrollContainer(listRef,"left")} className="p-2 rounded-full bg-white shadow hover:shadow-md transition"><ArrowLeft size={18}/></button>
            <button onClick={()=>scrollContainer(listRef,"right")} className="p-2 rounded-full bg-white shadow hover:shadow-md transition"><ArrowRight size={18}/></button>
          </div>
        </div>
        <div ref={listRef} className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar">
          {filtered.map(p=>(
            <div key={p.id} className="snap-start w-[280px] min-w-[280px]">
              <PropertyCard {...p}/>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10 mb-12 flex justify-center">
        <button className="bg-[#ABA48D] text-white px-6 py-3 rounded-full shadow hover:bg-[#958d76] transition font-medium">
          Зар оруулах
        </button>
      </div>
    </div>
  );
}
