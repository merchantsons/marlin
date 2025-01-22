'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar'; // Import Navbar
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface CartItem {
  title: string;
  discPrice: string | number;
  price: string | number;
  qty: number;
  image1?: {
    asset: {
      _ref: string;
    };
  };
  size?: string;
  color?: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Cart data with proper type
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  }); 
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<string>('CreditCard');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState<number>(0); // For promo code discount
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [paypalDetails, setPaypalDetails] = useState({ email: '' });
  const [showCODMessage, setShowCODMessage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // For checking login status
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false); // To toggle login popup
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' }); // For login details

  useEffect(() => {
    // Check if the user is logged in from localStorage or session
    const loggedInUser = localStorage.getItem('userToken');
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Load cart data from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);

    // Load user info from localStorage (if available)
    const savedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (savedUserInfo) {
      setUserInfo(savedUserInfo);
    }

    // Load promo code discount from localStorage (if available)
    const savedPromoCodeDiscount = parseFloat(localStorage.getItem('promoDiscount') || '0');
    setPromoCodeDiscount(savedPromoCodeDiscount);
  }, []);

  // Calculate the subtotal, discount, and total
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (parseFloat(item.discPrice.toString()) * parseInt(item.qty.toString())),
    0
  );
  const deliveryFee = 15;

  // Handle COD logic
  const codHandlingFee = paymentMethod === 'COD' ? 5 : 0;

  // Total is subtotal minus promo code discount plus delivery fee and handling fee if COD
  const total = (subtotal - promoCodeDiscount + deliveryFee + codHandlingFee).toFixed(2);  // Convert to string

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true); // Show login popup if not logged in
      return;
    }

    setOrderPlaced(true); // Set order as placed
    // Simulate a successful order placement
    setTimeout(() => {
      // alert('Order placed successfully! Redirecting to thank you page...');
      localStorage.removeItem('cart'); // Clear cart from localStorage
      localStorage.removeItem('userInfo'); // Clear user info from localStorage
      localStorage.removeItem('promoCode'); // Clear promo code from localStorage
      localStorage.removeItem('promoCodeDiscount'); // Clear promo code discount from localStorage
      router.push('/thank-you'); // Redirect to Thank You page
    }, 2000);
  };

  const handleLogin = async () => {
    try {
      // Query Sanity to check if there's a matching user
      const query = `*[_type == "userLogin" && email == $email && password == $password][0]`;
      const params = {
        email: loginDetails.email,
        password: loginDetails.password,
      };
      const user = await client.fetch(query, params);

      if (user) {
        // If user found, set the login state
        localStorage.setItem('userToken', 'logged-in'); // Set user as logged in
        localStorage.setItem('userInfo', JSON.stringify(user)); // Optionally save user info
        setIsLoggedIn(true);
        setShowLoginPopup(false);
      } else {
        alert('Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar wishlistCount={0} cartCount={cartItems.length} /> {/* Pass both props */}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <h1 className={cn('text-3xl lg:text-4xl font-bold text-gray-800 mb-8')}>Checkout</h1>

        {/* Order Summary Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Ensure Image shows correctly */}
                    <Image
                      src={item.image1?.asset._ref ? urlFor(item.image1.asset._ref).width(100).url() : '/default-image.jpg'} // Correct image URL logic
                      alt={item.title}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div className="ml-4">
                      <span className="text-gray-800 block">{item.title}</span>
                      {/* Display size if available */}
                      {item.size && <span className="text-sm text-gray-500 mr-2">Size: {item.size}</span>}
                      {/* Display color if available */}
                      {item.color && <span className="text-sm text-gray-500">Color: {item.color}</span>}
                      {/* Display sale price or regular price */}
                      <div className="text-sm text-gray-500">
                        {item.discPrice ? (
                          <span className="text-green-800 line-through">${item.price}</span>
                        ) : null}
                        <span className="ml-2 text-black">${item.discPrice || item.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    {/* Display quantity in the same column */}
                    <span className="text-gray-700">{item.qty}</span>
                  </div>
                  {/* Display total cost for this item */}
                  <span className="font-medium text-gray-700">
                    ${(parseFloat(item.discPrice.toString()) * parseInt(item.qty.toString())).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-300 my-4" />

            {/* Promo Code Discount (before shipping fee) */}
            {promoCodeDiscount > 0 && (
              <div className="flex justify-between text-lg font-medium text-green-700">
                <span>Promo Code Discount</span>
                <span>-${promoCodeDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-medium text-red-900">
              <span>Shipping Fee</span>
              <span>+${deliveryFee.toFixed(2)}</span>
            </div>

            {/* Show additional fee for COD */}
            {paymentMethod === 'COD' && (
              <div className="flex justify-between text-lg font-medium text-red-900">
                <span>Additional Cash Handling Fee</span>
                <span>+${codHandlingFee.toFixed(2)}</span>
              </div>
            )}

            <div className="h-px bg-gray-300 my-4" />

            <div className="flex justify-between text-lg font-medium text-gray-800 mt-4">
              <span>Total</span>
              <span>${total}</span> {/* Display as string */}
            </div>
          </div>

          {/* Customer Info Section (Moved to right side) */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Customer Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Other fields (email, phone, address, etc.) */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Email Address</label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                <input
                  type="text"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123-456-7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Shipping Address</label>
                <input
                  type="text"
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">City</label>
                <input
                  type="text"
                  value={userInfo.city}
                  onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                <input
                  type="text"
                  value={userInfo.postalCode}
                  onChange={(e) => setUserInfo({ ...userInfo, postalCode: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-16">
          <h2 className="text-2xl font-medium text-gray-800 mb-6">Payment Method</h2>
          <div className="space-y-4">
            <div>
              <label className="inline-flex items-center text-sm font-medium text-gray-600">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CreditCard"
                  checked={paymentMethod === 'CreditCard'}
                  onChange={() => {
                    setPaymentMethod('CreditCard');
                    setShowCODMessage(false);
                  }}
                  className="custom-radio" // Custom radio class
                />
                <span className="ml-2">Credit Card</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center text-sm font-medium text-gray-600">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={() => {
                    setPaymentMethod('PayPal');
                    setShowCODMessage(false);
                  }}
                  className="custom-radio" // Custom radio class
                />
                <span className="ml-2">PayPal</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center text-sm font-medium text-gray-600">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => {
                    setPaymentMethod('COD');
                    setShowCODMessage(true); // Show COD fee message
                  }}
                  className="custom-radio" // Custom radio class
                />
                <span className="ml-2">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>

          {/* Show COD Handling Fee Message */}
          {showCODMessage && (
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Note:</strong> There is an additional handling fee for Cash on Delivery (COD).</p>
            </div>
          )}

          {/* Show credit card or PayPal details based on selection */}
          {paymentMethod === 'CreditCard' && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800">Credit Card Details</h3>
              <input
                type="text"
                placeholder="Card Number"
                className="mt-2 block w-full px-4 py-2 border rounded-md"
                value={creditCardDetails.cardNumber}
                onChange={(e) =>
                  setCreditCardDetails({ ...creditCardDetails, cardNumber: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Expiry Date"
                className="mt-2 block w-full px-4 py-2 border rounded-md"
                value={creditCardDetails.expiryDate}
                onChange={(e) =>
                  setCreditCardDetails({ ...creditCardDetails, expiryDate: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="CVV"
                className="mt-2 block w-full px-4 py-2 border rounded-md"
                value={creditCardDetails.cvv}
                onChange={(e) =>
                  setCreditCardDetails({ ...creditCardDetails, cvv: e.target.value })
                }
              />
            </div>
          )}

          {paymentMethod === 'PayPal' && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800">PayPal Email</h3>
              <input
                type="email"
                placeholder="Your PayPal Email"
                className="mt-2 block w-full px-4 py-2 border rounded-md"
                value={paypalDetails.email}
                onChange={(e) =>
                  setPaypalDetails({ ...paypalDetails, email: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {/* Place Order Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/cart')}
            className="flex px-[8.2vmin] py-3 bg-black text-white rounded-full font-[poppins] hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            className="px-[10vmin] py-3 bg-black text-white rounded-full font-[poppins] hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Success Message */}
      {orderPlaced && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl text-center">
            <CheckCircle className="text-green-800 mx-auto mb-4 h-12 w-12" />
            <h2 className="text-2xl font-semibold mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Your order is being processed. You will receive a confirmation email shortly.</p>
            <button
              onClick={() => router.push('/thank-you')}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-green-800"
            >
              Continue to Thank You Page
            </button>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-white p-8 rounded-xl text-center">
            <h2 className="text-2xl font-semibold mb-4">TO Checkout You Need To Login First</h2>

            <input
              type="email"
              className="mb-4 p-2 w-full border rounded"
              placeholder="Email"
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                className="p-2 w-full border rounded"
                placeholder="Password"
                value={loginDetails.password}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12l-3-3m0 0l-3 3m3-3v6M12 3c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l3 3m0 0l3-3m-3 3v6M9 3c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z" />
                  </svg>
                )}
              </button>
            </div>

            <div>
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-700"
              >
                Log In
              </button>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="ml-4 px-6 py-2 bg-gray-300 text-black rounded-full hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;