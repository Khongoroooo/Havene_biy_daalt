"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const Home = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
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
          <div className="w-[46rem] h-59 bg-[#F6F2EB] rounded-3xl"></div>
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
      <div className="flex mt-4">
        <p className="text-5xl">New</p>
      </div>
      <div className="w-40 h-40 bg-amber-500"></div>
    </div>
  );
};

export default Home;
