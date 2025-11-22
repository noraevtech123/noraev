"use client";
import { driveFeatures } from "@/lib/constants";
import gsap from "gsap";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import TestLink from "./TestLink";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const Features = () => {
  const scrollCar = useRef();
  const scrollStick = useRef();
  const frontCar = useRef();
  const backCar = useRef();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        setIsSmallScreen(window.innerWidth < 640);
      }
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const scrollCarCurr = scrollCar.current;
    const scrollStickCurr = scrollStick.current;
    const frontCarCurr = frontCar.current;
    const backCarCurr = backCar.current;
    const cars = gsap.utils.toArray(".feature-car")

    if (scrollCarCurr && scrollStickCurr && frontCarCurr && backCarCurr) {
      // Use state for screen size check
      const targetY = isSmallScreen ? "-190vh" : "-120vh";
      
      // Set initial opacity for car images
      gsap.set([frontCarCurr, backCarCurr], { opacity: 0.15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollCarCurr,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing
          pin: false,
          markers: false, // Set to true for debugging
        },
      });

      // Animate scroll stick and car opacities together
      tl.to(
        scrollStickCurr,
        {
          y: targetY,
          ease: "none",
          duration: 1,
        },
        0
      )
      .to(
        [frontCarCurr, backCarCurr],
        {
          opacity: 1,
          ease: "none",
          duration: 1,
        },
        0
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isSmallScreen]);

  return (
    <div className="h-[300vh] sm:h-[370vh]  w-full bg-black p-10">
      <div className="h-[50vh] sm:h-[70vh] w-full flex items-center">
        <div className="w-full flex sm:flex-row flex-col text-center sm:text-left  items-center  sm:items-start justify-between gap-10 sm:gap-16">
          <div className="flex flex-col gap-y-7 font-conthrax w-full sm:w-2/3">
            <h1 className="text-lime-400 text-sm sm:text-lg">SWAPPING BATTERY</h1>
            <h1 className="text-white text-2xl md:text-3xl lg:text-6xl">
              Goodbye Charging Delays. Hello 3-Minute Swaps
            </h1>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-y-7 w-full sm:w-1/3">
            <p className=" text-xs md:text-md lg:text-lg text-gray-500">
              With NoRa&apos;s robotic swapping stations you&apos;ll be back on the road
              in under 3 minutes. Stations are placed at existing petrol pumps
              across Lahore, making it effortless and accessible.
            </p>
            <TestLink color="lime">Test Drive</TestLink>
          </div>
        </div>
      </div>
      <div ref={scrollCar} className="h-[300vh] w-full">
        <div className="text-white h-[70vh] sm:h-[100vh]  w-full sticky top-0 bg-black flex items-center justify-center">
          <Image
            ref={frontCar}
            src="/front-car.png"
            alt="NoRa EV Logo"
            width={1000}
            height={1000}
            className="feature-car h-[30%] sm:h-[50%] md:h-[80%] w-fit absolute -left-10"
          />
          <Image
            ref={backCar}
            src="/back-car.png"
            alt="NoRa EV Logo"
            width={1000}
            height={1000}
            className="feature-car h-[30%] sm:h-[50%] md:h-[80%] w-fit absolute -right-10"
          />
          <div className="h-[300px] w-[300px] mask ">
            <div
              ref={scrollStick}
              className="h-[150vh]  w-[300px] z-10 flex flex-col justify-between  text-center gap-7"
            >
              {driveFeatures.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="w-full h-[250px] flex flex-col gap-3 items-center justify-center "
                  >
                    <div className="h-12 w-12 rounded-full border-[1px] border-white flex items-center justify-center mb-3">
                      0{i + 1}
                    </div>
                    <h1 className="text-lg md:text-2xl">{item.heading}</h1>

                    <p className="text-sm lg:text-md">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
