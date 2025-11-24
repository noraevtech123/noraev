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
        sm:items-left w-full justify-between leading-tight sm:leading-normal gap-y-10 sm:gap-y-0">
          <div className="h-full mt-2">
            <h1 className="text-gray-400 text-[10px] md:text-sm lg:text-lg font-conthrax">
              MADE FOR PAKISTAN
            </h1>
          </div>
          <div className="flex flex-col w-full items-center sm:items-start sm:w-2/3 justify-between gap-y-7">
            <p className="  text-lg md:text-3xl lg:text-[40px] lg:leading-14">
              NoRa EV is more than a car, it’s a movement. Built for our cities,
              our people, and our future. Compact, safe, and powered by
              Pakistan’s own surplus electricity, NoRa is paving the way for
              independence from costly fuel imports and polluted streets.
            </p>
            <p className="text-gray-400">
              NoRa EV is Pakistan’s first battery-swappable electric car.
              Together, we’re driving towards cleaner cities, energy
              independence, and a greener tomorrow.
            </p>
            <TestLink color="lime" onClick={triggerPreorderForm}>
              Test Drive
            </TestLink>
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
                <Image
                  className="object-cover"
                  src="/about-svg1.svg"
                  alt="Description for SVG 1"
                  layout="fill"
                  // Often better for SVGs unless you need to cover
                />
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
                <Image
                  className="object-cover"
                  src="/about-svg2.svg"
                  alt="Description for SVG 2"
                  layout="fill"
                />
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
