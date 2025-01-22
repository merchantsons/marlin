'use client';
import { useState, useEffect } from 'react';
import { Brands } from "@/components/home/Brands";
import BrowseStyles from "@/components/home/browser-styles";
// import { Hero } from "@/components/home/Hero";
import NewArrivals from "@/components/home/new-arrivals";
import Testimonials from "@/components/home/testimonials";
import TopSelling from "@/components/home/top-selling";
import { Navbar } from "@/components/Navbar";
import Carousol from '@/components/Carousol';

// Define an interface for the items in the cart and wishlist
interface Item {
  id: string; // Assuming id is a string
  name: string; // Assuming name is a string
  qty: string; // Assuming qty is a string, if it’s a number you can change this to `number`
  // Add any other properties here if necessary
}

export default function Home() {
  const [cart, setCart] = useState<Item[]>([]); // Use the Item type for cart
  const [wishlist, setWishlist] = useState<Item[]>([]); // Use the Item type for wishlist

  useEffect(() => {
    // Fetch cart and wishlist from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setCart(savedCart);
    setWishlist(savedWishlist);
  }, []);

  const cartCount = cart.reduce((total, item) => total + parseInt(item.qty), 0); // Count the items in the cart

  return (
    <>
      <div>
        <Navbar wishlistCount={wishlist.length} cartCount={cartCount} />
        {/* <Hero />        */}
        <Carousol />
        <Brands />
        <NewArrivals />
        <hr />
        <TopSelling />
        <BrowseStyles />
        <Testimonials />        
      </div>
    </>
  );
}
