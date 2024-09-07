import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center max-w-md space-y-6">
        <div>
          <img
            src="/assets/error-404.png"
            alt="Under development"
            className="max-w-full w-[400px] h-auto"
          />
        </div>
        <h1 className="text-3xl text-center">404: The page you are looking for isn&apos;t here</h1>
        <p className="text-center text-gray-600">
          You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation.
        </p>
        <Link to="/" className="inline-flex items-center px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
          <FaArrowLeft size={24} className="mr-2" />
          Go back to home
        </Link>
      </div>
    </main>
  );
}
