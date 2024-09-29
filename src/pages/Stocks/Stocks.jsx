import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateStock from '../../components/addStocks/CreateStock';

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchJson(apiUrl("/stocks"));
                setStocks(data);
            } catch (err) {
                setError('Erreur lors de la récupération des stocks');
            }
        })();
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Stocks</h1>
            {error && <p className="text-red-500">{error}</p>}
            
            <button 
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={toggleModal}
            >
                Créer un stock
            </button>

            {/* Modale pour ajouter un stock */}
            {isModalOpen && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Ajouter un nouveau stock</h2>
                        
                        {/* Remplacement par CreateStock */}
                        <CreateStock />

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
                        <th className="py-2 px-4">Ingrédient</th>
                        <th className="py-2 px-4">Quantité</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map(stock => (
                        <tr key={stock.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4">{stock.id}</td>
                            <td className="py-2 px-4">{stock.ingredient_name}</td>
                            <td className="py-2 px-4">{stock.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
