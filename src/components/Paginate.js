import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, keyword = '', isAdmin = false }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-1 my-8">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${x + 1}`
                : `/page/${x + 1}`
              : `/admin/productlist/${x + 1}`
          }
          className={`px-3 py-2 border rounded-md transition-colors ${
            x + 1 === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
};

export default Paginate;
