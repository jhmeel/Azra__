import React from "react";
import { Link } from "react-router-dom";
import notFound from "../assets/notfound.svg";
import Footer from "../components/Footer";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col justify-center items-center bg-gray-100 py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          <img
            src={notFound}
            alt="404 Not Found"
            className="w-full h-auto mb-8 max-w-xs mx-auto"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page not found
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Go to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
