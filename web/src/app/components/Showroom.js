"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import ComingSoonModal from "./ComingSoonModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Showroom = () => {
  const scrollMainRef = useRef();
  const scrollTextRef = useRef();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== "undefined") {
        setIsSmallScreen(window.innerWidth < 640);
      }
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const scrollMainCurr = scrollMainRef.current;
    const scrollTextCurr = scrollTextRef.current;

    if (scrollMainCurr && scrollTextCurr) {
      // Use state for screen size check
      if (isSmallScreen) {
        // For small screens, don't apply any animation
        return;
      }

      // Set initial position for scroll text (only for larger screens)
      // gsap.set(scrollTextCurr, { y: "50vh" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollMainCurr,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing
          pin: false,
          markers: false, // Set to true for debugging
        },
      });

      // Animate the scroll text (only for larger screens)
      tl.to(scrollTextCurr, {
        y: "-70vh",
        ease: "none",
        duration: 1,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isSmallScreen]);

  return (
    <div
      ref={scrollMainRef}
      className="scroll-main h-[80vh] sm:h-[170vh] notched-small w-full  bg-black"
    >
      <div className="text-white showroom-bg h-full sm:h-[100vh] w-full sticky top-0  flex flex-col p-10 px-6 sm:px-7 md:px-14 justify-between">
        <nav className="flex justify-center sm:justify-between w-full h-20">
          <div className="h-10 lg:h-20 flex items-center">
            <Image
              src="/horizontal-logo-white.svg"
              alt="NoRa EV Logo"
              width={52}
              height={52}
              className="h-30  w-30 sm:h-22 sm:w-24 lg:h-32 lg:w-32 "
            />
          </div>
          <div className="hidden sm:block">
            <Button bgColor="lime" onClick={() => setIsComingSoonOpen(true)}>
              {" "}
              Enter Virtual Showroom
            </Button>
          </div>
        </nav>
        <div className="w-full text-white h-[400px] sm:h-[300px] mask flex flex-col items-center sm:items-start text-center sm:text-left sm:flex-row justify-between sm:mt-[200px]">
          <h1 className="font-conthrax text-sm lg:text-lg">VIRTUAL SHOWROOM</h1>
          <div
            ref={scrollTextRef}
            className="scroll-text h-[70vh] gap-y-6 mt-10 sm:gap-y-0 sm:mt-0  sm:h-[100vh] w-full sm:w-1/2 flex flex-col items-center sm:items-start sm:justify-between"
          >
            <h1 className="font-conthrax text-3xl lg:text-6xl">
              See NoRa in Your World
            </h1>
            <h1 className="hidden sm:block text-md sm:text-xl lg:text-4xl">
              Step into our virtual showroom and discover how NoRa fits
              seamlessly into your lifestyle - whether it&apos;s your commute to
              work, a campus ride, or a night out in the city
            </h1>
            <div className="block sm:hidden mt-40">
              <Button bgColor="lime" onClick={() => setIsComingSoonOpen(true)}>
                {" "}
                Enter Virtual Showroom
              </Button>
            </div>
          </div>
        </div>
        <div className="h-full w-full absolute inset-0 overflow-hidden">
          <div className="absolute right-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-white [clip-path:polygon(16%_0,_100%_0,_100%_100%,_0_100%)]"></div>
          <div className="absolute left-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-white [clip-path:polygon(0_0,_84%_0,_100%_100%,_0_100%)]"></div>
        </div>
      </div>
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
      />
    </div>
  );
};

export default Showroom;
