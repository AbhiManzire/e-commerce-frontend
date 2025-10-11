import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaFilter, FaSort, FaStar, FaHeart } from 'react-icons/fa';
import { fetchProducts, fetchFilterOptions } from '../store/slices/productSlice';
import Product from '../components/Product';
import ProductCarousel from '../components/ProductCarousel';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword, pageNumber, category } = useParams();
  
  const { products, loading, error, page, pages, filterOptions } = useSelector((state) => state.product);
  console.log('Products from Redux**************************************:', products);
  console.log('Products count:', products ? products.length : 0);
  if (products && products.length > 0) {
    console.log('First product:', products[0]);
    console.log('First product images:', products[0].images);
    console.log('Product categories:', [...new Set(products.map(p => p.category))]);
    console.log('Products per category:');
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    console.log(categoryCounts);
    
    // Check for invalid products
    const invalidProducts = products.filter(p => !p._id || !p.name || !p.category || !p.images || p.images.length === 0);
    if (invalidProducts.length > 0) {
      console.log('Invalid products found:', invalidProducts.length);
      console.log('Invalid products:', invalidProducts);
    }
  }
  // Filter states
  const [filters, setFilters] = useState({
    category: category || '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    featured: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    color: '',
    size: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options on component mount
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      pageNumber: pageNumber || 1
    };
    
    // Only add non-empty filter values
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.color) params.color = filters.color;
    if (filters.size) params.size = filters.size;
    if (filters.inStock) params.inStock = filters.inStock;
    if (filters.featured) params.featured = filters.featured;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    
    if (keyword) {
      params.keyword = keyword;
    }
    
    if (category) {
      params.category = category;
    }
    
    // For homepage, fetch more products to show in carousels
    if (!keyword && !category) {
      params.pageSize = 200; // Fetch all products for homepage to ensure all categories are represented
    }
    
    dispatch(fetchProducts(params));
  }, [dispatch, keyword, pageNumber, category, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: category || '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      color: '',
      size: ''
    });
  };

  // Get category display name
  const getCategoryDisplayName = (cat) => {
    const categoryNames = {
      // Men's Categories
      'tshirt': 'Men\'s T-Shirts',
      'shirt': 'Men\'s Shirts',
      'jeans': 'Men\'s Jeans',
      'sneakers': 'Men\'s Sneakers',
      'cargo': 'Men\'s Cargo',
      'trousers': 'Men\'s Trousers',
      'hoodies-sweaters': 'Men\'s Hoodies & Sweaters',
      'flipflop': 'Men\'s Flip Flops',
      'men-sport': 'Men\'s Sport',
      'men-accessories': 'Men\'s Accessories',
      
      // Ladies' Categories
      'ladies-tshirt': 'Ladies\' T-Shirts',
      'ladies-shirt': 'Ladies\' Shirts',
      'ladies-jeans': 'Ladies\' Jeans',
      'ladies-shorts': 'Ladies\' Shorts',
      'coord-set': 'Ladies\' Co-ord Sets',
      'ladies-cargo': 'Ladies\' Cargo',
      'ladies-trousers': 'Ladies\' Trousers',
      'ladies-hoodies': 'Ladies\' Hoodies',
      'ladies-sport': 'Ladies\' Sport',
      'ladies-clothing': 'Ladies\' Clothing',
      'ladies-accessories': 'Ladies\' Accessories',
      'lingerie': 'Ladies\' Lingerie',
      
      // Legacy categories (if still needed)
      'mobile': 'Mobile Phones',
      'watches': 'Watches',
      'bags': 'Bags',
      'men': 'Men\'s Collection',
      'ladies': 'Ladies\' Collection'
    };
    return categoryNames[cat] || cat;
  };

  // If it's homepage (no keyword or category), show carousels
  if (!keyword && !category) {
    return (
      <>
        <Meta />
        
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 py-20 overflow-hidden">
          
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8 inline-block transform hover:scale-105 transition-transform duration-300">
                <img src="/logos.jpg" alt="Youth Circle Logo" className="h-[350px] w-auto mx-auto " />
              </div>
            </div>
          </div>
        </div>

        {/* Product Carousels */}
        <div className="space-y-8">
          {/* Men's Categories */}
          <div className="space-y-6">
            {/* Men's Collection Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-90"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
              <div className="relative z-10 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <div className="inline-block">
                    <h2 className="text-5xl font-bold text-white mb-4 tracking-wider transform hover:scale-105 transition-transform duration-300">
                      MEN'S COLLECTION
                    </h2>
                    <div className="w-32 h-1 bg-white mx-auto rounded-full"></div>
                    <p className="text-white text-lg mt-4 opacity-90">
                      Discover the latest trends in men's fashion
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Men's T-Shirts */}
            <ProductCarousel 
              title="MEN'S T-SHIRTS" 
              products={products.filter(p => p.category === 'tshirt')}
              category="tshirt"
              theme="mens"
            />

            {/* Men's Shirts */}
            <ProductCarousel 
              title="MEN'S SHIRTS" 
              products={products.filter(p => p.category === 'shirt')}
              category="shirt"
              theme="mens"
            />

            {/* Men's Jeans */}
          <ProductCarousel 
              title="MEN'S JEANS" 
              products={products.filter(p => p.category === 'jeans')}
              category="jeans"
              theme="mens"
          />

            {/* Men's Sneakers */}
          <ProductCarousel 
              title="MEN'S SNEAKERS" 
              products={products.filter(p => p.category === 'sneakers')}
            category="sneakers"
            theme="mens"
          />

            {/* Men's Cargo */}
            <ProductCarousel 
              title="MEN'S CARGO" 
              products={products.filter(p => p.category === 'cargo')}
              category="cargo"
              theme="mens"
            />

            {/* Men's Trousers */}
          <ProductCarousel 
              title="MEN'S TROUSERS" 
              products={products.filter(p => p.category === 'trousers')}
              category="trousers"
              theme="mens"
            />

            {/* Men's Hoodies & Sweaters */}
          <ProductCarousel 
              title="MEN'S HOODIES & SWEATERS" 
              products={products.filter(p => p.category === 'hoodies-sweaters')}
              category="hoodies-sweaters"
              theme="mens"
            />

            {/* Men's Flip Flops */}
          <ProductCarousel 
              title="MEN'S FLIP FLOPS" 
              products={products.filter(p => p.category === 'flipflop')}
              category="flipflop"
              theme="mens"
            />

            {/* Men's Sport */}
          <ProductCarousel 
              title="MEN'S SPORT" 
              products={products.filter(p => p.category === 'men-sport')}
              category="men-sport"
              theme="mens"
            />

            {/* Men's Accessories */}
          <ProductCarousel 
              title="MEN'S ACCESSORIES" 
              products={products.filter(p => p.category === 'men-accessories')}
              category="men-accessories"
              theme="mens"
          />
        </div>

          {/* Ladies' Categories */}
          <div className="space-y-6">
            {/* Ladies' Collection Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 opacity-90"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
              <div className="relative z-10 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <div className="inline-block">
                    <h2 className="text-5xl font-bold text-white mb-4 tracking-wider transform hover:scale-105 transition-transform duration-300">
                      LADIES' COLLECTION
                    </h2>
                    <div className="w-32 h-1 bg-white mx-auto rounded-full"></div>
                    <p className="text-white text-lg mt-4 opacity-90">
                      Explore elegant and trendy women's fashion
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ladies' T-Shirts */}
            <ProductCarousel 
              title="LADIES' T-SHIRTS" 
              products={products.filter(p => p.category === 'ladies-tshirt')}
              category="ladies-tshirt"
              theme="ladies"
            />

            {/* Ladies' Shirts */}
            <ProductCarousel 
              title="LADIES' SHIRTS" 
              products={products.filter(p => p.category === 'ladies-shirt')}
              category="ladies-shirt"
              theme="ladies"
            />

            {/* Ladies' Jeans */}
            <ProductCarousel 
              title="LADIES' JEANS" 
              products={products.filter(p => p.category === 'ladies-jeans')}
              category="ladies-jeans"
              theme="ladies"
            />

            {/* Ladies' Shorts */}
            <ProductCarousel 
              title="LADIES' SHORTS" 
              products={products.filter(p => p.category === 'ladies-shorts')}
              category="ladies-shorts"
              theme="ladies"
            />

            {/* Ladies' Co-ord Sets */}
            <ProductCarousel 
              title="LADIES' CO-ORD SETS" 
              products={products.filter(p => p.category === 'coord-set')}
              category="coord-set"
              theme="ladies"
            />

            {/* Ladies' Cargo */}
            <ProductCarousel 
              title="LADIES' CARGO" 
              products={products.filter(p => p.category === 'ladies-cargo')}
              category="ladies-cargo"
              theme="ladies"
            />

            {/* Ladies' Trousers */}
            <ProductCarousel 
              title="LADIES' TROUSERS" 
              products={products.filter(p => p.category === 'ladies-trousers')}
              category="ladies-trousers"
              theme="ladies"
            />

            {/* Ladies' Hoodies */}
            <ProductCarousel 
              title="LADIES' HOODIES" 
              products={products.filter(p => p.category === 'ladies-hoodies')}
              category="ladies-hoodies"
              theme="ladies"
            />

            {/* Ladies' Sport */}
            <ProductCarousel 
              title="LADIES' SPORT" 
              products={products.filter(p => p.category === 'ladies-sport')}
              category="ladies-sport"
              theme="ladies"
            />

            {/* Ladies' Clothing */}
            <ProductCarousel 
              title="LADIES' CLOTHING" 
              products={products.filter(p => p.category === 'ladies-clothing')}
              category="ladies-clothing"
              theme="ladies"
            />

            {/* Ladies' Accessories */}
            <ProductCarousel 
              title="LADIES' ACCESSORIES" 
              products={products.filter(p => p.category === 'ladies-accessories')}
              category="ladies-accessories"
              theme="ladies"
            />

            {/* Ladies' Lingerie */}
            <ProductCarousel 
              title="LADIES' LINGERIE" 
              products={products.filter(p => p.category === 'lingerie')}
              category="lingerie"
              theme="ladies"
            />
          </div>
        </div>

      </>
    );
  }

  // For search/category pages, show the original layout
  return (
    <>
      <Meta />
      
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                {keyword ? 'SEARCH' : category ? 'CATEGORY' : 'STEALS'}
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-bold text-black mb-2">
                {keyword ? `SEARCH: ${keyword.toUpperCase()}` : 
                 category ? getCategoryDisplayName(category).toUpperCase() : 
                 'ALL SNEAKERS'}
              </h1>
              <p className="text-black text-lg">
                {keyword ? `Search results for "${keyword}"` :
                 category ? `Discover amazing ${getCategoryDisplayName(category).toLowerCase()}` :
                 'Discover the latest releases and exclusive deals'}
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border h-fit">
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-600" />
                  <span className="font-semibold">Filters</span>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  {showFilters ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showFilters && (
                <div className="p-4 space-y-4">
                  {/* Category Filter */}
                  <div>
                    <h6 className="font-semibold mb-2">Category</h6>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {filterOptions.categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Filter */}
                  <div>
                    <h6 className="font-semibold mb-2">Size</h6>
                    <select
                      value={filters.size || ''}
                      onChange={(e) => handleFilterChange('size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Sizes</option>
                      {filterOptions.sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <h6 className="font-semibold mb-2">Price</h6>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h6 className="font-semibold mb-2">Brand</h6>
                    <select
                      value={filters.brand || ''}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Brands</option>
                      {filterOptions.brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <h6 className="font-semibold mb-2">Color</h6>
                    <select
                      value={filters.color || ''}
                      onChange={(e) => handleFilterChange('color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Colors</option>
                      {filterOptions.colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* In Stock Only */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">In stock only</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FaSort className="text-gray-600" />
                <span className="font-semibold">Sort by:</span>
              </div>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt-desc">Featured</option>
                <option value="rating-desc">Best selling</option>
                <option value="name-asc">Alphabetically, A-Z</option>
                <option value="name-desc">Alphabetically, Z-A</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="createdAt-asc">Date, old to new</option>
                <option value="createdAt-desc">Date, new to old</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>
                
                <Paginate
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                  category={category ? category : ''}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
