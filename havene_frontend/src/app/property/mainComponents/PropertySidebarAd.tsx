"use client";

import Image from "next/image";

export default function PropertySidebarAd() {
  return (
    <aside className="space-y-4">
      {/* Small banner ad */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Image
          src="/ad-small.jpg"
          alt="Ad Banner"
          width={280}
          height={150}
          className="object-cover w-full h-[150px]"
        />
      </div>

      {/* Featured Ads */}
      <div className="bg-white rounded-xl shadow-md p-3">
        <h3 className="font-semibold text-base mb-2">🌟 Онцлох зарууд</h3>
        <ul className="space-y-2 text-sm">
          <li className="border-b pb-1">
            <p className="font-medium text-gray-700 line-clamp-1">
              World Mongolia Tower 72м²
            </p>
            <p className="text-[#ABA48D] text-xs">4.5 сая ₮</p>
          </li>
          <li className="border-b pb-1">
            <p className="font-medium text-gray-700 line-clamp-1">
              Grand Plaza 84м² оффис
            </p>
            <p className="text-[#ABA48D] text-xs">5.8 сая ₮</p>
          </li>
          <li>
            <p className="font-medium text-gray-700 line-clamp-1">
              Cali Center 53м² талбай
            </p>
            <p className="text-[#ABA48D] text-xs">6.8 сая ₮</p>
          </li>
        </ul>
      </div>

      {/* Ad contact section */}
      <div className="bg-[#F6F2EB] rounded-xl text-center p-3 text-xs text-gray-600">
        Зар сурталчилгаа байршуулах уу?
        <button className="block mt-2 mx-auto bg-[#ABA48D] text-white rounded-md px-3 py-1 hover:bg-[#9b947c] transition">
          Холбоо барих
        </button>
      </div>
    </aside>
  );
}
