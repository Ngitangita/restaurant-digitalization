import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateIngredient from './CreateIngredient';

const IngredientList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
       (async () => {
            try {
                const data = await fetchJson(apiUrl("/ingredients"));
                setIngredients(data);
            } catch (err) {
                setError('Erreur lors de la récupération des ingrédients');
            }
        })();
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Ingrédients</h1>
            {error && <p className="text-red-500">{error}</p>}
            <button 
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={toggleModal}
            >
                Créer un ingrédient
            </button>
            {isModalOpen && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center top-7">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Ajouter un nouvel ingrédient</h2>
                        <CreateIngredient />

                        <div className="flex justify-end mt-4">
                            <button 
                                type="button" 
                                onClick={toggleModal} 
                                className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">ID</th>
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4"> Unité</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map(ingredient => (
                        <tr key={ingredient.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4">{ingredient.id}</td>
                            <td className="py-2 px-4">{ingredient.name}</td>
                            <td className="py-2 px-4">{ingredient.unit_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IngredientList;
