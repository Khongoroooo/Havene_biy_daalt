"use client";

import Image from "next/image";
import { Eye, Heart } from "lucide-react";

interface Props {
  filter: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function PropertyList({ currentPage, setCurrentPage }: Props) {
  const itemsPerPage = 6;

  const properties = [
    { id: 1, title: "River Garden 2 өрөө байр", price: "125,500,000₮", image: "/zar.jpg", views: 25 },
    { id: 2, title: "World Mongolia Tower оффис", price: "4.5 сая ₮", image: "/zar1.webp", views: 17 },
    { id: 3, title: "Grand Plaza оффис", price: "5.8 сая ₮", image: "/zar2.png", views: 32 },
    { id: 4, title: "Cali Center 53м²", price: "6.8 сая ₮", image: "/zar.jpg", views: 14 },
    { id: 5, title: "Gem Palace 63м²", price: "700 сая ₮", image: "/zar1.webp", views: 41 },
    { id: 6, title: "БГД 207м² оффис", price: "934 сая ₮", image: "/zar2.png", views: 23 },
    { id: 7, title: "Модны 2 55м²", price: "225 сая ₮", image: "/zar.jpg", views: 19 },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paged = properties.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  return (
    <div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paged.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
            <div className="relative">
              <Image
                src={p.image}
                alt={p.title}
                width={400}
                height={250}
                className="object-cover w-full h-[200px]"
              />
              <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
                <Heart size={18} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-lg font-semibold text-[#2A2A2A]">{p.price}</p>
              <p className="text-sm text-gray-700 mt-1 line-clamp-1">{p.title}</p>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>45 минутын өмнө</span>
                <div className="flex items-center gap-1">
                  <Eye size={14} /> {p.views}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg border text-sm ${
              currentPage === i + 1
                ? "bg-[#ABA48D] text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
