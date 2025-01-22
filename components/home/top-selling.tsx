'use client'

import { Star, StarHalf, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { integralCF, satoshi } from '@/app/ui/fonts'
import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: string) {
  return builder.image(source)
}

interface ProductSanity {
  id: string
  title: string
  price: number
  originalPrice?: number
  rate: number
  reviews: number // Use reviews for sorting
  sales: number // Keep this in case you want to use it later
  image1: {
    asset: {
      _id: string
      url: string
    }
  }
  discPrice?: string
}

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  rate: number
  reviews: number // Include reviews in the Product interface
  sales: number
  image1Url: string
  discount?: string
  discPrice?: string
}

async function fetchTopSellingProducts(): Promise<Product[]> {
  // Adjust query to fetch top-rated products, sorted by reviews in descending order
  const query = `*[_type == "shopco"] | order(reviews desc) { // Fetch top 10 products based on reviews
    id,
    title,
    price,
    discPrice,
    rate,
    reviews,
    sales,
    image1 {
      asset -> {
        _id,
        url
      }
    }
  }`

  const products = await client.fetch<ProductSanity[]>(query)
  return products.map((product) => ({
    ...product,
    image1Url: urlFor(product.image1.asset.url).url(),
  }))
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)  // Full stars
  const hasHalfStar = rating % 1 !== 0  // Check if we have a half star
  const emptyStars = Math.max(0, 5 - Math.ceil(rating))  // Ensure no negative empty stars

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1 text-[1.8vmin] text-gray-600">{rating}/5</span>
    </div>
  )
}

export default function TopSelling() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView] = useState(4) // Show 4 products at a time
  const [isHovered, setIsHovered] = useState(false) // Hover state for pausing auto-scroll

  useEffect(() => {
    const fetch = async () => {
      const products = await fetchTopSellingProducts()
      setProducts(products)
    }

    fetch()
  }, [])

  // Define `nextSlide` using useCallback to avoid re-creating it on every render
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex + slidesPerView >= products.length) {
        return 0 // Loop back to the start if we reach the end
      }
      return prevIndex + 1
    })
  }, [products.length, slidesPerView])

  // Auto-scrolling functionality (starts immediately, but pauses on hover)
  useEffect(() => {
    if (isHovered) return // Pause if hovering

    const intervalId = setInterval(() => {
      nextSlide() // Trigger next slide every 3 seconds
    }, 3000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [currentIndex, isHovered, nextSlide]) // Include nextSlide in the dependencies array

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.max(0, products.length - slidesPerView) // Loop back to the end
      }
      return prevIndex - 1
    })
  }

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12"
      onMouseEnter={() => setIsHovered(true)} // Pause on hover
      onMouseLeave={() => setIsHovered(false)} // Resume auto-scroll after hover
    >
      <h2 className={`${integralCF.className} mb-8 text-center text-3xl font-bold tracking-tight`}>
        TOP  SELLING  PRODUCTS
      </h2>

      {/* Product Slider */}
      <div className="relative overflow-hidden mb-6">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex / slidesPerView) * 100}%)`, // Move one product at a time
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2 w-1/4 lg:w-1/4" // 4 products per row
            >
              <Link
                href={`/product/${product.id}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
                  <Image
                    src={product.image1Url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="mt-4 space-y-2 text-[1.8vmin]">
                  <h3 className={`${satoshi.className} font-medium text-gray-900`}>{product.title}</h3>
                  <StarRating rating={product.rate} />
                  <div className="flex items-center gap-2">
                    {/* Price container with proper spacing */}
                    <span className="font-semibold">${product.discPrice || product.price}</span>
                    {product.originalPrice && (
                      <div className="flex items-center gap-2">
                        {/* Strikethrough price with margin */}
                        <span className={`${satoshi.className} text-black line-through`}>
                          ${product.originalPrice}
                        </span>
                        <span className="text-red-600">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
         {/* Navigation Buttons Positioned in Bottom Right Corner */}
         <div className="flex flex-row gap-1 justify-end mt-10">
          <button
            onClick={prevSlide}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>        
      </div>

      {/* View All Link */}
      <div className="-mt-14 text-center">
        <Link
          href="/onsale"
          className="inline-block rounded-full border border-blue-950 bg-blue-950 px-8 py-2 text-sm font-medium text-white transition-colors hover:text-black hover:bg-gray-50"
        >
          View All
        </Link>       
      </div>
    </section>
  )
}