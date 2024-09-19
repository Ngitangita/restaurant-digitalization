import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center max-w-md space-y-6">
        <div>
          <img
            src="/assets/error-404.png"
            alt="En cours de développement"
            className="max-w-full w-[400px] h-auto"
          />
        </div>
        <h1 className="text-3xl text-center">404 : La page que vous recherchez n&apos;est pas ici</h1>
        <p className="text-center text-gray-600">
          Vous avez soit essayé un chemin douteux, soit vous êtes arrivé ici par erreur. Quoi qu'il en soit, essayez d'utiliser la navigation.
        </p>
        <Link to="/" className="inline-flex items-center px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
          <FaArrowLeft size={24} className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
