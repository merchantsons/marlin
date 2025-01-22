'use client';
import { useEffect, useState } from "react";

const Topticker: React.FC = () => {
    const newsItems = [
        "🌟 New Arrivals: Check out the latest collection of elegant dresses for every occasion!",
        "💃 Get ready to shine with our stunning new jewelry pieces, now available in-store!",
        "👗 Spring has arrived! Explore our fresh collection of floral prints and breezy blouses.",
        "✨ Flash Sale: Up to 50% off on selected handbags – grab yours while supplies last!",
        "🛍️ Exclusive Offer: Buy one, get one 30% off on all accessories this weekend only!",
        "🌸 Treat yourself to luxury! New silk scarves are here to elevate your look.",
        "🎉 Our bestsellers are back in stock – don’t miss out on the styles you love!",
        "💎 Find the perfect evening gown for your next event – now in sizes for every figure!",
        "👠 Step into comfort and style with our new range of fashionable flats and heels.",
        "👚 Time for a wardrobe refresh! Discover the ultimate mix of casual and chic pieces today!"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
 

    useEffect(() => {
        const interval = setInterval(() => {
            setIsSliding(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
                setIsSliding(false);
            }, 1000); // Match this with the duration of the sliding animation
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [newsItems.length]);

    return (
        <div className="overflow-hidden h-8 w-full bg-black relative">
            {/* Ticker with News Items */}
            <div className="relative h-8">
                <div className={`transition-transform duration-500 ${isSliding ? "-translate-y-8" : "translate-y-0"}`}>
                    {newsItems.map((news, index) => (
                        <div key={index} className={`text-[1.8vmin] h-8 flex items-center justify-center bg-black text-white font-poppins font-light uppercase tracking-wide lg:text-[1.7vmin] ${index === currentIndex ? "block" : "hidden"}`}>
                            {news}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Topticker;
