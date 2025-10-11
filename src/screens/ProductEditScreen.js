import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { fetchProductById, updateProduct } from '../store/slices/productSlice';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [''],
    sizes: [{ size: '', stock: '' }],
    colors: [''],
    inStock: true,
    featured: false,
    rating: 0,
    numReviews: 0,
    tags: ['']
  });

  const categories = [
    'sneakers', 'shirts', 'pants', 'mobile', 'watches', 'bags', 'apparel', 'accessories', 'collectibles',
    'tshirt', 'shirt', 'cargo', 'jeans', 'trousers', 'hoodies-sweaters', 'flipflop',
    'ladies-tshirt', 'ladies-shirt', 'ladies-cargo', 'ladies-jeans', 'ladies-trousers', 'ladies-hoodies', 'ladies-shorts', 'coord-set',
    'men-clothing', 'men-accessories', 'men-sport', 'ladies-clothing', 'ladies-shoes', 'ladies-accessories', 'lingerie', 'ladies-sport'
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product._id) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || '',
        images: product.images && product.images.length > 0 ? product.images : [''],
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ size: '', stock: '' }],
        colors: product.colors && product.colors.length > 0 ? product.colors : [''],
        inStock: product.inStock !== undefined ? product.inStock : true,
        featured: product.featured || false,
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        tags: product.tags && product.tags.length > 0 ? product.tags : ['']
      });
    }
  }, [product]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleArrayInputChange = useCallback((field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  }, []);

  const addArrayItem = useCallback((field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  }, []);

  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  const addSizeItem = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: '' }]
    }));
  }, []);

  const removeSizeItem = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSizeChange = useCallback((index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.brand || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Clean up empty values
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      colors: formData.colors.filter(color => color.trim() !== ''),
      tags: formData.tags.filter(tag => tag.trim() !== ''),
      sizes: formData.sizes.filter(size => size.size.trim() !== ''),
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      rating: parseFloat(formData.rating),
      numReviews: parseInt(formData.numReviews)
    };

    try {
      await dispatch(updateProduct({ 
        id: id, 
        productData: cleanedData 
      })).unwrap();
      toast.success('Product updated successfully!');
      navigate('/admin/productlist');
    } catch (error) {
      toast.error('Failed to update product');
    }
  }, [dispatch, id, formData, navigate]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <>
      <Meta title="Edit Product | MearnSneakers" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/productlist')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  In Stock
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Featured
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleArrayInputChange('images', index, e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('images', index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('images')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-1" />
                Add Image
              </button>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors
              </label>
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleArrayInputChange('colors', index, e.target.value)}
                    placeholder="Color name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('colors', index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('colors')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-1" />
                Add Color
              </button>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sizes & Stock
              </label>
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center mb-2 space-x-2">
                  <input
                    type="text"
                    value={size.size}
                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                    placeholder="Size (e.g., S, M, L, XL)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={size.stock}
                    onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                    placeholder="Stock"
                    min="0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeItem(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSizeItem}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-1" />
                Add Size
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                    placeholder="Tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-1" />
                Add Tag
              </button>
            </div>

            {/* Rating & Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Reviews
                </label>
                <input
                  type="number"
                  name="numReviews"
                  value={formData.numReviews}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/productlist')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaSave className="mr-2" />
                Update Product
              </button>
          </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductEditScreen;
