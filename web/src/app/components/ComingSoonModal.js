"use client";
import React from "react";

const ComingSoonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative z-10 bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-lime-400"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
          <h2 className="font-conthrax text-2xl text-gray-900">Coming Soon</h2>
          <p className="text-gray-600 text-sm mt-1">
            Virtual showroom experience
          </p>
        </div>
        <div className="p-8 space-y-4 text-center text-gray-600">
          <p className="text-base">
            We&apos;re building a full immersive showroom experience so you can explore NoRa EV from anywhere.
          </p>
          <p className="text-sm text-gray-500">
            Stay tuned—we&apos;ll notify you as soon as it&apos;s ready.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-lg bg-lime-400 text-black font-semibold shadow-md hover:bg-lime-500"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
