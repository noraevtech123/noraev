import Image from "next/image";
import React from "react";
import Button from "./Button";

const Footer = () => {
  const navItems = ["ABOUT", "FEATURES", "SHOWROOM", "TEST DRIVE", "PRE-ORDER"];
  return (
    <div className="bg-black h-fit w-full flex flex-col">
      <div className="h-[50vh] sm:h-[70vh] w-full flex flex-col items-center text-center justify-center gap-y-10 mt-12">
        <h1 className=" font-conthrax text-white text-3xl md:text-5xl">
          Be Part of Pakistan&apos;s <br /> Electric Future
        </h1>
        <p className=" text-sm md:text-md text-gray-400 ">
          Pre-Order Your NoRa EV Today
        </p>
        <div className="h-20 flex gap-5">
          <Button bgColor="lime"> Pre Book Now</Button>

          <Button bgColor="white"> Book a Test Drive</Button>
        </div>
      </div>
      <div className="w-full h-[1px] bg-white opacity-15"></div>
      <div className="w-full h-[40vh] sm:h-[25vh] p-10">
        <nav className="flex flex-col sm:flex-row justify-between h-60 sm:h-20 sm:overflow-hidden items-center">
          <div className="h-12 md:h-20 flex  items-center">
            <Image
              src="/horizontal-logo-white.svg"
              alt="NoRa EV Logo"
              width={52}
              height={52}
              className="lg:h-42 h-30 w-30 lg:w-42 "
            />
          </div>
          <div className="w-full sm:hidden md:flex gap-5 text-white">
            {/* For small screens: two rows */}
            <div className="sm:hidden w-full flex flex-col gap-5">
              <div className="flex justify-center gap-5">
                {navItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="font-conthrax text-[11px]">
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-5">
                {navItems.slice(3, 5).map((item, i) => (
                  <div key={i + 3} className="font-conthrax text-[9px]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* For larger screens: single row */}
            <div className="hidden sm:flex w-full justify-center gap-5">
              {navItems.map((item, i) => (
                <div
                  key={i}
                  className="font-conthrax text-[9px] lg:text-md xl:text-lg"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="icons flex gap-4 items-center">
            <a
              href="#"
              className="text-white hover:text-lime-400 transition-colors duration-300"
            >
              <Image
                src="/instagram-svg.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="h-5 w-5 lg:h-10 lg:w-10"
              />
            </a>
            <a
              href="#"
              className="text-white hover:text-lime-400 transition-colors duration-300"
            >
              <Image
                src="/facebook-svg.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="h-5 w-5 lg:h-10 lg:w-10"
              />
            </a>
            <a
              href="#"
              className="text-white hover:text-lime-400 transition-colors duration-300"
            >
              <Image
                src="/youtube-svg.svg"
                alt="YouTube"
                width={24}
                height={24}
                className="h-5 w-5 lg:h-10 lg:w-10"
              />
            </a>
          </div>
        </nav>
      </div>
      <div className="w-full h-[1px] bg-white opacity-15"></div>
      <div className="h-[25vh] sm:h-[50vh] w-full relative flex justify-center">
        <p className="text-white text-xs md:text-md poppins-reg mt-20">
          © 2025 NoRa EV. All Rights Reserved.
        </p>
        <div className="h-fit w-full absolute bottom-0">
          <Image
            src="/opacity-footer.svg"
            alt="NoRa EV Logo"
            width={1002}
            height={1002}
            className=" w-full  "
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
