"use client";
import React from "react";
import TestLink from "./TestLink";
import Image from "next/image";
import { triggerPreorderForm } from "@/lib/uiEvents";

const About = () => {
  return (
    <div className="h-[250vh]  sm:h-[140vh] md:h-[190vh] w-full bg-white p-10 relative">
      <div className="h-[70vh] sm:h-[90vh] w-full flex items-center justify-between">
        <div
          className="flex flex-col items-center sm:items-start text-center sm:text-left sm:flex-row 
        sm:items-left w-full justify-between leading-tight sm:leading-normal gap-y-10 sm:gap-y-0"
        >
          <div className="h-full mt-2">
            <h1 className="text-gray-400 text-[10px] md:text-sm lg:text-lg font-conthrax">
              MADE FOR PAKISTAN
            </h1>
          </div>
          <div className="flex flex-col w-full items-center sm:items-start sm:w-2/3 justify-between gap-y-7">
            <p className="  text-lg md:text-3xl lg:text-[40px] lg:leading-14">
              NoRa EV is more than a car, it&apos;s a movement. Built for our
              cities, our people, and our future. Compact, safe, and powered by
              Pakistan&apos;s own surplus electricity, NoRa is paving the way
              for independence from costly fuel imports and polluted streets.
            </p>
            <p className="text-gray-400">
              NoRa EV is Pakistan&apos;s first battery-swappable electric car.
              Together, we&apos;re driving towards cleaner cities, energy
              independence, and a greener tomorrow.
            </p>
            <div className="z-20">
              <TestLink
                color="lime"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => triggerPreorderForm(), 500);
                }}
              >
                Order Now
              </TestLink>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[170vh] sm:h-[30vh] md:h-[100vh] w-full flex items-center justify-center">
        <div className="grid grid-rows-4 sm:grid-rows-1 sm:grid-cols-4 gap-3 w-full">
          {" "}
          {/* Added w-3/4 just to make it more visible */}
          {[...Array(4)].map((_, i) => (
            // aspect-square
            <div key={i} className="bg-black aspect-square relative">
              {/* Conditional rendering based on the index 'i' */}
              {i === 0 && (
                <Image
                  className="object-cover"
                  src="/nora-u-1.webp" // Assumes images are in the public directory
                  alt="Description for image 1"
                  layout="fill" // Good practice for containers with aspect-square
                  objectFit="cover" // Good practice to fill the container
                />
              )}
              {i === 1 && (
                <div className="bg-[#333333] px-6 py-8 text-white h-full w-full flex flex-col justify-between">
                  <div className="flex flex-col space-y-4">
                    <h1 className="text-4xl xl:text-5xl sm:text-sm md:text-2xl lg:text-4xl font-conthrax ">
                      200%
                    </h1>
                    <p className="text-md xl:text-lg sm:text-[7px] md:text-xs lg:text-[16px]">
                      Cheaper to run than traditional Petrol/Dieselcars.
                    </p>
                  </div>
                  <p className="text-xs xl:text-[16px] sm:text-[4px] md:text-[7px] lg:text-xs text-gray-200">
                    With no petrol stops and reduced upkeep, NoRa EV keeps your
                    running costs lighter than any conventional car.
                  </p>
                </div>
              )}
              {i === 2 && (
                <Image
                  className="object-cover"
                  src="/about-img2.png"
                  alt="Description for image 2"
                  layout="fill"
                  objectFit="cover"
                />
              )}
              {i === 3 && (
                <div className="bg-[#bfff00] px-6 py-8 text-black h-full w-full flex flex-col justify-between">
                  <div className="flex flex-col space-y-4">
                    <h1 className="text-4xl xl:text-5xl sm:text-sm md:text-2xl lg:text-4xl font-conthrax ">
                      52%
                    </h1>
                    <p className="text-md xl:text-lg sm:text-[7px] md:text-xs lg:text-[16px]">
                      Savings on lifetime costs compared to petrol bikes &
                      rickshaws.
                    </p>
                  </div>
                  <p className="text-xs xl:text-[16px] sm:text-[4px] md:text-[7px] lg:text-xs text-gray-600">
                    With no petrol stops and reduced upkeep, NoRa EV keeps your
                    running costs lighter than any conventional car.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="h-full w-full absolute inset-0 overflow-hidden">
        <div className="absolute right-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-black [clip-path:polygon(16%_0,_100%_0,_100%_100%,_0_100%)]"></div>
        <div className="absolute left-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-black [clip-path:polygon(0_0,_84%_0,_100%_100%,_0_100%)]"></div>
      </div>
    </div>
  );
};

export default About;
