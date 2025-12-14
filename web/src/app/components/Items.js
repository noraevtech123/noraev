"use client";
import { views } from "@/lib/constants";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

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
  const [isInterior, setIsInterior] = useState(false);
  const [interiorIndex, setInteriorIndex] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const exteriorRef = useRef(null);
  const interiorRef = useRef(null);
  const imageRef = useRef(null);
  const totalInteriorImages = 4;

  const getImageSrc = () => {
    if (isInterior) {
      return `/interior-${interiorIndex}.png`;
    }
    const colorName = carColors[selectedColor].name;
    const viewName = views[selectedView]?.toLowerCase() || "front";
    return `/item-car-${colorName}-${viewName}.png`;
  };

  const handlePrevInterior = () => {
    setInteriorIndex(
      (prev) => ((prev - 2 + totalInteriorImages) % totalInteriorImages) + 1
    );
  };

  const handleNextInterior = () => {
    setInteriorIndex((prev) => (prev % totalInteriorImages) + 1);
  };

  const handleZoomIn = () => {
    // Toggle between zoomed (1.5x) and normal (1x)
    const newZoom = zoomLevel === 1 ? 1.5 : 1;
    setZoomLevel(newZoom);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: newZoom,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleZoomOut = () => {
    const newZoom = 1;
    setZoomLevel(newZoom);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: newZoom,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleVideoClick = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1000); // Disappear after 1 seconds
  };

  const isColorAvailable = () => {
    // Only gray color (index 0) is available
    return selectedColor === 0;
  };

  useEffect(() => {
    if (isInterior) {
      // Animate to Interior state
      gsap.to(exteriorRef.current, {
        backgroundColor: "#000000",
        color: "#ffffff",
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(interiorRef.current, {
        backgroundColor: "#d1d5db",
        color: "#000000",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      // Animate to Exterior state
      gsap.to(exteriorRef.current, {
        backgroundColor: "#d1d5db",
        color: "#000000",
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(interiorRef.current, {
        backgroundColor: "#000000",
        color: "#ffffff",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isInterior]);

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
          <div className="flex flex-col gap-y-7 pt-0 md:pt-7 relative z-20">
            <button
              onClick={handleVideoClick}
              className="bg-gray-900 h-35 md:h-30 w-64 md:w-54 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src="/video-img.png"
                alt="NoRa EV Logo"
                width={552}
                height={552}
                className="w-full object-cover "
              />
            </button>
            {showPopup && (
              <div className="absolute top-0 left-0 right-0 bg-black text-white p-4 rounded-lg shadow-lg z-50 animate-fadeIn">
                <p className="text-sm md:text-base text-center font-semibold">
                  360 Virtual Showroom Coming Soon
                </p>
              </div>
            )}
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
            <h1 className="text-gray-400 text-[10px] sm:text-xs md:text-md"></h1>
            <h1 className="text-black text-[18px] sm:text-xl md:text-2xl lg:text-3xl font-conthrax">
              {/* <span className="text-sm md:text-lg lg:text-xl">km/h</span> */}
            </h1>
          </div>
        </div>
        <div
          className={`w-[80%] md:w-[60%] -z-10 absolute top-[30%] sm:top-[15%] lg:-top-[15%] left-1/2 -translate-x-1/2 ${
            isInterior ? "mt-[100px]  lg:mt-[150px]" : "mt-[0px]"
          }`}
        >
          {!isColorAvailable() ? (
            <div className="w-full h-full flex items-center justify-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-conthrax text-gray-400 text-center px-4 mt-[100px] md:mt-[200px] lg:mt-[300px]">
                New Variation <br />
                Coming Soon
              </h2>
            </div>
          ) : (
            <div ref={imageRef} className="w-full h-full origin-center">
              <Image
                src={getImageSrc()}
                alt="NoRa EV Car View"
                width={1000}
                height={1000}
                className="w-full md:h-full object-cover"
              />
            </div>
          )}
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
      <div className="h-[20vh] sm:h-[25vh] mt-10 sm:mt-30 w-full flex flex-col sm:flex-row justify-between items-center">
        <div className="h-14 md:h-10 lg:h-14 w-full sm:w-54 md:w-35 lg:w-55 text-md md:text-sm lg:text-md p-2 flex bg-black">
          <button
            ref={exteriorRef}
            onClick={() => setIsInterior(false)}
            className="bg-gray-300 w-1/2 h-full flex items-center justify-center cursor-pointer transition-none"
          >
            Exterior
          </button>
          <button
            ref={interiorRef}
            onClick={() => setIsInterior(true)}
            className="bg-black w-1/2 h-full flex items-center justify-center text-white cursor-pointer transition-none"
          >
            Interior
          </button>
        </div>
        <div className="flex gap-3 h-fit">
          {isInterior ? (
            <>
              <button
                onClick={handlePrevInterior}
                className="px-4 py-2 text-2xl bg-gray-200 hover:bg-gray-300 rounded-full transition-all duration-300 flex items-center justify-center w-12 h-12"
              >
                &lt;
              </button>
              <button
                onClick={handleNextInterior}
                className="px-4 py-2 text-2xl bg-gray-200 hover:bg-gray-300 rounded-full transition-all duration-300 flex items-center justify-center w-12 h-12"
              >
                &gt;
              </button>
            </>
          ) : (
            views.map((label, i) => (
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
            ))
          )}
        </div>
        <div className="hidden sm:flex gap-3 justify-end w-45">
          <button
            onClick={handleZoomIn}
            className="bg-gray-200 h-11 w-11 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
          >
            <Image
              src="/zoom1.svg"
              alt="zoom in/out"
              width={100}
              height={100}
              className="h-6  "
            />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="bg-gray-200 h-11 w-11 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/zoom2.svg"
              alt="zoom out"
              width={100}
              height={100}
              className="h-6  "
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Items;
