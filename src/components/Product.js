import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Debug logging
  console.log('Product component received:', product.name);
  console.log('Product images:', product.images);

  const addToCartHandler = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Get size data from color variant or default sizes
    let sizeData;
    if (product.colorVariants && product.colorVariants[selectedColor]) {
      sizeData = product.colorVariants[selectedColor].sizes.find(s => s.size === selectedSize);
    } else {
      sizeData = product.sizes.find(s => s.size === selectedSize);
    }

    if (!sizeData || sizeData.stock === 0) {
      toast.error('Selected size is out of stock');
      return;
    }

    // Get image from color variant or default images
    let productImage;
    if (product.colorVariants && product.colorVariants[selectedColor]) {
      productImage = product.colorVariants[selectedColor].images[currentImageIndex] || product.colorVariants[selectedColor].images[0];
    } else {
      productImage = product.images[currentImageIndex] || product.images[0];
    }

    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      image: productImage,
      price: product.price,
      countInStock: sizeData.stock,
      size: selectedSize,
      color: selectedColor,
      qty: 1
    }));

    toast.success('Added to cart!');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Get current images based on selected color
  const getCurrentImages = () => {
    if (product.colorVariants && selectedColor && product.colorVariants[selectedColor]) {
      return product.colorVariants[selectedColor].images || product.images || [];
    }
    return product.images || [];
  };

  const currentImages = getCurrentImages();
  
  // Ensure we have at least one image
  const displayImage = currentImages && currentImages.length > 0 ? currentImages[currentImageIndex] : (product.images && product.images.length > 0 ? product.images[0] : '');

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex + 1 >= currentImages.length ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex - 1 < 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };

  // Get available sizes based on selected color
  const getAvailableSizes = () => {
    if (product.colorVariants && selectedColor && product.colorVariants[selectedColor]) {
      return product.colorVariants[selectedColor].sizes.filter(size => size.stock > 0);
    }
    return product.sizes.filter(size => size.stock > 0);
  };

  const availableSizes = getAvailableSizes();

  // Initialize selected color when component mounts
  React.useEffect(() => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors, selectedColor]);

  // Reset image index when color changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  return (
    <div className="bg-white rounded-lg shadow-sm border-0 h-full flex flex-col group">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          {imageError ? (
            <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📷</div>
                <div className="text-sm">Image Not Available</div>
              </div>
            </div>
          ) : (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
              style={{ minHeight: '256px' }}
              onError={() => {
                console.log('Image failed to load:', displayImage);
                setImageError(true);
              }}
            />
          )}
        </Link>
        
        {/* Image Navigation Arrows */}
        {currentImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
            >
              <FaChevronRight size={12} />
            </button>
          </>
        )}
        
        {/* Image Indicators */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {currentImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
          onClick={toggleWishlist}
        >
          <FaHeart className={isWishlisted ? 'text-red-500' : 'text-gray-400'} />
        </button>

        {/* Sale Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
            <span className="text-white font-bold text-lg">OUT OF STOCK</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <Link to={`/product/${product._id}`} className="no-underline">
          <h5 className="text-gray-900 font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors text-sm">
            {product.name.toUpperCase()}
          </h5>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                size={12}
              />
            ))}
          </div>
          <small className="text-gray-500 text-xs">
            ({product.numReviews})
          </small>
        </div>

        {/* Price - MRP Format */}
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              MRP ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-sm">
                MRP ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-green-600 text-sm font-medium mt-1">
              Save ₹{(product.originalPrice - product.price).toLocaleString()}
            </div>
          )}
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-3">
            <small className="text-gray-500 block mb-2 text-xs">Color:</small>
            <div className="flex flex-wrap gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <button
                  key={color}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    selectedColor === color
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedSize(''); // Reset size when color changes
                  }}
                >
                  {color}
                </button>
              ))}
              {product.colors.length > 3 && (
                <button className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800">
                  +{product.colors.length - 3} more
                </button>
              )}
            </div>
          </div>
        )}

        {/* Size Selection */}
        <div className="mb-4">
          <small className="text-gray-500 block mb-2 text-xs">Select Size:</small>
          <div className="flex flex-wrap gap-1">
            {availableSizes.slice(0, 4).map((size) => (
              <button
                key={size.size}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  selectedSize === size.size
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setSelectedSize(size.size)}
                disabled={size.stock === 0}
              >
                {size.size}
              </button>
            ))}
            {availableSizes.length > 4 && (
              <button className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800">
                +{availableSizes.length - 4} more
              </button>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !product.inStock || availableSizes.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
          onClick={addToCartHandler}
          disabled={!product.inStock || availableSizes.length === 0}
        >
          <FaShoppingCart className="inline mr-2" />
          {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default Product;
