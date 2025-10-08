import React from 'react';
import Meta from '../components/Meta';

const AboutScreen = () => {
  return (
    <>
      <Meta title="About Us - YOUTH CIRCLE" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">ABOUT YOUTH CIRCLE</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your premier destination for premium fashion, where style meets quality for the modern generation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                YOUTH CIRCLE was born from a passion for fashion and a commitment to quality. 
                We believe that everyone deserves access to premium clothing that reflects their 
                unique style and personality.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our carefully curated collection features the latest trends in men's and ladies' 
                fashion, from casual wear to formal attire. We work with trusted brands and 
                manufacturers to ensure every piece meets our high standards.
              </p>
              <p className="text-lg text-gray-600">
                Join the YOUTH CIRCLE community and discover fashion that empowers you to 
                express yourself with confidence.
              </p>
            </div>

            {/* Image */}
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">👔</div>
                <p className="text-lg">Premium Fashion Collection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully selected and tested 
                to ensure it meets our high standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We stay ahead of fashion trends and continuously innovate to bring you 
                the latest styles and designs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Care</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We provide exceptional customer service 
                and support throughout your shopping journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The passionate people behind YOUTH CIRCLE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alex Johnson</h3>
              <p className="text-gray-600 mb-2">Founder & CEO</p>
              <p className="text-sm text-gray-500">
                Fashion enthusiast with 10+ years in the industry, passionate about bringing 
                quality fashion to everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👩‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Chen</h3>
              <p className="text-gray-600 mb-2">Head of Design</p>
              <p className="text-sm text-gray-500">
                Creative director with an eye for trends and a passion for sustainable fashion.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Rodriguez</h3>
              <p className="text-gray-600 mb-2">Tech Lead</p>
              <p className="text-sm text-gray-500">
                Technology expert ensuring our platform provides the best shopping experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Join the YOUTH CIRCLE</h2>
          <p className="text-xl text-gray-300 mb-8">
            Be part of a community that values style, quality, and self-expression.
          </p>
          <a
            href="/"
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </>
  );
};

export default AboutScreen;
