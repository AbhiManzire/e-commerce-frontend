import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.user);

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize('');
      setCurrentImageIndex(0);
    }
  }, [product]);

  // Reset image index when color changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  const addToCartHandler = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
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
      qty: Number(qty)
    }));

    toast.success('Added to cart!');
  };

  const toggleWishlist = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };


  // Use useMemo to recalculate when selectedColor or product changes
  const currentImages = useMemo(() => {
    if (product?.colorVariants && selectedColor && product.colorVariants[selectedColor]) {
      return product.colorVariants[selectedColor].images || [];
    }
    return product?.images || [];
  }, [product, selectedColor]);

  const availableSizes = useMemo(() => {
    if (product?.colorVariants && selectedColor && product.colorVariants[selectedColor]) {
      return product.colorVariants[selectedColor].sizes.filter(size => size.stock > 0);
    }
    return product?.sizes?.filter(size => size.stock > 0) || [];
  }, [product, selectedColor]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product) return <Message variant="danger">Product not found</Message>;

  return (
    <>
      <Meta title={product.name} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link className="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors" to="/">
          Go Back
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="relative">
              {currentImages.length > 0 ? (
                <img 
                  src={currentImages[currentImageIndex] || currentImages[0]} 
                  alt={product.name} 
                  className="w-full rounded-lg" 
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
              {currentImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.numReviews} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
                )}
              </div>
              
              {/* Description */}
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Select Color</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`px-4 py-2 border rounded-md transition-colors ${
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
                </div>
              </div>
            )}
            
            
            {/* Size Selection */}
            <div>
              <h4 className="font-semibold mb-3">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size.size}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      selectedSize === size.size
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSize(size.size)}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <h4 className="font-semibold mb-3">Quantity</h4>
              <select
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={addToCartHandler}
                disabled={!product.inStock || availableSizes.length === 0}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
                  !product.inStock || availableSizes.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <FaShoppingCart className="inline mr-2" />
                {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button
                onClick={toggleWishlist}
                className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaHeart className={isWishlisted ? 'text-red-500' : 'text-gray-400'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductScreen;
