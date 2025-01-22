'use client';  // Mark this component as a Client Component

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import the useRouter hook

interface ProductColor {
  name: string;
}

interface ProductSize {
  size: string;
}

interface BlockChild {
  text: string;
  _key: string;
  _type: string;
}

interface Block {
  _key: string;
  _type: string;
  children: BlockChild[];
}

interface Product {
  _id: string;
  id: string;
  title: string;
  price: string;
  discPrice: string;
  image1: { asset: { _ref: string } } | null;
  image2?: { asset: { _ref: string } };
  image3?: { asset: { _ref: string } };
  image4?: { asset: { _ref: string } };
  gender: string;
  rate: string;
  reviews: string;
  tags: string[];
  qty: string;
  colors: ProductColor[] | null;
  sizes: ProductSize[] | null;
  details: Block[];
}

interface WishlistItem {
  _id: string;
  size: string;
  color: string;
  title: string;
  discPrice: string;
}

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();

  const query = `*[_type == "shopco" && id == $id][0] {
    _id,
    id,
    title,
    price,
    discPrice,
    image1,
    image2,
    image3,
    image4,
    gender,
    rate,
    reviews,
    tags,
    qty,
    colors[]->{name},
    sizes[]->{size},
    details
  }`;

  const [product, setProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSelectionPrompt, setShowSelectionPrompt] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const result = await client.fetch(query, { id });
      setProduct(result);
    };

    fetchProduct();

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setWishlist(savedWishlist);
    setWishlistCount(savedWishlist.length);
    setCartCount(savedCart.length);
  }, [id, query]);

  const handleAddToWishlist = (product: Product) => {
    if (!selectedSize || !selectedColor) {
      setShowSelectionPrompt(true);
      return;
    }

    const isAlreadyInWishlist = wishlist.some(
      (item) => item._id === product._id && item.size === selectedSize && item.color === selectedColor
    );

    if (isAlreadyInWishlist) {
      alert('This product is already in your wishlist!');
    } else {
      const updatedWishlist = [...wishlist, { ...product, size: selectedSize, color: selectedColor }];
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistCount(updatedWishlist.length);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setShowSelectionPrompt(true);
      return;
    }

    const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add product with qty set to 1
    updatedCart.push({ ...product, size: selectedSize, color: selectedColor, qty: '1' });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartCount(updatedCart.length); // Update cart count to reflect added item
  };

  const handleBackToStore = () => {
    router.push('/products');
  };

  if (!product) {
    return <div className="text-center py-12 text-lg"></div>;
  }

  const image1Url = product.image1?.asset?._ref
    ? urlFor(product.image1.asset._ref).width(800).url()
    : null;

  return (
    <div>
      <Navbar wishlistCount={wishlistCount} cartCount={cartCount} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full h-[400px] max-w-md group cursor-pointer">
              {image1Url ? (
                <Image
                  src={image1Url}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full rounded-lg shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex justify-center items-center rounded-lg">
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-4">
              {[product.image1, product.image2, product.image3, product.image4].map((image, index) =>
                image?.asset?._ref ? (
                  <div
                    key={index}
                    className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden group transform transition duration-300 hover:scale-105"
                  >
                    <Image
                      src={urlFor(image.asset._ref).width(100).url()}
                      alt={`Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900">{product.title}</h1>
            <p className="mt-2 text-gray-600 text-sm">{product.gender} / {product.tags.join(', ')}</p>

            <div className="mt-4 flex items-center">
              <p className="text-lg font-bold text-red-600">${product.discPrice}</p>
              <p className="text-sm text-gray-500 line-through ml-2">${product.price}</p>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-600">{product.reviews} Reviews</p>
              <p className="text-sm text-yellow-500">{product.rate} ★</p>
            </div>

            {product.sizes && product.sizes.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Available Sizes:</p>
                <ul className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map((size, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-200 transition-all duration-200 cursor-pointer ${selectedSize === size.size ? 'bg-yellow-400' : ''}`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-gray-600">No sizes available</p>
            )}

            {product.colors && product.colors.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Available Colors:</p>
                <ul className="flex flex-wrap gap-2 mt-2">
                  {product.colors.map((color, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-200 transition-all duration-200 cursor-pointer ${selectedColor === color.name ? 'bg-yellow-400' : ''}`}
                      onClick={() => setSelectedColor(color.name)}
                    >
                      {color.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-gray-600">No colors available</p>
            )}

            <div className="mt-6">
              <p className="text-lg font-semibold">Product Details:</p>
              <div className="prose prose-lg text-gray-600 mt-4">
                <PortableText value={product.details} />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              {parseInt(product.qty) > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-700 transition duration-200 w-full"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-700 transition duration-200 w-full"
                >
                  Add to Wishlist
                </button>
              )}

              <button
                onClick={handleBackToStore}
                className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-700 transition duration-200 w-full"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>

        {showSelectionPrompt && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Please select a color and size</h2>
              <button
                onClick={() => setShowSelectionPrompt(false)}
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
