'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Updated to useParams from next/navigation
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

// Interface for Color and Size
interface ProductColor {
  name: string;
}

interface ProductSize {
  size: string;
}

interface Product {
  _id: string;
  id: string;
  title: string;
  type: string;
  price: string;
  discPrice: string;
  discount: string | null;
  image1: { asset: { _ref: string } } | null;
  image2?: { asset: { _ref: string } };
  image3?: { asset: { _ref: string } };
  image4?: { asset: { _ref: string } };
  gender: string;
  rate: string;
  reviews: string;
  tags: string[];
  qty: string;
  updatedAt: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  details: string[];
}

interface CartItem extends Product {
  size: string;
  color: string;
  qty: string;
}

const Category: React.FC = () => {
  const { category } = useParams(); // Use useParams to get the dynamic category parameter
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>('Newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 12;

  useEffect(() => {
    if (category) {
      const query = `*[_type == "shopco" && type == "${category}"] | order(_createdAt desc) {
        _id,
        id,
        title,
        type,
        price,
        discPrice,
        discount,
        image1,
        image2,
        image3,
        image4,
        gender,
        rate,
        reviews,
        tags,
        qty,
        updatedAt,
        colors[]->{name},
        sizes[]->{size},
        details
      }`;

      client.fetch(query)
        .then(data => {
          setProducts(data);
          setSortedProducts(data);
        })
        .catch(error => console.error('Error fetching products: ', error));
    } else {
      // If no category is provided, fetch all products
      const query = `*[_type == "shopco"] | order(_createdAt desc) {
        _id,
        id,
        title,
        type,
        price,
        discPrice,
        discount,
        image1,
        image2,
        image3,
        image4,
        gender,
        rate,
        reviews,
        tags,
        qty,
        updatedAt,
        colors[]->{name},
        sizes[]->{size},
        details
      }`;

      client.fetch(query)
        .then(data => {
          setProducts(data);
          setSortedProducts(data);
        })
        .catch(error => console.error('Error fetching products: ', error));
    }

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setCart(savedCart);
    setWishlist(savedWishlist);
  }, [category]); // Re-run the effect whenever the category changes

  const sortProducts = (option: string) => {
    let sorted = [...products];
    switch (option) {
      case 'Newest':
        sorted = sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'Top Rated':
        sorted = sorted.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
        break;
      case 'Low to High':
        sorted = sorted.sort((a, b) => parseFloat(a.discPrice || a.price) - parseFloat(b.discPrice || b.price));
        break;
      case 'High to Low':
        sorted = sorted.sort((a, b) => parseFloat(b.discPrice || b.price) - parseFloat(a.discPrice || a.price));
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
    sortProducts(selectedOption);
  };

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleConfirmAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select both size and color!');
      return;
    }

    const updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex(item => item._id === selectedProduct?._id && item.size === selectedSize && item.color === selectedColor);

    if (existingProductIndex >= 0) {
      updatedCart[existingProductIndex].qty = (parseInt(updatedCart[existingProductIndex].qty) + 1).toString();
    } else {
      updatedCart.push({ ...selectedProduct!, size: selectedSize, color: selectedColor, qty: '1' });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    const cartCount = updatedCart.reduce((total, item) => total + parseInt(item.qty), 0);
    localStorage.setItem('cartCount', JSON.stringify(cartCount));
    setSelectedProduct(null);
  };

  const handleAddToWishlist = (product: Product) => {
    const isAlreadyInWishlist = wishlist.some(item => item._id === product._id);

    if (isAlreadyInWishlist) {
      setShowWishlistPopup(true);
    } else {
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    }
  };

  const renderStars = (rate: string) => {
    const rating = parseFloat(rate);
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const fullStar = '★';
    const halfStar = '☆';

    let stars = ''.padStart(fullStars, fullStar);
    stars += ''.padStart(halfStars, halfStar);
    stars += ''.padStart(emptyStars, '☆');

    return stars;
  };

  const starColor = (rating: string) => {
    const ratingValue = parseFloat(rating);
    if (ratingValue >= 4) {
      return 'text-yellow-500'; 
    } else if (ratingValue >= 2.5) {
      return 'text-yellow-400'; 
    } else {
      return 'text-gray-400'; 
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  return (
    <div>
      <Navbar wishlistCount={wishlist.length} cartCount={cart.length} />
      <div className="font-poppins text-[4.5vmin] lg:text-[3vmin] text-white font-extrabold text-center bg-black">
        NEW  ARRIVALS 
      </div>
      <div className="w-full lg:max-w-7xl justify-self-center">
        <div className="flex justify-between items-center mt-4 mx-6">
          <div className="flex items-center">
            <label htmlFor="sort" className="text-[1.4vh] text-gray-700 mr-2">Sort By:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="text-[1.4vh] p-2 border border-gray-300 rounded-md"
            >
              <option value="Newest">Newest</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Low to High">Price: Low to High</option>
              <option value="High to Low">Price: High to Low</option>
            </select>
          </div>
          <div className="text-[1.4vh] text-gray-700">
            <span className="font-bold">{products.length}</span> / 
            <span className="font-bold text-blue-950">{sortedProducts.filter(product => parseInt(product.qty) > 0).length}</span> Products Available
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {currentProducts.map((product) => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <Link href={`/product/${product.id}`} passHref>
                {product.image1?.asset?._ref ? (
                  <Image
                    src={urlFor(product.image1.asset._ref).width(600).url()}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-56 object-contain cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <span>No Image Available</span>
                  </div>
                )}
              </Link>

              <div className="p-4">
                <h3 className="text-[1.5vh] font-bold text-black">{product.title}</h3>
                <div className="flex flex-row justify-between">
                  <div className="text-[1.2vh] mt-2 text-gray-600 uppercase">{product.type} For {product.gender}</div>
                  {parseInt(product.qty) === 0 && (
                    <div className="text-[1.3vh] text-white bg-red-600 px-4 py-0 mt-3 font-poppins rounded-2xl">
                      SOLD OUT
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  {product.discount && product.discount !== 'null' ? (
                    <div className="flex items-center">
                      <p className="text-lg font-bold text-green-700">${product.discPrice}</p>
                      <p className="text-sm text-gray-500 line-through ml-2">${product.price}</p>
                      <span className="text-[1.2vh] font-semibold text-green-800 ml-2">On Sale</span>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      ${product.price} <span className="text-[1.2vh] text-red-900"> Regular Price</span>
                    </p>
                  )}
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <p className="text-[1.2vh] text-gray-600">({product.reviews}) Reviews</p>
                  <div className="mt-1 text-[1.2vh] text-gray-600">
                    <span>SKU: </span>
                    <span className="font-bold">({product.qty})</span>
                  </div>
                  <div className="flex items-center">
                    <p className={`text-[1.2vh] ${starColor(product.rate)} mr-2`}>{renderStars(product.rate)}</p>
                    <p className="text-[1.2vh] text-gray-600">{product.rate}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center gap-1">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`text-[1.4vh] w-1/2 bg-black text-white py-2 rounded-md hover:bg-cyan-600 transition duration-200 ${parseInt(product.qty) === 0 ? 'cursor-not-allowed' : ''}`}
                    disabled={parseInt(product.qty) === 0}
                    title={parseInt(product.qty) === 0 ? 'Product Sold Out. You Can Add To Your Wishlist For Future Purchase.' : ''}

                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className={`text-[1.4vh] w-1/2 bg-gray-300 text-gray-800 py-2 rounded-md transition duration-200 ${parseInt(product.qty) > 0 ? 'cursor-not-allowed' : 'hover:bg-cyan-800 hover:text-white'}`}
                    disabled={parseInt(product.qty) > 0}
                    title={parseInt(product.qty) > 0 ? 'Can Not Add To Wishlist If Available!' : 'Add To Wishlist For Future Purchase'}
                  >
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end my-6 mr-7">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg mr-2 hover:bg-black hover:text-white"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-black text-white hover:bg-gray-400 hover:text-black' : 'bg-gray-200 text-black hover:bg-black hover:text-white'}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="px-4 py-2 bg-gray-200 rounded-lg ml-2 hover:bg-black hover:text-white"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Size and Color selection */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold">Select Size and Color</h2>

            {/* Size dropdown */}
            <div className="mt-4">
              <label htmlFor="size" className="block text-sm text-gray-700">Size</label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Size</option>
                {selectedProduct.sizes.length > 0 ? (
                  selectedProduct.sizes.map((size, idx) => (
                    <option key={idx} value={size.size}>{size.size}</option>
                  ))
                ) : (
                  <option>No Sizes Available</option>
                )}
              </select>
            </div>

            {/* Color dropdown */}
            <div className="mt-4">
              <label htmlFor="color" className="block text-sm text-gray-700">Color</label>
              <select
                id="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Color</option>
                {selectedProduct.colors.length > 0 ? (
                  selectedProduct.colors.map((color, idx) => (
                    <option key={idx} value={color.name}>{color.name}</option>
                  ))
                ) : (
                  <option>No Colors Available</option>
                )}
              </select>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-300 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="bg-black text-white py-2 px-4 rounded-md"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Popup */}
      {showWishlistPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold">Item is already in your wishlist!</h2>
            <p className="mt-4 text-sm">You cannot add this item again to your wishlist.</p>
            <button
              onClick={() => setShowWishlistPopup(false)}
              className="mt-4 bg-black text-white py-2 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
