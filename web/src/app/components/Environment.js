"use client";
import Image from "next/image";
import React, { useRef } from "react";
import TestLink from "./TestLink";
import { triggerPreorderForm } from "@/lib/uiEvents";

const environmentData = [
  {
    heading: "Reduce Imports",
    description:
      "Pakistan spends billions every year on oil imports. By switching to NoRa EV, we can cut down this heavy fuel dependency and keep our money flowing inside the country.",
  },
  {
    heading: "Cleaner Air",
    description:
      "Pakistan spends billions every year on oil imports. By switching to NoRa EV, we can cut down this heavy fuel dependency and keep our money flowing inside the country.",
  },
  {
    heading: "Economic Growth",
    description:
      "Electric vehicles create new job opportunities and boost local manufacturing, contributing to sustainable economic development in Pakistan.",
  },
];

const Environment = () => {
  const scrollRef = useRef(null);

  const handleMouseDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;

    let isDown = true;
    let startX = e.pageX - container.offsetLeft;
    let scrollLeft = container.scrollLeft;

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDown = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-[140vh] md:h-[145vh] relative w-full enviro-bg overflow-x-hidden p-10 flex flex-col justify-between ">
      <div className="w-full h-[65vh] flex items-center justify-between">
        <div className="w-full flex flex-col sm:flex-row items-center text-center sm:text-left sm:items-start justify-between gap-6 sm:gap-16">
          <div className="text-white flex flex-col items-center sm:items-start gap-y-5 sm:gap-y-10 font-conthrax w-full sm:w-2/3">
            <h1 className="text-[10px] lg:text-lg">SUSTAINABILITY VALUES</h1>
            <div className="text-2xl sm:text-xl md:text-3xl lg:text-6xl  ">
              Driving Towards
              <br />   
              <div className="flex whitespace-pre sm:whitespace-normal">
                <span className="block sm:hidden opacity-0">.</span>   a Cleaner  
                
                <div className="w-16 sm:w-14 md:w-17  lg:w-30 ml-2 lg:ml-5    rounded-full ">
                  <Image
                    src="/enviro-rounded.png"
                    alt="NoRa EV Logo"
                    width={252}
                    height={252}
                    className="w-full  "
                  />
                </div>
              </div>
              Pakistan
            </div>
            <TestLink color="white" onClick={triggerPreorderForm}>
              Pre Book
            </TestLink>
          </div>
          <div className="flex flex-col gap-y-7 pt-7">
            <div className="bg-white h-40 md:h-60 w-50 md:w-75 p-8 flex flex-col justify-between">
              <Image
                src="/horizontal-logo.svg"
                alt="NoRa EV Logo"
                width={52}
                height={52}
                className="h-8 w-14 md:h-10 md:w-25 "
              />

              <p className="text-gray-700 text-[9px] mt-3 md:mt-0 md:text-[14px]">
                NoRa EV isn’t just about mobility — it’s about responsibility.
                Together, we can cut smog, reduce oil imports, and power our
                journeys with local energy.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        className=" w-full h-[70vh] sm:h-[45vh] sm:w-[150vw] items-center sm:items-end flex flex-col sm:flex-row gap-10 sm:overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {environmentData.map((item, i) => (
          <div
            key={i}
            className="w-[340px] sm:w-[600px] md:w-[500px] h-[240px] sm:h-[120px] md:h-[220px] p-4 flex  relative overflow-hidden border-[1px] backdrop-blur-sm border-white/40"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="h-full aspect-square hero-bg"></div>

            <div className="relative z-10 p-4 sm:p-2 lg:p-8 h-full flex flex-col justify-center text-white">
              <h2 className="text-[16px] sm:text-[10px] sm:leading-0 md:leading-tight md:text-[23px] mb-4">
                {item.heading}
              </h2>
              <div className=" bg-white w-full min-h-[0.5px] lg:min-h-[1px] opacity-30"></div>
              <p className="text-[7px] sm:text-[7px] md:text-xs leading-relaxed mt-3 md:mt-5  opacity-90">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="h-full w-full absolute inset-0 overflow-hidden">
        <div className="absolute right-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-black [clip-path:polygon(16%_0,_100%_0,_100%_100%,_0_100%)]"></div>
        <div className="absolute left-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-black [clip-path:polygon(0_0,_84%_0,_100%_100%,_0_100%)]"></div>
      </div>
    </div>
  );
};

export default Environment;
