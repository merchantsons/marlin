'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { integralCF } from '@/app/ui/fonts';
import { cn } from '@/lib/utils';
import Topticker from './Topticker';
import { client } from '@/sanity/lib/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image from next/image
import { urlFor } from '@/sanity/lib/image'; // Import urlFor to get image URL from Sanity

// Define the Product type
interface Product {
  id: string;
  title: string;
  gender: string;
  price: string;
  type: string;
  image1?: string; // You can adjust this if your image structure differs
}

// Define the Category type
interface Category {
  id: string;
  category: string;
}

type NavbarProps = {
  wishlistCount: number;
  cartCount: number;
  username?: string | null;
};

export function Navbar({ wishlistCount, cartCount, username: propUsername }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Store categories fetched from Sanity
  const [searchResults, setSearchResults] = useState<Product[]>([]); // Use the Product type here
  const router = useRouter();

  // Fetch categories from Sanity on initial load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await client.fetch('*[_type == "category"]');
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Sync cart state with localStorage and listen for changes
  useEffect(() => {
    const updateCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log(cart);
    };

    const updateWishlistItems = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      console.log(wishlist);
    };

    updateCartItems();
    updateWishlistItems();

    const cartChangeListener = () => {
      updateCartItems();
      updateWishlistItems();
    };

    window.addEventListener('storage', cartChangeListener);

    const storedUsername = propUsername || localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    return () => {
      window.removeEventListener('storage', cartChangeListener);
    };
  }, [propUsername]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
    setUsername(null);
  };

  const userMenu = username ? (
    <div className="flex flex-col items-center gap-0">
      <span className="text-black text-[1.4vmin]">{username}</span>
      <User className="h-6 w-6 text-black" />
      <button onClick={handleLogout} className="bg-black text-[1.2vmin] text-white px-4 py-1 rounded-md">
        Logout
      </button>
    </div>
  ) : (
    <Link href="/login" aria-label="User Profile">
      <User className="h-6 w-6" />
    </Link>
  );

  // Function to fetch products from Sanity based on the search query
  const fetchSearchResults = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]); // Do not search if the query is less than 3 characters
      return;
    }

    try {
      const groqQuery = `*[_type == "shopco" && (title match $query || tags[0] match $query)]{
        id,
        title,
        gender,
        price,
        type,
        image1
      }`;

      // Ensure params is correctly typed as a Record<string, any>
      const params: Record<string, string> = { query: `*${query}*` }; // Construct query parameter

      // Fetch data from Sanity
      const res = await client.fetch(groqQuery, params); // Use params here

      setSearchResults(res);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery]);

  return (
    <div className="w-full bg-black shadow-sm">
      <Topticker />

      {/* Main Navbar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto p-0">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden gap-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-9 w-9 mt-[.8vmin]" />
            </button>

            {/* Logo */}
            <div className="flex-1 left-6 ml-1">
              <Link href="/" className={cn('text-3xl lg:text-3xl font-bold', integralCF.className)}>
                MARLIN
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/products" className="hover:text-gray-600">Shop</Link>
              <Link href="/onsale" className="hover:text-gray-600">On Sale</Link>
              <Link href="/newarrivals" className="hover:text-gray-600">New Arrivals</Link>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  className="hover:text-gray-600"
                  onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)} // Toggle dropdown visibility on click
                >
                  Categories
                </button>
                {isBrandsDropdownOpen && (
                  <div className="absolute bg-white shadow-md rounded-md mt-2 w-48 z-50">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.id.toLowerCase()}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          {category.category}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500">Loading categories...</p>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search for products..."
                  className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search for products"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchQuery.length > 0 && searchResults.length > 0 && (
                  <div className="absolute bg-white shadow-md rounded-md mt-2 w-full z-50 max-h-60 overflow-auto">
                    {searchResults.map((product) => {
                      const imageUrl = product.image1 ? urlFor(product.image1).url() : null;
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          <div className="flex items-center">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={product.title}
                                width={50}
                                height={50}
                                className="h-10 w-10 object-cover rounded-md mr-4"
                              />
                            )}
                            <div>
                              <p className="text-xs font-medium">{product.title}</p>
                              <p className="text-xs text-gray-500">{product.type}</p>
                              <p className="text-xs text-gray-500">{product.gender}</p>
                              <p className="text-xs text-gray-500">{product.price}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="lg:hidden" aria-label="Search">
                <Search className="hidden h-6 w-6" />
              </button>

              {/* Wishlist Icon */}
              <Link href="/wishlist" className="relative" aria-label="Go to wishlist">
                <Heart className="h-6 w-6 text-black" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 rounded-full bg-red-600 text-white text-xs px-1.5 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="relative" aria-label="Go to cart">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 rounded-full bg-red-600 text-white text-xs px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              <div className="relative flex items-center gap-2">
                {userMenu}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Slide-in/Slide-out Effect */}
      <div
        className={cn(
          'fixed top-0 left-0 w-[50vmin] h-full bg-black text-white z-50 transition-all duration-1000 ease-out',
          isMenuOpen ? 'left-0' : '-left-full' // Control the left position for the slide-in effect
        )}
      >
        <div className="p-4">
          <button
            className="absolute right-4 top-4 px-2 py-1 text-[3vmin] border-2 border-gray-500 text-gray-500"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            X
          </button>

          <Link href="/" className={cn('text-3xl font-bold mb-6', integralCF.className)}>
            MARLIN
          </Link>

          <nav className="mt-12 space-y-6">
            <Link href="/products" className="block text-lg hover:bg-gray-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/onsale" className="block text-lg hover:bg-gray-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
              On Sale
            </Link>
            <Link href="/newarrivals" className="block text-lg hover:bg-gray-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
              New Arrivals
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                className="block text-lg hover:bg-gray-600 px-2 py-1"
              >
                Categories
              </button>
              {isBrandsDropdownOpen && (
                <div className="absolute bg-white shadow-md rounded-md mt-2 w-48 z-50">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.id.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.category}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">Loading categories...</p>
                  )}
                </div>
              )}
            </div>
          </nav>

          <div className="mt-8">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none text-black text-[2vmin]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for products"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery.length > 0 && searchResults.length > 0 && (
                <div className="absolute bg-white shadow-md rounded-md mt-2 w-full z-50 max-h-60 overflow-auto">
                  {searchResults.map((product) => {
                    const imageUrl = product.image1 ? urlFor(product.image1).url() : null;
                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      >
                        <div className="flex items-center">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={product.title}
                              width={50}
                              height={50}
                              className="h-10 w-10 object-cover rounded-md mr-4"
                            />
                          )}
                          <div>
                            <p className="text-[1.2vmin] font-bold">{product.title}</p>
                            <div className='flex flex-row gap-2'>
                              <p className="text-[1.2vmin] text-gray-500">{product.type}</p>
                              <p className="text-[1.2vmin] text-gray-500">{product.gender}</p>
                            </div>
                            <p className="text-xs text-gray-500">{product.price}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
