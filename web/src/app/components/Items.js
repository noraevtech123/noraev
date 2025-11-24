"use client";
import { views } from "@/lib/constants";
import Image from "next/image";
import React, { useState } from "react";

const carImages = [
  "/item-car-gray.png",
  "/item-car-back.png",
  "/item-car-side.png",
  "/item-car-top.png",
  "/item-car-side.png",
  "/item-car-top.png",
];

const carColors = [
  { name: "gray", bgColor: "bg-gray-400" },
  { name: "pink", bgColor: "bg-pink-500" },
  { name: "black", bgColor: "bg-black" },
  { name: "green", bgColor: "bg-green-500" },
];

const Items = () => {
  const [selectedView, setSelectedView] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  const getImageSrc = () => {
    const colorName = carColors[selectedColor].name;
    const viewName = views[selectedView]?.toLowerCase() || "front";
    return `/item-car-${colorName}-${viewName}.png`;
  };

  return (
    <div className="h-[120vh]  sm:h-[180vh] md:h-[120vh] lg:h-[150vh] w-full p-5 md:p-10 flex flex-col justify-between">
      <div className="w-full h-[35vh] flex justify-between">
        <div className="w-full flex flex-col md:flex-row items-center justify-between relative gap-16">
          <div className="h-fit w-full absolute -top-5">
                    <Image
                      src="/items-opacity-header.svg"
                      alt="NoRa EV Logo"
                      width={1002}
                      height={1002}
                      className=" w-full  "
                    />
                  </div>
          <div className="flex flex-col gap-y-2 mt-10 md:mt-0 md:gap-y-7 items-center md:items-start md:items-left font-conthrax w-full md:w-2/3">
            <h1 className="text-lime-400 text-lg">360 VIEW</h1>
            <h1 className="text-black text-center md:text-left text-[25px] md:text-2xl lg:text-6xl">
              Explore NoRa From <br />
              Every Angle
            </h1>
          </div>
          <div className="flex flex-col gap-y-7 pt-0 md:pt-7">
            <div className="bg-gray-900 h-35 md:h-30 w-64 md:w-54">
              <Image
                src="/video-img.png"
                alt="NoRa EV Logo"
                width={552}
                height={552}
                className="w-full object-cover "
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[80vh] sm:h-[120vh] lg:h-[95vh] w-full flex flex-col md:flex-row items-center  relative justify-between">
        <div className="flex mt-35 sm:mt-20 md:mt-0  md:flex-col justify-between w-full md:w-[15%] md:gap-16 lg:gap-20">
          <div className="flex flex-col gap-2 ">
            <h1 className="text-gray-400 text-[10px] sm:text-xs md:text-md">
              Top Speed
            </h1>
            <h1 className="text-black text-[18px] sm:text-xl md:text-2xl lg:text-3xl font-conthrax">
              65 <span className="text-sm md:text-lg lg:text-xl">km/h</span>
            </h1>
          </div>
          <div className="flex flex-col gap-2 ">
            <h1 className="text-gray-400 text-[10px] sm:text-xs md:text-md">
   
            </h1>
            <h1 className="text-black text-[18px] sm:text-xl md:text-2xl lg:text-3xl font-conthrax">
            {/* <span className="text-sm md:text-lg lg:text-xl">km/h</span> */}
            </h1>
          </div>
        </div>
        <div className="w-[80%] md:w-[60%] -z-10 absolute top-[30%] sm:top-[15%]  lg:-top-[15%] left-1/2 -translate-x-1/2">
          <Image
            src={getImageSrc()}
            alt="NoRa EV Car View"
            width={1000}
            height={1000}
            className="w-full md:h-full object-cover transition-all duration-500"
          />
        </div>
        <div className="flex  bullets md:flex-col gap-5">
          {carColors.map((color, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(i)}
              className={`h-5 w-5 rounded-full transition-all duration-300 ${
                color.bgColor
              } ${
                selectedColor === i
                  ? "ring-2 ring-offset-2 ring-black scale-110"
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="h-[25vh] mt-0 sm:mt-30 w-full flex justify-between items-center">
        <div className="h-14 md:h-10 lg:h-14 w-full sm:w-54 md:w-35 lg:w-55 text-md md:text-sm lg:text-md p-2 flex bg-black">
          <div className="bg-gray-300 w-1/2 h-full flex items-center justify-center">
            Exterior
          </div>
          <div className="bg-black w-1/2 h-full flex items-center justify-center text-white">
            Interior
          </div>
        </div>
        <div className="hidden md:flex gap-3 h-fit">
          {views.map((label, i) => (
            <button
              key={i}
              onClick={() => setSelectedView(i)}
              className={`px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-lg rounded-full transition-all duration-300 ${
                selectedView === i
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="hidden sm:flex gap-3 justify-end w-45">
          <div className="bg-gray-200 h-11 w-11 rounded-full flex items-center justify-center">
            <Image
              src="/zoom1.svg"
              alt="NoRa EV Logo"
              width={100}
              height={100}
              className="h-6  "
            />
          </div>
          <div className="bg-gray-200 h-11 w-11 rounded-full flex items-center justify-center">
            <Image
              src="/zoom2.svg"
              alt="NoRa EV Logo"
              width={100}
              height={100}
              className="h-6  "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
