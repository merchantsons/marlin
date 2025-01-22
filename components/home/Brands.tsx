import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from Next.js

export function Brands() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    { src: '/brands/versace.svg', alt: 'Versace' },
    { src: '/brands/zara.svg', alt: 'Zara' },
    { src: '/brands/gucc.svg', alt: 'Gucci' },
    { src: '/brands/prada.svg', alt: 'Prada' },
    { src: '/brands/calvin.svg', alt: 'Calvin Klein' },
  ];

  // Using useCallback to memoize the nextSlide function
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]); // Memoize the function, dependency is images.length

  // Autoplay the slider
  useEffect(() => {
    const interval = setInterval(nextSlide, 2500); // Change slide every 2.5 seconds
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [nextSlide]); // Include nextSlide in the dependency array

  return (
    <div className="w-full bg-black py-6 lg:py-8 -mt-[0vmin]">
      <div className="max-w-full mx-auto px-4 lg:px-0">
        {/* Slider Container */}
        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`, // Move the images
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full" // Make each image take full width
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={140}
                  height={32}
                  className="h-6 lg:h-8 w-auto brightness-0 invert mx-auto"
                />
              </div>
            ))}
          </div>

          {/* SHOP NOW Button directly on Link */}
          <Link
            href="/products"
            className="absolute left-2 lg:left-60 top-1/2 transform -translate-y-1/2 bg-[#8B0000] text-gray-50 px-6 py-2 font-poppins text-[1.5vmin] rounded-full md:text-base hover:bg-red-600"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
