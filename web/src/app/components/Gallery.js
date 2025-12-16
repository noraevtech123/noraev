"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

const galleryImages = [
  {
    src: "/gallery/WhatsApp Image 2025-12-16 at 23.30.03.jpeg",
    alt: "NoRa EV Gallery",
    caption: "NoRa EV Showcase",
  },
  {
    src: "/gallery/WhatsApp Image 2025-12-16 at 23.30.04.jpeg",
    alt: "NoRa EV Gallery",
    caption: "Elegant Design",
  },
  {
    src: "/gallery/WhatsApp Image 2025-12-16 at 23.30.06.jpeg",
    alt: "NoRa EV Gallery",
    caption: "Premium Build Quality",
  },
  {
    src: "/gallery/WhatsApp Image 2025-12-16 at 23.30.06 (1).jpeg",
    alt: "NoRa EV Gallery",
    caption: "Modern Aesthetics",
  },
  {
    src: "/gallery/WhatsApp Image 2025-12-16 at 23.30.07.jpeg",
    alt: "NoRa EV Gallery",
    caption: "Sleek Exterior",
  },
  {
    src: "/gallery/WhatsApp Image 2025-12-16 at 23.30.07 (1).jpeg",
    alt: "NoRa EV Gallery",
    caption: "Nora EV Launch",
  },
  {
    src: "/gallery/WhatsApp Image 2025-12-16 at 23.30.08.jpeg",
    alt: "NoRa EV Gallery",
    caption: "Nora EV Launch",
  },
  {
    src: "/hero-img-1.png",
    alt: "NoRa EV - Front View",
    caption: "Compact Design",
  },
  {
    src: "/hero-img-2.png",
    alt: "NoRa EV - Side Profile",
    caption: "Stylish Profile",
  },
  {
    src: "/hero-img-3.png",
    alt: "NoRa EV - Rear View",
    caption: "Distinctive Rear",
  },
  {
    src: "/interior-1.png",
    alt: "NoRa EV - Interior Dashboard",
    caption: "Premium Interior",
  },
  {
    src: "/interior-2.png",
    alt: "NoRa EV - Interior Seating",
    caption: "Comfortable Seating",
  },
];

const galleryVideos = [
  {
    src: "/gallery/WhatsApp Video 2025-12-16 at 23.29.58.mp4",
    thumbnail: "/gallery/WhatsApp Image 2025-12-16 at 23.30.03.jpeg",
    title: "NoRa EV in Action",
  },
  {
    src: "/gallery/WhatsApp Video 2025-12-16 at 23.30.05.mp4",
    thumbnail: "/gallery/WhatsApp Image 2025-12-16 at 23.30.04.jpeg",
    title: "Test Drive Experience",
  },
  {
    src: "/gallery/WhatsApp Video 2025-12-16 at 23.30.05 (1).mp4",
    thumbnail: "/gallery/WhatsApp Image 2025-12-16 at 23.30.06.jpeg",
    title: "Feature Walkthrough",
  },
  {
    src: "/gallery/WhatsApp Video 2025-12-16 at 23.30.08.mp4",
    thumbnail: "/gallery/WhatsApp Image 2025-12-16 at 23.30.07.jpeg",
    title: "Urban Driving",
  },
];

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("images");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const videoRef = useRef(null);

  // Limit to 2 rows on desktop (4 columns = 8 items)
  const imagesToShow = showAllImages
    ? galleryImages
    : galleryImages.slice(0, 8);
  // Limit to 2 rows for videos (2 columns = 4 items)
  const videosToShow = showAllVideos
    ? galleryVideos
    : galleryVideos.slice(0, 4);

  const openImageLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeImageLightbox = () => {
    setSelectedImage(null);
  };

  const openVideoModal = (index) => {
    setSelectedVideo(index);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const goToPrevious = () => {
    setSelectedImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div
      id="gallery"
      className="w-full bg-black py-16 sm:py-24 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-lime-500 text-xs sm:text-sm lg:text-base font-conthrax mb-3">
            EXPLORE NORA
          </h2>
          <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-conthrax">
            Gallery
          </h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Discover the elegance and innovation of NoRa EV through our curated
            collection.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex bg-gray-900 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("images")}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-md transition-all duration-300 ${
                activeTab === "images"
                  ? "bg-lime-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-md transition-all duration-300 ${
                activeTab === "videos"
                  ? "bg-lime-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Images Grid */}
        {activeTab === "images" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {imagesToShow.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openImageLightbox(index)}
                  className="group relative aspect-square overflow-hidden bg-gray-900 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-lime-500/10"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs sm:text-sm font-medium">
                      {image.caption}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* View All/Less Button for Images */}
            {galleryImages.length > 8 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAllImages(!showAllImages)}
                  className="px-8 py-3 bg-lime-500 text-black font-medium rounded-lg hover:bg-lime-400 transition-all duration-300"
                >
                  {showAllImages ? "View Less" : "View All"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Videos Grid */}
        {activeTab === "videos" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {videosToShow.map((video, index) => (
                <button
                  key={index}
                  onClick={() => openVideoModal(index)}
                  className="group relative aspect-video overflow-hidden bg-gray-900 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-lime-500/10 rounded-lg"
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-lime-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <Play
                        className="w-8 h-8 sm:w-10 sm:h-10 text-black ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm sm:text-base font-medium">
                      {video.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* View All/Less Button for Videos */}
            {galleryVideos.length > 4 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAllVideos(!showAllVideos)}
                  className="px-8 py-3 bg-lime-500 text-black font-medium rounded-lg hover:bg-lime-400 transition-all duration-300"
                >
                  {showAllVideos ? "View Less" : "View All"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeImageLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeImageLightbox}
            className="absolute top-6 right-6 text-white hover:text-lime-400 transition-colors z-60"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>

          {/* Navigation - Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 sm:left-8 text-white hover:text-lime-400 transition-colors z-60 p-2"
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Image Container */}
          <div
            className="relative w-[90vw] h-[70vh] sm:h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              fill
              className="object-contain"
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 text-center p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-lg sm:text-xl font-medium">
                {galleryImages[selectedImage].caption}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedImage + 1} / {galleryImages.length}
              </p>
            </div>
          </div>

          {/* Navigation - Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 sm:right-8 text-white hover:text-lime-400 transition-colors z-60 p-2"
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={closeVideoModal}
        >
          {/* Close Button */}
          <button
            onClick={closeVideoModal}
            className="absolute top-6 right-6 text-white hover:text-lime-400 transition-colors z-60"
            aria-label="Close video"
          >
            <X size={32} />
          </button>

          {/* Video Container */}
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={galleryVideos[selectedVideo].src}
              controls
              autoPlay
              className="w-full h-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
            {/* Title */}
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium">
                {galleryVideos[selectedVideo].title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
