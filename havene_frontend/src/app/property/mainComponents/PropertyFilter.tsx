"use client";

import { Search } from "lucide-react";

interface Props {
  filter: {
    search: string;
    category: string;
    priceRange: string;
  };
  setFilter: (val: any) => void;
}

export default function PropertyFilter({ filter, setFilter }: Props) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-1/2">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Хайлт хийх..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#ABA48D] outline-none"
        />
      </div>

      <select
        value={filter.category}
        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        className="w-full md:w-auto px-4 py-2 border rounded-xl"
      >
        <option value="all">Бүх төрөл</option>
        <option value="apartment">Орон сууц</option>
        <option value="office">Оффис</option>
        <option value="house">Хашаа байшин</option>
      </select>

      <select
        value={filter.priceRange}
        onChange={(e) => setFilter({ ...filter, priceRange: e.target.value })}
        className="w-full md:w-auto px-4 py-2 border rounded-xl"
      >
        <option value="all">Үнэ — бүгд</option>
        <option value="0-100">0 - 100 сая ₮</option>
        <option value="100-300">100 - 300 сая ₮</option>
        <option value="300+">300 сая ₮ дээш</option>
      </select>
    </div>
  );
}
