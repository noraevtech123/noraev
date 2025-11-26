"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "./Button";
import CustomerSupport from "./CustomerSupport";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { features } from "@/lib/constants";
import TestLink from "./TestLink";
import { PREORDER_EVENT } from "@/lib/uiEvents";
import { Phone } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Hero = () => {
  const scrollContRef = useRef(null);
  const heroMainRef = useRef(null);
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [preOrderData, setPreOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [preOrderStatus, setPreOrderStatus] = useState({
    submitting: false,
    success: false,
    error: "",
  });

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

  // Form animation functions
  const showFormAnimation = useCallback(() => {
    const form = formRef.current;
    if (form) {
      // Lock scroll by disabling all ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.disable());

      // Animate to slide in from right (from 100% to 0%)
      gsap.to(form, {
        x: "-100%",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  const hideFormAnimation = useCallback(() => {
    const form = formRef.current;
    if (form) {
      // Animate to slide out to the right (from current position to 100%)
      gsap.to(form, {
        x: "0%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          // Unlock scroll by re-enabling ScrollTriggers
          if (window) {
            window.scrollTo(0, 0);
          }
          ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
        },
      });
    }
  }, []);

  const openPreOrderForm = useCallback(() => {
    setPreOrderStatus({ submitting: false, success: false, error: "" });
    showFormAnimation();
  }, [showFormAnimation]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => openPreOrderForm();
    window.addEventListener(PREORDER_EVENT, handler);
    return () => window.removeEventListener(PREORDER_EVENT, handler);
  }, [openPreOrderForm]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setPreOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreOrderSubmit = async (event) => {
    event.preventDefault();

    if (!API_BASE_URL) {
      setPreOrderStatus({
        submitting: false,
        success: false,
        error:
          "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL.",
      });
      return;
    }

    setPreOrderStatus({ submitting: true, success: false, error: "" });

    const payload = {
      name: preOrderData.name.trim(),
      email: preOrderData.email.trim(),
      phone: preOrderData.phone.trim(),
      city: preOrderData.city.trim(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/pre-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Failed to submit pre-order";
        try {
          const body = await response.json();
          if (Array.isArray(body?.detail)) {
            message = body.detail
              .map((item) => item.msg || JSON.stringify(item))
              .join(", ");
          } else if (typeof body?.detail === "string") {
            message = body.detail;
          } else if (body?.message) {
            message = body.message;
          }
        } catch {
          // ignore JSON parsing errors
        }
        throw new Error(message);
      }

      setPreOrderStatus({ submitting: false, success: true, error: "" });
      setPreOrderData({ name: "", email: "", phone: "", city: "" });
      setTimeout(() => {
        hideFormAnimation();
        setPreOrderStatus((prev) => ({ ...prev, success: false }));
      }, 1500);
    } catch (error) {
      setPreOrderStatus({
        submitting: false,
        success: false,
        error: error.message || "Failed to submit pre-order",
      });
    }
  };

  useEffect(() => {
    const scrollCont = scrollContRef.current;
    const heroMain = heroMainRef.current;
    const hero = heroRef.current;

    if (scrollCont && heroMain && hero) {
      // Use state for screen size check
      const targetX = isSmallScreen ? "-610vw" : "-250vw";

      gsap.set(scrollCont, { x: "100vw" }); // Start position: completely off-screen to the left

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroMain,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing
          pin: false,
          markers: false, // Set to true for debugging
        },
      });

      // Animate with responsive target position
      tl.to(
        scrollCont,
        {
          x: targetX,
          ease: "none",
          duration: 1,
        },
        0
      ).to(
        hero,
        {
          filter: "blur(12px)",
          ease: "none",
          duration: 0.3,
        },
        0
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isSmallScreen]);

  return (
    <>
      <div ref={heroMainRef} className="hero-main h-[400vh] w-full ">
        <div className="h-screen w-full  sticky top-0  overflow-hidden">
          <div
            ref={heroRef}
            className="hero z-0 h-[100vh]  mask overflow-hidden flex flex-col justify-between py-4 lg:py-6 px-4 lg:px-12 hero-responsive w-screen relative"
          >
            <nav className="flex pr-5 md:pr-0 justify-between h-10 lg:h-20 overflow-hidden">
              <div className="h-10 lg:h-20 flex items-center">
                <Image
                  src="/horizontal-logo.svg"
                  alt="NoRa EV Logo"
                  width={52}
                  height={52}
                  className="h-22 w-24 lg:h-32 lg:w-32 "
                />
              </div>
              <div className="z-20 flex gap-2 md:gap-3">
                <Button onClick={() => setIsSupportModalOpen(true)}>
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button onClick={openPreOrderForm}>Pre-Order</Button>
              </div>
            </nav>

            <div className="h-[50%] items-center sm:items-start text-center sm:text-left w-full flex flex-col gap-y-6">
              <h1 className="font-conthrax text-3xl sm:text-3xl md:text-4xl lg:text-6xl">
                NoRa EV - Nayi <br></br>Soch, Naya Safar
              </h1>
              <p className="text-gray-600 text-[9px] sm:text-[10px] lg:text-lg">
                Pakistan's first battery-swappable electric car. Affordable,
                <br /> stylish, and ready to change the way we move.
              </p>
              <div className="z-20">
                <TestLink onClick={openPreOrderForm}>Test Drive</TestLink>
              </div>
              
            </div>
            <div className=" h-[17%] sm:h-[20%] w-full flex  flex-col-reverse sm:flex-row justify-between items-center mb-7">
              <div
                className="h-[50%] sm:h-[76%] lg:h-[84%] w-[80%] sm:w-[40%] lg:w-[27%]  p-1.5 lg:p-3.5 flex"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <div className="h-full aspect-square hero-bg"></div>
                <div className="flex flex-col justify-center gap-2 sm:gap-1 lg:gap-2 p-4 sm:p-2 lg:p-5">
                  <h1 className="text-black text-[10px] sm:text-[6px] lg:text-[13px] font-conthrax uppercase">
                    Sustainability
                  </h1>
                  <div className=" bg-black w-full min-h-[0.5px] lg:min-h-[1px] opacity-20"></div>
                  <p className="text-gray-700 text-[8px] sm:text-[4px] lg:text-[14px]">
                    Driving Towards a Cleaner Pakistan
                  </p>
                </div>
              </div>

              <div className="h-[25%] sm:h-[30%] lg:h-[40%] w-[200px]  sm:w-[180px] lg:w-[300px] relative  flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-full w-full sm:w-[75%]  bg-black">
                    <Image
                      src="/hero-mini-img.png"
                      alt="NoRa EV Logo"
                      width={152}
                      height={152}
                      className="w-full object-cover "
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-full w-full absolute inset-0 overflow-hidden">
              <div className="absolute right-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-white [clip-path:polygon(16%_0,_100%_0,_100%_100%,_0_100%)]"></div>
              <div className="absolute left-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-white [clip-path:polygon(0_0,_84%_0,_100%_100%,_0_100%)]"></div>
            </div>
          </div>
          <div
            ref={scrollContRef}
            className="scroll-cont h-screen w-[700vw] sm:w-[350vw] flex  absolute inset-0 z-20 
                        "
          >
            <div
              className="form w-[77vw] h-full fixed opacity-0"
              ref={formRef}
              style={{ transform: "translateX(100%)" }}
            >
              <div className="bg-black opacity-85 h-full w-full absolute  z-0"></div>
              <div className="w-full h-full relative z-10 p-6 sm:p-10 flex flex-col overflow-hidden">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setPreOrderStatus({
                      submitting: false,
                      success: false,
                      error: "",
                    });
                    hideFormAnimation();
                  }}
                  className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-20"
                >
                  <span className="text-sm">Cancel</span>
                  <span className="ml-2 text-lg">×</span>
                </button>

                {/* Form Header */}
                <div className="flex flex-col text-white mb-8 mt-14 sm:mt-0">
                  <h1 className="font-conthrax text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">
                    NoRa EV - Nayi <br></br>Soch, Naya Safar
                  </h1>
                  <p className="text-gray-300 text-[9px] sm:text-[10px] lg:text-[17px]">
                    Pakistan&apos;s first battery-swappable electric car.
                    Affordable,
                    <br /> stylish, and ready to change the way we move.
                  </p>
                </div>

                {/* Form */}
                <form
                  className="flex flex-col sm:flex-1"
                  onSubmit={handlePreOrderSubmit}
                >
                  <div className="text-inputs space-y-10 sm:space-y-17 pb-6 overflow-y-auto pr-1 flex-1">
                    {/* First Row - Two inputs side by side */}
                    <div className="flex flex-col sm:flex-row space-y-13 sm:space-y-0 sm:gap-4">
                      <div className="flex-1">
                        <label className="block text-white text-sm mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={preOrderData.name}
                          onChange={handleInputChange("name")}
                          required
                          className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-white text-sm mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={preOrderData.email}
                          onChange={handleInputChange("email")}
                          required
                          className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Second Row - Single input */}
                    <div>
                      <label className="block text-white text-sm mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={preOrderData.phone}
                        onChange={handleInputChange("phone")}
                        required
                        className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Third Row - Single input */}
                    <div>
                      <label className="block text-white text-sm mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your city"
                        value={preOrderData.city}
                        onChange={handleInputChange("city")}
                        required
                        className="w-full bg-transparent border-b border-gray-600 pb-2 text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="flex flex-col items-end gap-3 pt-4 mt-20  sm:mt-2 border-t border-white/20">
                    <Button
                      bgColor="lime"
                      type="submit"
                      disabled={preOrderStatus.submitting}
                    >
                      {preOrderStatus.submitting ? "Submitting..." : "Submit"}
                    </Button>
                    {preOrderStatus.error && (
                      <p className="text-red-300 text-sm text-right max-w-sm">
                        {preOrderStatus.error}
                      </p>
                    )}
                    {preOrderStatus.success && !preOrderStatus.error && (
                      <p className="text-lime-300 text-sm text-right max-w-sm">
                        Thank you! We received your pre-order.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="h-full w-full sm:w-[250vw] grid grid-cols-7 grid-rows-1">
              {features.map((feature, colIndex) => (
                <div
                  key={colIndex}
                  className="grid-column grid grid-cols-1 grid-rows-4 py-12 lg:py-10 px-2 lg:px-15 h-full w-full"
                >
                  {[...Array(4)].map((_, rowIndex) => {
                    // For odd columns (0, 2, 4, 6): highlight 4th row (index 3)
                    // For even columns (1, 3, 5): highlight 3rd row (index 2)
                    const isHighlighted =
                      colIndex % 2 === 0 ? rowIndex === 3 : rowIndex === 2;

                    return (
                      <div
                        key={rowIndex}
                        className={`${
                          isHighlighted
                            ? "bg-gray-300 p-4 px-8 flex flex-col justify-center gap-3"
                            : ""
                        } transition-all duration-300`}
                      >
                        {isHighlighted && (
                          <>
                            <h3 className="font-conthrax text-sm lg:text-2xl mb-2 text-black">
                              {feature.heading}
                            </h3>
                            <p className="text-gray-600 text-xs lg:text-sm">
                              {feature.para}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="hidden sm:block h-full w-screen p-4 px-8">
              <div className="h-full w-full text-white relative flex flex-col md:flex-row justify-between p-17">
                <div className="bg-black opacity-70 h-full w-full absolute inset-0 "></div>
                <div className="flex flex-col gap-7  justify-center z-10 w-1/2">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-conthrax ">
                    Electric Made <br /> Affordable
                  </h1>
                  <h1 className="text-lime-400 poppins-semibold text-xs lg:text-xl">
                    Test Drive
                  </h1>
                </div>
                <div className="flex flex-col gap-7 w-[40%] items-start  justify-center z-10 text-xs md:text-md lg:text-lg text-gray-200">
                  <p>
                    NoRa EV is designed to fit your lifestyle — and your budget.
                    With lower running costs and zero fuel expenses, owning an
                    EV has never been this easy.
                  </p>
                  <Image
                    src="/lime-ball-line.svg"
                    alt="NoRa EV Logo"
                    width={152}
                    height={152}
                    className="h-32 w-2 lg:h-54 lg:w-5 "
                  />
                  <p>Starting from PKR 2.5M - 3.0M (depending on variant)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support Modal */}
      <CustomerSupport
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
};

export default Hero;
