'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Navbar } from '@/components/Navbar';

// Define the User type interface
interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  cartItems: string[];
  wishItems: string[];
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
}

const UserDashboard = () => {
  const [user, setUser] = useState<User | null>(null); // Correctly type user
  const [isEditing, setIsEditing] = useState(false); // Toggle editing mode
  const [updatedUser, setUpdatedUser] = useState<User | null>(null); // Correctly type updatedUser
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false); // State for success message visibility
  const router = useRouter();

  // Fetch user data from Sanity based on logged-in user's userID
  useEffect(() => {
    const userId = localStorage.getItem('userID');

    if (!userId) {
      // If there's no user ID in localStorage, redirect to login page
      router.push('/login');
    } else {
      // Fetch user data from Sanity
      const fetchUserData = async () => {
        try {
          const query = `*[_type == "userLogin" && _id == $userId][0]`;
          const result = await client.fetch(query, { userId });

          if (result) {
            setUser(result);
            setUpdatedUser(result); // Initialize updatedUser with fetched data
          } else {
            setErrorMessage('User not found.');
          }
        } catch (error) {
          setErrorMessage('Error fetching user data.');
          console.error(error);
        }
      };

      fetchUserData();
    }
  }, [router]);

  // Handle form input changes with type-safe state updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) =>
      prevState
        ? {
            ...prevState,
            [name]: value,
          }
        : null
    );
  };

  // Handle update user information
  const handleUpdate = async () => {
    if (updatedUser) {
      try {
        const { _id, username, email, password, full_name, phone, address, city, postal } = updatedUser;

        // Update user in Sanity database
        await client.patch(_id).set({ username, email, password, full_name, phone, address, city, postal }).commit();

        // Update local user state
        setUser(updatedUser);
        setIsEditing(false);
        setSuccessMessage(true); // Show success message
        setTimeout(() => {
          setSuccessMessage(false); // Hide success message after 3 seconds
        }, 3000);
      } catch (error) {
        setErrorMessage('Error updating user data.');
        console.error(error);
      }
    }
  };

  // If there's no user data yet
  if (!user) {
    return <div>Loading...</div>;
  }

  const cart = user.cartItems || [];
  const wishlist = user.wishItems || [];

  return (
    <div className="bg-gray-500 text-black min-h-screen">
      <Navbar wishlistCount={wishlist.length} cartCount={cart.length} />
      <div className="w-full lg:max-w-7xl justify-self-center min-h-screen p-8 text-white">
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <h1 className="text-center text-[3vmin] font-bold mb-6 lg:text-[2.5vmin]"> Welcome back, {user.full_name}! </h1>
            
            {/* Cart Section */}
            <div className="mb-6">
              <h2 className="text-[1.8vmin] font-medium text-center">Items in Cart</h2>
              <div className="bg-gray-700 p-4 rounded-lg mt-2 text-sm lg:text-[1.6vmin]">
                {cart.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {cart.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Your cart is empty</p>
                )}
              </div>
            </div>

            {/* Wishlist Section */}
            <div className="mb-6">
              <h2 className="text-[1.8vmin] font-medium text-center">Items in Wishlist</h2>
              <div className="bg-gray-700 p-4 rounded-lg mt-2 text-[1.6vmin]">
                {wishlist.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {wishlist.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Your wishlist is empty</p>
                )}
              </div>
            </div>
          </div>

          {/* Success Message Popup */}
          {successMessage && (
            <div
              className="fixed top-0 right-0 left-0 bg-green-500 text-white p-4 rounded-md transform transition-all duration-500 ease-in-out slide-in-up"
              style={{ zIndex: 1000 }}
            >
              Information updated successfully!
            </div>
          )}

          {/* User Information Section */}
          <div className="mb-6">
            <h2 className="text-xl font-medium">User Information</h2>
            <div className="bg-gray-700 p-4 rounded-lg mt-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={updatedUser?.full_name || ''}
                      onChange={handleChange}
                      className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p>{user.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={updatedUser?.username || ''}
                      onChange={handleChange}
                      className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p>{user.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={updatedUser?.email || ''}
                      onChange={handleChange}
                      className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        name="password"
                        value={updatedUser?.password || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                      />
                      <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                      >
                        {passwordVisible ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                      </span>
                    </div>
                  ) : (
                    <p>********</p>
                  )}
                </div>

                {/* New Fields for Phone, Address, City, and Postal */}
                <div>
                  <label className="block text-sm font-medium">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={updatedUser?.phone || ''}
                      onChange={handleChange}
                      className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p>{user.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={updatedUser?.address || ''}
                      onChange={handleChange}
                      className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p>{user.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={updatedUser?.city || ''}
                      onChange={handleChange}
                      className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p>{user.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Postal Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="postal"
                      value={updatedUser?.postal || ''}
                      onChange={handleChange}
                      className="mt-2 p-2 border border-white rounded-md w-full bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p>{user.postal}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-center text-sm mb-4">{errorMessage}</p>
          )}

          {/* Edit/Save Button */}
          <button
            onClick={() => {
              if (isEditing) {
                handleUpdate();
              } else {
                setIsEditing(true);
              }
            }}
            className="mt-6 px-6 py-2 border border-white rounded-md hover:bg-purple-600 hover:text-white focus:outline-none transition"
          >
            {isEditing ? 'Save Information' : 'Update Information'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
