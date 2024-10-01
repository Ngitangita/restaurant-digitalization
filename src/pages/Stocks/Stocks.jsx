import React, { useState } from 'react';
import CreateStock from '../../components/addStocks/CreateStock';

const StockList = () => {
    // Stock simulé, géré localement sans backend
    const [stocks, setStocks] = useState([
        { id: 1, ingredientId: 101, quantity: 20, cost: 50, description: 'Farine de blé' },
        { id: 2, ingredientId: 102, quantity: 10, cost: 30, description: 'Sucre blanc' },
        { id: 3, ingredientId: 103, quantity: 15, cost: 40, description: 'Lait en poudre' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    // Pagination: calculer les éléments affichés
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStocks = stocks.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination: changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(stocks.length / itemsPerPage);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const addStock = (newStock) => {
        setStocks([...stocks, { id: stocks.length + 1, ...newStock }]);
    };

    return (
        <div className="StockList container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Stocks</h1>
            
            <button 
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={toggleModal}
            >
                Créer un stock
            </button>

            {/* Modale pour ajouter un stock */}
            {isModalOpen && 
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="createStockModale bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-16">
                        <h2 className="text-lg font-bold mb-4">Ajouter un nouveau stock</h2>
                        
                        {/* Formulaire d'ajout de stock */}
                        <CreateStock onAddStock={addStock} createStockModale={toggleModal}/>
                    </div>
                </div>
            }

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">ID</th>
                        <th className="py-2 px-4">ID Ingrédient</th>
                        <th className="py-2 px-4">Quantité</th>
                        <th className="py-2 px-4">Coût</th>
                        <th className="py-2 px-4">Description</th>
                    </tr>
                </thead>
                <tbody className='StockListTBody'>
                    {currentStocks.length === 0 ? (
                        <tr className="text-center">
                            <td colSpan="5" className="py-4 text-gray-500">
                                Aucun stock disponible
                            </td>
                        </tr>
                    ) : (
                        currentStocks.map(stock => (
                            <tr key={stock.id} className="hover:bg-gray-100 dark:hover:bg-slate-700">
                                <td className="py-2 px-4">{stock.id}</td>
                                <td className="py-2 px-4">{stock.ingredientId}</td>
                                <td className="py-2 px-4">{stock.quantity}</td>
                                <td className="py-2 px-4">{stock.cost}</td>
                                <td className="py-2 px-4">{stock.description || 'Aucune description'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {stocks.length > 0 && (
                <div className="pagination flex justify-center items-center mt-4">
                    <button
                        className={`py-2 px-4 mx-1 ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={`py-2 px-4 mx-1 ${currentPage === index + 1 ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className={`py-2 px-4 mx-1 ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
};

export default StockList;
