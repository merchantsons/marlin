import Image from 'next/image'
import Link from 'next/link'
import { integralCF } from '@/app/ui/fonts'
import { cn } from '@/lib/utils'
import AnimatedCounter from './Counter'
import { Carousel } from '../ui/carousel'

export function Hero() {
  return (
    <section className="w-full bg-[#F2F0F1] min-h-screen lg:-mb-[5.8vmin]">
      <div className="flex flex-col lg:flex-row items-center max-w-[1400px] mx-auto">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-12 lg:py-20">
          <h1 className={cn(
            "text-[8vmin] md:text-[56px] lg:text-[6.5vmin] font-bold leading-[1.1]",
            integralCF.className
          )}>
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="mt-6 text-gray-600 text-[3.2vmin] max-w-[480px] lg:text-[1.40vmin]">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <Link href="/products" className="w-full hover:bg-slate-700 mt-8 px-12 py-4 bg-black text-center text-white rounded-full font-medium transition-colors lg:w-fit text-base">
            Shop Now
          </Link>

          <AnimatedCounter />
          
        </div>

        {/* Right Image */}
        <div className="relative w-screen h-[400px] lg:w-1/2 lg:h-screen">
          <Image
            src="/images/hero2.jpg"
            alt="Fashion Models"
            fill
            className="object-cover lg:object-contain"
            priority
          />
        </div>
      </div>
      <Carousel />
    </section>
  )
}

// function StarIcon({ className }: { className?: string }) {
//   return (
//     <svg 
//       viewBox="0 0 24 24" 
//       fill="currentColor"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
//     </svg>
//   )
// }
