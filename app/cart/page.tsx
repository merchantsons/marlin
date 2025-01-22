'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { FaTrashAlt } from 'react-icons/fa';
import { integralCF } from '@/app/ui/fonts';
import { cn } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItemData {
  _id: string;
  title: string;
  price: string;
  image1: { asset: { _ref: string } } | null;
  discPrice: string;
  discount: string | null;
  qty: string;
  colors: { name: string }[] | null;
  sizes: { name: string }[] | null;
  size: string;
  color: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [wishlist, setWishlist] = useState<CartItemData[]>([]);
  const [products, setProducts] = useState<CartItemData[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0); // State to store the promo discount
  const router = useRouter();

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
          qty,
          colors[]->{name},
          sizes[]->{name}
        }`;

        const data = await client.fetch(query);
        setProducts(data);

        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

        const groupedCart = savedCart.reduce((acc: CartItemData[], item: CartItemData) => {
          const existingItem = acc.find((i: CartItemData) => i._id === item._id && i.size === item.size && i.color === item.color);
          if (existingItem) {
            existingItem.qty = (parseInt(existingItem.qty) + parseInt(item.qty)).toString();
          } else {
            acc.push(item);
          }
          return acc;
        }, []);

        setCartItems(groupedCart);
        setWishlist(savedWishlist);
      } catch (error) {
        console.error('Error fetching products from Sanity:', error);
      }
    };

    fetchProducts();
  }, []);

  const updateCart = (updatedCart: CartItemData[]) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (id: string, size: string, color: string, quantity: number) => {
    const updatedCart = cartItems.map(item =>
      item._id === id && item.size === size && item.color === color
        ? { ...item, qty: quantity.toString() }
        : item
    );
    updateCart(updatedCart);
  };

  const handleRemoveItem = (id: string, size: string, color: string) => {
    const updatedCart = cartItems.filter(item => item._id !== id || item.size !== size || item.color !== color);
    updateCart(updatedCart);

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const newCart = savedCart.filter((item: CartItemData) => item._id !== id || item.size !== size || item.color !== color);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.qty)), 0);

  // Calculate discount
  const discount = cartItems.reduce((acc, item) => {
    const itemDiscount = item.discount ? parseFloat(item.discount) : 0;
    return acc + (itemDiscount * parseInt(item.qty));
  }, 0);

  const deliveryFee = 15;

  // Calculate the total before promo code
  const totalBeforePromo = subtotal - discount + deliveryFee;

  const handlePromoCode = () => {
    if (promoCode === 'DISCOUNT10') {
      const discountAmount = subtotal * 0.1;
      setPromoDiscount(discountAmount);
      return discountAmount;
    }
    return 0;
  };

  const handleApplyPromoCode = () => {
    const discountAmount = handlePromoCode();
    
    // Store the promo discount in localStorage
    localStorage.setItem('promoDiscount', JSON.stringify(discountAmount));
  };

  const handleCheckout = () => {
    const checkoutData = {
      cartItems: cartItems.map(item => ({
        ...item,
        imageUrl: item.image1?.asset._ref
          ? urlFor(item.image1.asset._ref).width(100).url()
          : '/default-image.jpg',
      })),
      promoCode,
      subtotal,
      discount,
      promoDiscount, // Include the promo discount in the checkout data
      deliveryFee,
      total: totalBeforePromo - promoDiscount, // Final total after promo discount
    };

    // Store checkout data in localStorage
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

    // Navigate to checkout page
    router.push('/checkout');
  };

  return (
    <div>
      <Navbar wishlistCount={wishlist.length} cartCount={cartItems.length} />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-800">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-800">Cart</span>
          </div>

          <h1 className={cn("text-3xl lg:text-4xl font-bold mb-8", integralCF.className)}>
            YOUR CART
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center text-lg text-gray-700">
              Your cart is empty. <Link href="/" className="text-blue-600">Shop Now</Link>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <div className="divide-y">
                  {cartItems.map(item => {
                    const product = products.find(p => p._id === item._id);
                    if (!product) return null;

                    const imageUrl = item.image1?.asset._ref
                      ? urlFor(item.image1.asset._ref).width(100).url()
                      : '/default-image.jpg';

                    return (
                      <div key={item._id} className="flex items-center py-6">
                        <div className="flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            width={100}
                            height={100}
                            className="rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium">{product.title}</h3>
                          <div className="text-gray-500">Color: {item.color || 'No color selected'}</div>
                          <div className="text-gray-500">Size: {item.size || 'No size selected'}</div>
                          <div className="text-gray-700 mt-0 flex items-center">
                            {product.discount ? (
                              <>
                                <span className="font-medium text-green-900">${product.discPrice || product.price}</span>
                                <span className="text-sm text-green-900 ml-2">(On Sale)</span>
                              </>
                            ) : (
                              <>
                                <span className="font-medium text-red-800">${product.price}</span>
                                <span className="text-sm text-red-800 ml-2">(Reg Price)</span>
                              </>
                            )}
                            x
                            <input
                              type="number"
                              value={parseInt(item.qty)}
                              min="1"
                              onChange={(e) => handleUpdateQuantity(item._id, item.size, item.color, parseInt(e.target.value))}
                              className="w-12 mx-2 p-1 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => handleRemoveItem(item._id, item.size, item.color)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrashAlt className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 mt-8 lg:mt-0">
                <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 shadow-md">
                  <h2 className={cn("text-xl font-medium mb-6", integralCF.className)}>Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-green-800 font-bold">Discount</span>
                        <span className="text-green-800 font-bold">-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm md:text-base text-green-800">
                        <span className="font-medium">Promo Code Discount</span>
                        <span className="font-medium">-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>

                    <div className="h-px bg-gray-200 my-4" />

                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>${(totalBeforePromo - discount - promoDiscount).toFixed(2)}</span>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Add promo code"
                          className="w-full pl-10 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        />
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <button 
                        onClick={handleApplyPromoCode}
                        className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-black transition-colors text-sm"
                      >
                        Apply
                      </button>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full mt-6 px-6 py-4 bg-black text-white rounded-full flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                    >
                      <span>Go to Checkout</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
