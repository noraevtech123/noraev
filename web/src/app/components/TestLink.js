import Image from "next/image";
import React from "react";

const TestLink = ({ children, color = "black", onClick, className = "" }) => {
  const getTextColorClass = () => {
    switch (color) {
      case "white":
        return "text-white";
      case "lime":
        return "text-lime-400";
      case "black":
        return "text-black";
      default:
        return "text-black";
    }
  };

  const getArrowColor = () => {
    switch (color) {
      case "white":
        return "/arrow-white.svg";
      case "lime":
        return "/arrow-lime.svg";
      case "black":
        return "/arrow.svg"; // black arrow
      default:
        return "/arrow.svg";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`poppins-semibold text-xs lg:text-xl flex items-center sm:gap-3 lg:gap-5 transition-all duration-300 ${getTextColorClass()} ${className}`}
    >
      {children}
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

export default TestLink;
