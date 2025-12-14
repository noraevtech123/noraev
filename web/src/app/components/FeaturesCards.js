"use client";
import React, { useRef, useState, useEffect } from "react";
import { features } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeaturesCards = () => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollability = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      setCanScrollLeft(carousel.scrollLeft > 0);
      setCanScrollRight(
        carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 10
      );

      // Calculate active index based on scroll position
      const cardWidth =
        carousel.querySelector(".feature-card")?.offsetWidth || 300;
      const gap = 24;
      const scrollPos = carousel.scrollLeft;
      const newIndex = Math.round(scrollPos / (cardWidth + gap));
      setActiveIndex(Math.min(newIndex, features.length - 1));
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollability);
      checkScrollability();
      window.addEventListener("resize", checkScrollability);
      return () => {
        carousel.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, []);

  const scroll = (direction) => {
    const carousel = carouselRef.current;
    if (carousel) {
      const cardWidth =
        carousel.querySelector(".feature-card")?.offsetWidth || 300;
      const scrollAmount = cardWidth + 24;
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToIndex = (index) => {
    const carousel = carouselRef.current;
    if (carousel) {
      const cardWidth =
        carousel.querySelector(".feature-card")?.offsetWidth || 300;
      const scrollAmount = (cardWidth + 24) * index;
      carousel.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-white py-16 sm:py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h2 className="text-lime-500 text-xs sm:text-sm lg:text-base font-conthrax mb-3">
            WHY CHOOSE NORA
          </h2>
          <h3 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-conthrax">
            Features That Set Us Apart
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`
              w-12 h-12 rounded-full border-2 flex items-center justify-center
              transition-all duration-300
              ${
                canScrollLeft
                  ? "border-black text-black hover:bg-black hover:text-white cursor-pointer"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }
            `}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`
              w-12 h-12 rounded-full border-2 flex items-center justify-center
              transition-all duration-300
              ${
                canScrollRight
                  ? "border-black text-black hover:bg-black hover:text-white cursor-pointer"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }
            `}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[350px] 
                         bg-gray-100 p-6 sm:p-8 flex flex-col justify-center gap-3 
                         transition-all duration-300 hover:bg-gray-200 hover:shadow-lg"
              style={{ scrollSnapAlign: "start" }}
            >
              <h3 className="font-conthrax text-base sm:text-lg lg:text-xl text-black">
                {feature.heading}
              </h3>
              <p className="text-gray-600 text-sm lg:text-base">
                {feature.para}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${
                  index === activeIndex
                    ? "bg-lime-500 w-4"
                    : "bg-gray-300 hover:bg-lime-400"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesCards;
