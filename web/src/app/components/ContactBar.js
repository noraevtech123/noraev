"use client";
import React from "react";
import { Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";

const ContactBar = () => {
  return (
    <div className="w-full bg-black/95 border-b border-white/10 py-2 px-4 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left - Contact Info */}
        <div className="flex items-center gap-4 sm:gap-6 text-gray-300 text-xs sm:text-sm">
          <a
            href="tel:+923096664423"
            className="flex items-center gap-1.5 hover:text-lime-400 transition-colors duration-300"
          >
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">+92 309 6664423</span>
          </a>
          <a
            href="mailto:info@noraevtech.com"
            className="flex items-center gap-1.5 hover:text-lime-400 transition-colors duration-300"
          >
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">info@noraevtech.com</span>
            <span className="sm:hidden">Email</span>
          </a>
        </div>

        {/* Right - Social Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="https://www.instagram.com/nora.evtech/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61582105790967"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href="https://www.linkedin.com/company/nora-ev/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
