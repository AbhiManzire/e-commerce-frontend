import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-4">
            <h5 className="text-lg font-semibold mb-3">About MearnSneakers</h5>
            <p className="text-gray-400 mb-4">
              Your premier destination for authentic sneakers, exclusive releases, and unbeatable deals.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="text-lg font-semibold mb-3">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shop</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h5 className="text-lg font-semibold mb-3">Customer Service</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h5 className="text-lg font-semibold mb-3">Newsletter</h5>
            <p className="text-gray-400 mb-3">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-600 rounded-l bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="text-center">
          <p className="text-gray-400">
            © 2024 MearnSneakers. All rights reserved.
          </p>
        </div>
      </div>  
    </footer>
  );
};

export default Footer;
