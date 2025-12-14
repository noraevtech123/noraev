"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "./Button";
import CustomerSupport from "./CustomerSupport";
import { gsap } from "gsap";
import TestLink from "./TestLink";
import { PREORDER_EVENT } from "@/lib/uiEvents";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Hero = () => {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const showFormAnimation = useCallback(() => {
    const form = formRef.current;
    if (form) {
      // Animate to slide in from right
      gsap.to(form, {
        x: "0%",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  const hideFormAnimation = useCallback(() => {
    const form = formRef.current;
    if (form) {
      gsap.to(form, {
        x: "100%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
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

  return (
    <>
      <div className="hero-main h-screen w-full relative overflow-hidden">
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
              <Button onClick={openPreOrderForm}>Contact Us</Button>
            </div>
          </nav>

          <div className="h-[50%] items-center sm:items-start text-center sm:text-left w-full flex flex-col gap-y-6">
            <h1 className="font-conthrax text-3xl sm:text-3xl md:text-4xl lg:text-6xl">
              NoRa EV - Nayi <br></br>Soch, Naya Safar
            </h1>
            <p className="text-gray-600 text-[9px] sm:text-[10px] lg:text-lg">
              Pakistan&apos;s first battery-swappable electric car. Affordable,
              <br /> stylish, and ready to change the way we move. Contact us :
              info@noraevtech.com
            </p>
            <div className="z-20">
              <TestLink onClick={openPreOrderForm}>Pre Order</TestLink>
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
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedImage(num)}
                  className="h-full w-full z-20 sm:w-[75%] bg-black cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={`/hero-img-${num}.png`}
                    alt={`NoRa EV Image ${num}`}
                    width={152}
                    height={152}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="h-full w-full absolute inset-0 overflow-hidden">
            <div className="absolute right-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-white [clip-path:polygon(16%_0,_100%_0,_100%_100%,_0_100%)]"></div>
            <div className="absolute left-0 -bottom-1 w-37 sm:w-47 md:w-67 h-5 sm:h-6 md:h-8 bg-white [clip-path:polygon(0_0,_84%_0,_100%_100%,_0_100%)]"></div>
          </div>
        </div>

        {/* Contact Form - Fixed Overlay */}
        <div
          className="form w-full sm:w-[77vw] h-full fixed top-0 right-0 opacity-0 z-50"
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
              <h1 className="font-conthrax text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">
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
                    <label className="block text-white text-xs sm:text-sm mb-1 sm:mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={preOrderData.name}
                      onChange={handleInputChange("name")}
                      required
                      className="w-full bg-transparent border-b border-gray-600 pb-1 sm:pb-2 text-xs sm:text-base text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-white text-xs sm:text-sm mb-1 sm:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={preOrderData.email}
                      onChange={handleInputChange("email")}
                      required
                      className="w-full bg-transparent border-b border-gray-600 pb-1 sm:pb-2 text-xs sm:text-base text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Second Row - Single input */}
                <div>
                  <label className="block text-white text-xs sm:text-sm mb-1 sm:mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={preOrderData.phone}
                    onChange={handleInputChange("phone")}
                    required
                    className="w-full bg-transparent border-b border-gray-600 pb-1 sm:pb-2 text-xs sm:text-base text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Third Row - Single input */}
                <div>
                  <label className="block text-white text-xs sm:text-sm mb-1 sm:mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={preOrderData.city}
                    onChange={handleInputChange("city")}
                    required
                    className="w-full bg-transparent border-b border-gray-600 pb-1 sm:pb-2 text-xs sm:text-base text-white placeholder-gray-400 focus:border-lime-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex flex-col items-end gap-3 pt-4   sm:mt-2 border-t border-white/20">
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
      </div>

      {/* Customer Support Modal */}
      <CustomerSupport
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-60 text-3xl font-light"
          >
            ×
          </button>
          <div
            className="relative h-[30vh] sm:h-[90vh] w-[90vw] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/hero-img-${selectedImage}.png`}
              alt={`NoRa EV Image ${selectedImage}`}
              width={1200}
              height={800}
              className="w-auto h-full object-cover object-bottom rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
