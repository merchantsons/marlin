'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Carousol = () => {
  const images = [
    '/banners/1.jpg',
    '/banners/2.jpg',
    '/banners/3.jpg',
    '/banners/4.jpg',
    '/banners/5.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // 4 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }); // Empty dependency array ensures it runs once when the component mounts

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
         <Image
         key={index}
         src={image}
         alt="Carousel Image"
         width={1250}  // Set a width (a large enough value)
         height={720}  // Set a corresponding height (aspect ratio of 16:9 for example)
         className="w-screen h-auto object-cover"
       />
        ))}
      </div>

      <button
        className="absolute top-1/2 left-[1vmin] transform -translate-y-1/2 text-black text-sm p-2 cursor-pointer z-10"
        onClick={prevSlide}
      >
        &#8592;
      </button>
      <button
        className="absolute top-1/2 right-[1vmin] transform -translate-y-1/2 text-black text-sm p-2 cursor-pointer z-10"
        onClick={nextSlide}
      >
        &#8594;
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentIndex
                ? 'bg-red-500'
                : 'bg-white opacity-50 hover:opacity-100'
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousol;
