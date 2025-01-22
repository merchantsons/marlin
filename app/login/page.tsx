// pages/login.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Check localStorage for cart and wishlist counts on component mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    setCartCount(cart.length);
    setWishlistCount(wishlist.length);

    // If "remember me" is checked, auto-fill the email and password fields
    if (rememberMe) {
      const savedEmail = localStorage.getItem('email');
      const savedPassword = localStorage.getItem('password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
      }
    }
  }, [rememberMe]);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const query = `*[_type == "userLogin" && email == $email && password == $password]`;
      const params = { email, password };

      const result = await client.fetch(query, params);

      if (result.length > 0) {
        // Assuming the result has user data with username and userId
        const user = result[0];
        const userId = user._id;
        const username = user.username; // Retrieving the username field
       

        // Store user data in localStorage
        localStorage.setItem('userID', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('email', user.email); 
        localStorage.setItem('address', user.address);

        // If remember me is checked, save credentials to localStorage
        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        }

        // Clear any previous error messages
        setErrorMessage('');

        // Redirect to the dashboard page
        router.push('/dashboard');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error fetching data from server.');
      console.error(error);
    }
  };

  // If the user is already logged in, redirect them to the dashboard
  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div>
      <Navbar wishlistCount={wishlistCount} cartCount={cartCount} />
      <div className="flex items-center justify-center py-20 bg-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
          <h2 className="text-2xl font-bold text-center text-black mb-6 animate-slideUp">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white placeholder-gray-500 transition duration-300 ease-in-out"
              />
            </div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white placeholder-gray-500 transition duration-300 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-center text-sm mb-4 animate-fadeIn">{errorMessage}</p>
            )}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-black text-sm">
                Save Credentials
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="#" className="text-black text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link href="/signup" className="text-black text-sm hover:underline">
              Don&apos;t have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
