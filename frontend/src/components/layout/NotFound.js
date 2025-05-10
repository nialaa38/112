// components/layout/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4 mb-4">404 - Page Not Found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <div className="mt-4">
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-door me-2"></i>Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;