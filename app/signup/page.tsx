'use client';

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Save credentials feature
  const [showPassword, setShowPassword] = useState(false); // Show/hide password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Show/hide confirm password

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Get cart and wishlist from localStorage
    const storedCart = localStorage.getItem('cart');
    const storedWishlist = localStorage.getItem('wishlist');

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation for password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    // Check if user already exists in the database (Sanity)
    try {
      const query = `*[_type == "userLogin" && username == $username]`;
      const params = { username };
      const result = await client.fetch(query, params);

      if (result.length > 0) {
        setErrorMessage('Username is already taken. Please choose a different one.');
      } else {
        // Add new user to the Sanity database
        const newUser = {
          _type: 'userLogin',
          username,
          email,
          password,
        };

        await client.create(newUser); // Assuming `client.create` is set up to save user

        alert('Account created successfully! Please log in.');
        setErrorMessage('');
        // Redirect to login or reset form if needed
      }
    } catch (error) {
      setErrorMessage('Error creating account. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar wishlistCount={wishlist.length} cartCount={cart.length} />
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
          <h2 className="text-2xl font-bold text-center text-black mb-6 animate-slideUp">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value="User Name"
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white placeholder-gray-500 transition duration-300 ease-in-out"
              />
            </div>
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
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
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
                {showPassword ? (
                  <i className="fa fa-eye-slash"></i> // Font Awesome eye icon for hiding
                ) : (
                  <i className="fa fa-eye"></i> // Font Awesome eye icon for showing
                )}
              </button>
            </div>
            <div className="mb-6 relative">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white placeholder-gray-500 transition duration-300 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <i className="fa fa-eye-slash"></i> // Font Awesome eye icon for hiding
                ) : (
                  <i className="fa fa-eye"></i> // Font Awesome eye icon for showing
                )}
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
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-black text-sm hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
