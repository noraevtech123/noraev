"use client";
import React from "react";
import Image from "next/image";
import TestLink from "./TestLink";
import { triggerPreorderForm } from "@/lib/uiEvents";

const ElectricAffordable = () => {
  return (
    <div className="w-full bg-black py-16 sm:py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="w-full text-white relative flex flex-col md:flex-row justify-between min-h-[400px] sm:min-h-[500px] p-8 sm:p-12 lg:p-17 rounded-lg overflow-hidden">
          {/* Background overlay - using a dark gradient instead of image */}
          <div className="bg-gradient-to-br from-black via-gray-900 to-black opacity-90 h-full w-full absolute inset-0"></div>

          {/* Left Content */}
          <div className="flex flex-col gap-7 justify-center z-10 w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-conthrax">
              Electric Made <br /> Affordable
            </h1>
            <TestLink
              color="lime"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => triggerPreorderForm(), 500);
              }}
            >
              Pre Order
            </TestLink>
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-7 w-full md:w-[40%] items-start justify-center z-10 text-sm md:text-base lg:text-lg text-gray-200">
            <p>
              NoRa EV is designed to fit your lifestyle and your budget. With
              lower running costs and zero fuel expenses, owning an EV has never
              been this easy.
            </p>
            <Image
              src="/lime-ball-line.svg"
              alt="NoRa EV Design Element"
              width={152}
              height={152}
              className="h-24 w-2 lg:h-40 lg:w-4"
            />
            <p className="font-conthrax text-lime-400 text-lg md:text-xl lg:text-2xl">
              Starting from PKR 1.899M - 3.0M
            </p>
            <p className="text-gray-400 text-xs">(depending on variant)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricAffordable;
