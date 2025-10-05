"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  Heart,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"forSale" | "forRent">("forSale");

  const forSaleItems = [
    { left: "1 өрөө", leftCount: 2342, right: "2 өрөө", rightCount: 767 },
    { left: "1 өрөө", leftCount: 2342, right: "2 өрөө", rightCount: 767 },
    { left: "1 өрөө", leftCount: 2342, right: "2 өрөө", rightCount: 767 },
  ];

  const forRentItems = [
    {
      left: "1 өрөө түрээслүүлнэ",
      leftCount: 123,
      right: "2 өрөө түрээслүүлнэ",
      rightCount: 56,
    },
    {
      left: "1 өрөө түрээслүүлнэ",
      leftCount: 98,
      right: "2 өрөө түрээслүүлнэ",
      rightCount: 45,
    },
    {
      left: "1 өрөө түрээслүүлнэ",
      leftCount: 150,
      right: "2 өрөө түрээслүүлнэ",
      rightCount: 67,
    },
  ];

  const renderItems = (
    items: {
      left: string;
      leftCount: number;
      right: string;
      rightCount: number;
    }[]
  ) => {
    return items.map((item, index) => (
      <div
        key={index}
        className="flex justify-between items-center py-2 px-3 hover:bg-white rounded-lg"
      >
        <span className="text-gray-700">{item.left}</span>
        <span className="text-gray-600">{item.leftCount}</span>
        <span className="text-gray-700">{item.right}</span>
        <span className="text-gray-600">{item.rightCount}</span>
      </div>
    ));
  };

  return (
    <div className="overflow-y-scroll no-scrollbar">
      <div className="relative w-full h-[400px]">
        <Image src="/house.jpg" alt="cover" fill className="object-cover" />

        <div className="absolute inset-0 flex justify-center items-start mt-2.5">
          <div className="relative w-[39rem]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
              <Search size={20} />
            </div>

            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-10 h-9 rounded-3xl border placeholder-white border-gray-300 focus:outline-none"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
              <SlidersHorizontal size={20} />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex justify-center items-start mt-20">
          <div className="w-[46rem] bg-[#F6F2EB] rounded-3xl shadow-md p-6">
            <div className="flex mb-4 border-b border-gray-300">
              <button
                onClick={() => setActiveTab("forSale")}
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "forSale"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
              >
                Үл хөдлөх зарна
              </button>
              <button
                onClick={() => setActiveTab("forRent")}
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "forRent"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
              >
                Үл хөдлөх түрээслүүлнэ
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {activeTab === "forSale"
                ? renderItems(forSaleItems)
                : renderItems(forRentItems)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-3 justify-center">
        <button
          onClick={() => setOpen(true)}
          className="bg-[#ABA48D] pt-2.5 pb-2.5 px-6 text-white rounded-2xl hover:bg-gray-100 hover:text-black"
        >
          View all
        </button>
        {open && <div></div>}
      </div>

      <div className="flex mt-4 ml-8">
        <p className="text-5xl">New</p>
      </div>
      <div className="flex justify-baseline">
        <div className="relative ml-6 w-110 h-120 bg-white mt-4 mb-4 border-[#ABA48D] border-1 rounded-3xl">
          <Image
            src="/zar.jpg"
            alt="cover"
            width={500}
            height={50}
            className="object-cover h-75 rounded-t-3xl"
          />

          <div className="absolut ml-4 mt-4 flex">
            <button
              onClick={() => setLiked(!liked)}
              className=" transition-all duration-100"
            >
              <Heart
                size={24}
                className={`duration-100 transition-colors ${
                  liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-black hover:text-gray-400"
                }`}
              />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-lg font-semibold text-[#2A2A2A]">125,500,000₮</p>
            <p className="text-sm text-gray-700">
              River Garden хотхонд 2 өрөө байр зарна.
            </p>
          </div>
          <div className="mb-4 ml-4 flex justify-between">
            <p className="text-[#696969]">45m ago</p>
            <div className="mr-4 flex justify-between gap-1 text-[#696969]">
              <Eye color="#696969"></Eye>
              <p>25</p>
            </div>
          </div>
        </div>
        <div className="relative ml-6 w-110 h-120 bg-white mt-4 mb-4 border-[#ABA48D] border-1 rounded-3xl">
          <Image
            src="/zar2.png"
            alt="cover"
            width={500}
            height={50}
            className="object-cover h-75 rounded-t-3xl"
          />

          <div className="absolut ml-4 mt-4 flex">
            <button
              onClick={() => setLiked(!liked)}
              className=" transition-all duration-100"
            >
              <Heart
                size={24}
                className={`duration-100 transition-colors ${
                  liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-black hover:text-gray-400"
                }`}
              />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-lg font-semibold text-[#2A2A2A]">125,500,000₮</p>
            <p className="text-sm text-gray-700">
              River Garden хотхонд 2 өрөө байр зарна.
            </p>
          </div>
          <div className="mb-4 ml-4 flex justify-between">
            <p className="text-[#696969]">45m ago</p>
            <div className="mr-4 flex justify-between gap-1 text-[#696969]">
              <Eye color="#696969"></Eye>
              <p>25</p>
            </div>
          </div>
        </div>
        <div className="relative ml-6 w-110 h-120 bg-white mt-4 mb-4 border-[#ABA48D] border-1 rounded-3xl">
          <Image
            src="/zar1.webp"
            alt="cover"
            width={500}
            height={50}
            className="object-cover h-75 rounded-t-3xl"
          />

          <div className="absolut ml-4 mt-4 flex">
            <button
              onClick={() => setLiked(!liked)}
              className=" transition-all duration-100"
            >
              <Heart
                size={24}
                className={`duration-100 transition-colors ${
                  liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-black hover:text-gray-400"
                }`}
              />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-lg font-semibold text-[#2A2A2A]">125,500,000₮</p>
            <p className="text-sm text-gray-700">
              River Garden хотхонд 2 өрөө байр зарна.
            </p>
          </div>
          <div className="mb-4 ml-4 flex justify-between">
            <p className="text-[#696969]">45m ago</p>
            <div className="mr-4 flex justify-between gap-1 text-[#696969]">
              <Eye color="#696969"></Eye>
              <p>25</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="absolute bg-black rounded-full p-2 shadow-md z-10"
        >
          <ArrowRight size={24} color="white" />
        </button>
      </div>
    </div>
  );
};

export default Home;
