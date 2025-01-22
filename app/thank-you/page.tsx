'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar'; // Import Navbar
import Image from 'next/image'; // Import Image from next/image

interface OrderItem {
  imageUrl: string;
  title: string;
  size?: string;
  color?: string;
  qty: number;
  price: number;
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  totalAmount: number;
  items: OrderItem[];
}

const ThankYouPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    orderId: '',
    customerName: '',
    totalAmount: 0,  // Initialize with a default value
    items: [], // Ensure items is always an array
  });

  useEffect(() => {
    // Retrieve the order details from localStorage or an API after placing the order.
    const savedOrderDetails = JSON.parse(localStorage.getItem('orderDetails') || '{}');
    if (savedOrderDetails) {
      setOrderDetails(savedOrderDetails);
    }
  }, []);

  const handleReturnToShop = () => {
    router.push('/'); // Redirect to home page or shop
  };

  // Ensure totalAmount is a valid number before calling toFixed()
  const formattedTotalAmount = isNaN(orderDetails.totalAmount) ? 0 : orderDetails.totalAmount;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar wishlistCount={0} cartCount={0} /> {/* Navbar with no cart items */}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4 h-16 w-16" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You for Your Order!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your order has been successfully placed and is being processed. You will receive an order confirmation
            email shortly.
          </p>

          {/* Order Summary Section */}
          <div className="bg-white shadow-xl rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-lg text-gray-700">
                <span>Order ID:</span>
                <span className="font-semibold text-black">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span>Customer Name:</span>
                <span className="font-semibold text-black">{orderDetails.customerName}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span>Total Amount:</span>
                <span className="font-semibold text-black">${formattedTotalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Items List (Optional) */}
          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="bg-white shadow-xl rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Items in Your Order</h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                        width={64} // Width for next/image
                        height={64} // Height for next/image
                      />
                      <div className="ml-4">
                        <span className="text-gray-800">{item.title}</span>
                        {item.size && <span className="text-sm text-gray-500">Size: {item.size}</span>}
                        {item.color && <span className="text-sm text-gray-500">Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="text-gray-700">
                      {item.qty} x ${item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleReturnToShop}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-green-500 font-poppins text-[1.6vmin]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
