import Image from "next/image";
import React from "react";

const Button = ({ children, bgColor = "lime", onClick }) => {
  const getBgColorClass = () => {
    switch (bgColor) {
      case "white":
        return "bg-white text-black hover:bg-gray-100";
      case "black":
        return "bg-black text-white hover:bg-gray-800";
      case "lime":
        return "bg-lime-400 text-black hover:bg-lime-500";
      default:
        return "bg-lime-400 text-black hover:bg-lime-500";
    }
  };

  const getArrowColor = () => {
    switch (bgColor) {
      case "white":
        return "/arrow.svg"; // black arrow for white background
      case "black":
        return "/arrow-white.svg"; // white arrow for black background
      case "lime":
        return "/arrow.svg"; // black arrow for lime background
      default:
        return "/arrow.svg";
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`h-[30px] md:h-[40px] lg:h-[58px] px-2 md:px-3.5 lg:px-5 poppins-semibold text-[10px] md:text-[13px] lg:text-[18.5px] flex items-center justify-center gap-2 md:gap-3 lg:gap-[14px] cursor-pointer transition-all duration-300 ${getBgColorClass()}`}
    >
      {children}{" "}
      <Image
        src={getArrowColor()}
        alt="Arrow"
        width={52}
        height={52}
        className="h-2 w-2 lg:h-4 lg:w-4"
      />
    </button>
  );
};

export default Button;
