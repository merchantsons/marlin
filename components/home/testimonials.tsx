'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { integralCF, satoshi } from '@/app/ui/fonts'

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    verified: true,
    text: '"I\'m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I\'ve bought has exceeded my expectations."'
  },
  {
    id: 2,
    name: 'Alex K.',
    rating: 5,
    verified: true,
    text: '"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."'
  },
  {
    id: 3,
    name: 'James L.',
    rating: 5,
    verified: true,
    text: '"As someone who\'s always on the lookout for unique fashion pieces, I\'m thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."'
  },
  {
    id: 4,
    name: 'Megan W.',
    rating: 5,
    verified: true,
    text: '"The attention to detail and quality of clothing from Shop.co is unmatched. Each piece feels premium and the customer service is exceptional."'
  },
  {
    "id": 5,
    "name": "John D.",
    "rating": 4,
    "verified": true,
    "text": "\"I’m really happy with my purchase from Shop.co. The items are well-made, but I wish the sizing was a bit more consistent across styles.\""
  },
  {
    "id": 6,
    "name": "Sarah L.",
    "rating": 5,
    "verified": true,
    "text": "\"Shop.co never disappoints! The clothes are always stylish and the delivery is super fast. Definitely my go-to store for quality fashion.\""
  },
  {
    "id": 7,
    "name": "David P.",
    "rating": 4,
    "verified": true,
    "text": "\"Great selection, but I had some trouble finding my size. Other than that, the clothing is top-notch and the material is fantastic.\""
  },
  {
    "id": 8,
    "name": "Emily R.",
    "rating": 5,
    "verified": true,
    "text": "\"I’ve never been more impressed with a shopping experience! The clothes fit perfectly, and the customer support team was so helpful.\""
  },
  {
    "id": 9,
    "name": "Mike S.",
    "rating": 5,
    "verified": true,
    "text": "\"Quality and service are always on point. I love how Shop.co’s clothing lines cater to different occasions—so versatile!\""
  },
  {
    "id": 10,
    "name": "Rachel T.",
    "rating": 4,
    "verified": true,
    "text": "\"I adore the designs at Shop.co, but I had an issue with one of my items arriving later than expected. Still, the quality is excellent!\""
  },
  {
    "id": 11,
    "name": "Paul B.",
    "rating": 5,
    "verified": true,
    "text": "\"I’m a frequent shopper here, and every piece I’ve purchased has exceeded my expectations. Quality, comfort, and style in one place!\""
  },
  {
    "id": 12,
    "name": "Grace M.",
    "rating": 5,
    "verified": true,
    "text": "\"Every item I’ve bought has been perfect. The attention to detail and craftsmanship is evident in every stitch. I highly recommend Shop.co!\""
  },
  {
    "id": 13,
    "name": "James W.",
    "rating": 4,
    "verified": true,
    "text": "\"Overall, I am satisfied with my shopping experience, though I feel that some of the items could be priced more competitively.\""
  },
  {
    "id": 14,
    "name": "Sophia C.",
    "rating": 5,
    "verified": true,
    "text": "\"Shop.co has quickly become my favorite online store. From the quality of the fabrics to the personalized shopping experience, it’s worth every penny!\""
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3)
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2)
      } else {
        setSlidesPerView(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Wrap nextSlide function in useCallback to prevent unnecessary changes
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + slidesPerView >= testimonials.length) ? 0 : prevIndex + 1
    )
  }, [slidesPerView]) // add slidesPerView as a dependency

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex === 0) ? Math.max(0, testimonials.length - slidesPerView) : prevIndex - 1
    )
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide()
    }, 3000) // Change slide every 3 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [nextSlide]) // Add nextSlide to the dependency array

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <h2 className={`${integralCF.className} text-2xl md:text-[32px] font-bold`}>
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={prevSlide} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={`w-full flex-shrink-0 px-2 md:w-1/2 lg:w-1/3`}>
              <div className="h-full rounded-xl border border-gray-200 bg-white p-6">
                <StarRating rating={testimonial.rating} />
                <div className="mt-4 flex items-center gap-2">
                  <span className={`${satoshi.className} font-medium`}>{testimonial.name}</span>
                  {testimonial.verified && (
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                </div>
                <p className={`${satoshi.className} mt-4 text-gray-600 leading-relaxed`}>
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2 md:hidden">
        <button onClick={prevSlide} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  )
}
