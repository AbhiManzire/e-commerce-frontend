import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaChevronDown } from 'react-icons/fa';
import { logout } from '../store/slices/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [keyword, setKeyword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setShowSearch(false);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  const NavDropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative group">
        <button
          className="flex items-center text-white hover:text-white hover:bg-blue-500 px-4 py-2 rounded-md transition-all duration-300 font-semibold text-sm uppercase tracking-wide hover:shadow-lg hover:scale-105"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {title}
          <FaChevronDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
        </button>
        <div
          className={`absolute top-full left-0 bg-blue-700 border border-blue-500 rounded-lg shadow-2xl min-w-56 z-50 transition-all duration-300 ${
            isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </div>
      </div>
    );
  };

  const NavDropdownItem = ({ href, children }) => (
    <Link
      to={href}
      className="block px-4 py-3  hover:text-white hover:bg-blue-500 transition-all duration-300 font-medium text-sm hover:shadow-md hover:translate-x-1"
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 text-white">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="Youth Circle Logo" 
              // src="/logos.jpg" alt="Youth Circle Logo
              className="h-10 w-auto object-contain transition-opacity duration-300"
              loading="eager"
              decoding="sync"
              onLoad={(e) => {
                e.target.style.opacity = '1';
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
              style={{ opacity: 0 }}
            />
            <div className="text-white font-bold text-xl tracking-wide hidden">
              <span className="text-yellow-400">YOUTH</span>
              <span className="text-white ml-1">CIRCLE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md transition-all duration-300 font-semibold text-sm uppercase tracking-wide hover:shadow-lg hover:scale-105 ${
                location.pathname === '/' 
                  ? 'text-white bg-blue-500 shadow-lg' 
                  : 'text-white hover:text-white hover:bg-blue-500'
              }`}
            >
              HOME
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 rounded-md transition-all duration-300 font-semibold text-sm uppercase tracking-wide hover:shadow-lg hover:scale-105 ${
                location.pathname === '/about' 
                ? 'text-white bg-blue-500 shadow-lg' 
                  : 'text-white hover:text-white hover:bg-blue-500'
              }`}
            >
              ABOUT
            </Link>
            <Link 
              to="/contact" 
              className={`px-4 py-2 rounded-md transition-all duration-300 font-semibold text-sm uppercase tracking-wide hover:shadow-lg hover:scale-105 ${
                location.pathname === '/contact' 
                ? 'text-white bg-blue-500 shadow-lg' 
                  : 'text-white hover:text-white hover:bg-blue-500'
              }`}
            >
              CONTACT
            </Link>
            <NavDropdown title="MEN">
              <NavDropdownItem href="/category/men-clothing">Clothing</NavDropdownItem>
              <NavDropdownItem href="/category/men-accessories">Accessories</NavDropdownItem>
              <NavDropdownItem href="/category/men-sport">Sport</NavDropdownItem>
              <div className="border-t border-gray-600 my-1"></div>
              <NavDropdownItem href="/category/tshirt">T-Shirt</NavDropdownItem>
              <NavDropdownItem href="/category/shirt">Shirt</NavDropdownItem>
              <NavDropdownItem href="/category/cargo">Cargo</NavDropdownItem>
              <NavDropdownItem href="/category/jeans">Jeans</NavDropdownItem>
              <NavDropdownItem href="/category/trousers">Trousers</NavDropdownItem>
              <NavDropdownItem href="/category/hoodies-sweaters">Hoodies & Sweaters</NavDropdownItem>
              <NavDropdownItem href="/category/sneakers">Sneakers</NavDropdownItem>
              <NavDropdownItem href="/category/flipflop">Flip Flop</NavDropdownItem>
            </NavDropdown>
            
            <NavDropdown title="LADIES">
              <NavDropdownItem href="/category/ladies-clothing">Clothing</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-shoes">Shoes</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-accessories">Accessories</NavDropdownItem>
              <NavDropdownItem href="/category/lingerie">Lingerie</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-sport">Sport</NavDropdownItem>
              <div className="border-t border-gray-600 my-1"></div>
              <NavDropdownItem href="/category/ladies-tshirt">T-Shirt</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-shirt">Shirt</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-cargo">Cargo</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-jeans">Jeans</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-shorts">Shorts</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-trousers">Trousers</NavDropdownItem>
              <NavDropdownItem href="/category/ladies-hoodies">Hoodies</NavDropdownItem>
              <NavDropdownItem href="/category/coord-set">Co-ord Set</NavDropdownItem>
            </NavDropdown>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaSearch className="text-xl" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative text-white hover:text-gray-300 transition-colors">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {userInfo ? (
              <div className="relative group">
                <button className="flex items-center text-white hover:text-gray-300 transition-colors">
                  <FaUser className="text-xl" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-blue-700 border border-blue-500 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-blue-500">
                    <p className="text-white font-medium">{userInfo.name}</p>
                    <p className="text-gray-400 text-sm">{userInfo.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-500 transition-colors"
                  >
                    Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-500 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-white hover:text-gray-300 transition-colors">
                <FaUser className="text-xl" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-gray-300 transition-colors"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>

        {/* Search Bar (Conditional) */}
        {showSearch && (
          <div className="py-4 border-t border-gray-700">
            <form onSubmit={submitHandler} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-blue-700 border-t border-blue-500">
            <div className="px-4 py-2">
              <form onSubmit={submitHandler}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-4 py-2 pl-10 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </form>
            </div>
            
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wide ${
                  location.pathname === '/' 
                   ? 'text-white bg-blue-500 shadow-lg' 
                  : 'text-white hover:text-white hover:bg-blue-500'
                }`}
              >
                HOME
              </Link>
              <Link
                to="/about"
                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wide ${
                  location.pathname === '/about' 
                  ? 'text-white bg-blue-500 shadow-lg' 
                  : 'text-white hover:text-white hover:bg-blue-500'
                }`}
              >
                ABOUT
              </Link>
              <Link
                to="/contact"
                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wide ${
                  location.pathname === '/contact' 
                    ? 'text-yellow-400 bg-blue-500 shadow-lg' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-blue-500 hover:shadow-md'
                }`}
              >
                CONTACT
              </Link>
              
              <div className="text-yellow-400 font-bold mb-3 mt-6 text-lg">MEN</div>
              <Link
                to="/category/tshirt"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                T-Shirt
              </Link>
              <Link
                to="/category/shirt"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                Shirt
              </Link>
              <Link
                to="/category/jeans"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                Jeans
              </Link>
              <Link
                to="/category/sneakers"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                Sneakers
              </Link>
              
              <div className="text-yellow-400 font-bold mb-3 mt-6 text-lg">LADIES</div>
              <Link
                to="/category/ladies-tshirt"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                T-Shirt
              </Link>
              <Link
                to="/category/ladies-jeans"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                Jeans
              </Link>
              <Link
                to="/category/ladies-shorts"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                Shorts
              </Link>
              <Link
                to="/category/coord-set"
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium hover:shadow-md hover:translate-x-1"
              >
                Co-ord Set
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
