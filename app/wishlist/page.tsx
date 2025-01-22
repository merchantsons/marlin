'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FaTrashAlt } from 'react-icons/fa'; // Trash icon for removing items
import { integralCF } from '@/app/ui/fonts';
import { cn } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';

interface WishlistItemData {
  _id: string;
  title: string;
  price: string;
  image1: { asset: { _ref: string } } | null;
  discPrice: string;
  discount: string | null;
  colors: { name: string }[] | null;
  sizes: { size: string }[] | null;
  qty: number;
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemData[]>([]); // Wishlist items from localStorage
  const [products, setProducts] = useState<WishlistItemData[]>([]); // Fetched products from Sanity
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // For selected size
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // For selected color
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // For controlling modal visibility
  const [currentItem, setCurrentItem] = useState<WishlistItemData | null>(null); // Item to move to cart
  const [wishlistCount, setWishlistCount] = useState<number>(0); // Wishlist count
  const [cartCount, setCartCount] = useState<number>(0); // Cart count

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "shopco"] {
          _id,
          title,
          price,
          discPrice,
          discount,
          image1,
          colors[]->{name},
          sizes[]->{
            size
          }
        }`;

        const data = await client.fetch(query);
        setProducts(data);

        // Load wishlist from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistItems(savedWishlist);

        // Update wishlist and cart counts
        setWishlistCount(savedWishlist.length);
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(savedCart.length);

      } catch (error) {
        console.error('Error fetching products from Sanity:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle opening the modal to select size and color
  const handleMoveToCart = (item: WishlistItemData) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Handle adding to cart after selecting size and color
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select both size and color.');
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add item to cart with quantity of 1
    savedCart.push({
      ...currentItem,
      qty: 1, // Always add 1 qty
      size: selectedSize,
      color: selectedColor
    });

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(savedCart));
    
    // Refresh the page to reflect the changes
    window.location.reload();

    // Remove the item from wishlist
    handleRemoveItem(currentItem?._id);

    // Close the modal and reset selections
    setIsModalOpen(false);
    setSelectedSize(null);
    setSelectedColor(null);
  };

  // Handle removing an item from the wishlist
  const handleRemoveItem = (id: string | undefined) => {
    const updatedWishlist = wishlistItems.filter(item => item._id !== id);
    setWishlistItems(updatedWishlist);

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const newWishlist = savedWishlist.filter((item: WishlistItemData) => item._id !== id);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));

    // Update wishlist count
    setWishlistCount(newWishlist.length);
  };

  return (
    <div>
      <Navbar wishlistCount={wishlistCount} cartCount={cartCount} />  
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-800">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-800">Wishlist</span>
          </div>

          <h1 className={cn("text-3xl lg:text-4xl font-bold mb-8", integralCF.className)}>
            YOUR WISHLIST
          </h1>

          {/* Check if wishlist is empty */}
          {wishlistItems.length === 0 ? (
            <div className="text-center text-lg text-gray-700">
              Your wishlist is empty. <Link href="/" className="text-blue-600">Shop Now</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wishlist Items */}
              {wishlistItems.map(item => {
                const product = products.find(p => p._id === item._id);
                if (!product) return null;

                // Extract sizes and colors from the product data
                const sizes = product.sizes?.map(size => size.size).join(', ') || 'No sizes available';
                const colors = product.colors?.map(c => c.name).join(', ') || 'No colors available';

                // Determine if the product is on sale or regular price
                const isOnSale = product.discount !== null;
                const price = isOnSale ? product.discPrice : product.price;
                const priceLabel = isOnSale ? '(On Sale)' : '(Reg Price)';
                const priceClass = isOnSale ? 'text-green-800' : 'text-red-800';

                return (
                  <div key={item._id} className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-6 rounded-lg shadow-md space-y-4 md:space-y-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                      <Image
                        src={product.image1 ? urlFor(product.image1.asset._ref).width(100).url() : '/default-image.jpg'}
                        alt={product.title}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    {/* Product Data */}
                    <div className="flex-1 ml-4 text-sm md:text-base">
                      <h3 className="text-xl font-semibold">{product.title}</h3>
                      <p className="text-gray-500">{colors}</p>
                      <p className="text-gray-500">{sizes}</p>
                      <div className="text-lg mt-2">
                        <span className={`font-medium ${priceClass}`}>${price}</span>
                        <span className="text-sm text-gray-500 ml-2">{priceLabel}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      {/* Move to Cart Button */}
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="text-xs text-white bg-black hover:bg-green-800 px-4 py-1 rounded-md"
                      >
                        Move to Cart
                      </button>

                      {/* Trash Icon to Remove Item */}
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal for selecting size and color */}
        {isModalOpen && currentItem && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Select Size and Color</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <select
                  value={selectedSize || ''}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select size</option>
                  {currentItem.sizes?.map((size) => (
                    <option key={size.size} value={size.size}>
                      {size.size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <select
                  value={selectedColor || ''}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select color</option>
                  {currentItem.colors?.map((color) => (
                    <option key={color.name} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
