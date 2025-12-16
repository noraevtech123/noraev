"use client";
import React from "react";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Ayub Ghauri",
    role: "CEO",
    image: "/team/ayub_ghauri.png",
    email: "ayub.ghauri@noraevtech.com",
    linkedin: "https://www.linkedin.com/in/ayub-ghauri-05476b1/",
  },
  {
    name: "Ali Raza",
    role: "COO",
    image: "/team/ali_raza.png",
    email: "aliraza@noraevtech.com",
    linkedin: "https://www.linkedin.com/in/ali-raza-b392a6386/",
  },
  {
    name: "Nosheen Azhar",
    role: "Director Strategy & Finance",
    image: "/team/nosheen_azhar.png",
    email: "nosheen.azhar@noraevtech.com",
    linkedin: null,
  },
];

const Team = () => {
  return (
    <div
      id="team"
      className="w-full bg-black py-16 sm:py-24 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-lime-500 text-xs sm:text-sm lg:text-base font-conthrax mb-3">
            OUR LEADERSHIP
          </h2>
          <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-conthrax">
            Meet The Team
          </h3>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-lime-500/10"
            >
              {/* Image Container */}
              <div className="relative h-[350px] sm:h-[400px] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h4 className="text-white text-xl sm:text-2xl font-conthrax mb-1">
                  {member.name}
                </h4>
                <p className="text-lime-400 text-sm sm:text-base mb-4">
                  {member.role}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center 
                               text-gray-400 hover:text-lime-400 hover:bg-white/20 
                               transition-all duration-300"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center 
                                 text-gray-400 hover:text-lime-400 hover:bg-white/20 
                                 transition-all duration-300"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
