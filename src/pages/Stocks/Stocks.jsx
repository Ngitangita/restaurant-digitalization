import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateStock from '../../components/addStocks/CreateStock';
import { FaRegEdit } from 'react-icons/fa';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null); // État pour le stock sélectionné
  const [searchName, setSearchName] = useState('');
  const [quantityMin, setQuantityMin] = useState('');
  const [quantityMax, setQuantityMax] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Par exemple, 5 éléments par page
  const indexOfLastStock = currentPage * itemsPerPage;
  const indexOfFirstStock = indexOfLastStock - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);


  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams({
        ingredientName: searchName || "",
        quantityMin: quantityMin ? quantityMin.toString() : "",
        quantityMax: quantityMax ? quantityMax.toString() : "",
        startDate: startDate || "",
        endDate: endDate || ""
      }).toString();

      const res = await fetch(apiUrl(`/stocks?${searchParams}`), {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des stocks');
      }

      const data = await res.json();
      setStocks(data.items || []);
      setSuccessMessage(null);
    } catch (err) {
      setError('Erreur lors de la récupération des stocks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [searchName, quantityMin, quantityMax, startDate, endDate]);

  const toggleModal = (stock = null) => {
    setSelectedStock(stock);
    setIsModalOpen(!isModalOpen);
  };

  const handleStockCreated = () => {
    setSuccessMessage("Stock créé avec succès!");
    setIsModalOpen(false);
    fetchStocks();
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(stocks.length / itemsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };


  return (
    <div className="StockList container mx-auto p-4 bg-white pb-10">
      <h1 className="text-2xl font-bold mb-4">Liste des Stocks</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 p-2 rounded-md mr-2 outline-none"
        />
        <input
          type="number"
          placeholder="Quantité Min"
          value={quantityMin}
          onChange={(e) => setQuantityMin(e.target.value)}
          className="w-36 border border-gray-300 p-2 rounded-md mr-2 outline-none"
        />
        <input
          type="number"
          placeholder="Quantité Max"
          value={quantityMax}
          onChange={(e) => setQuantityMax(e.target.value)}
          className="w-36 border border-gray-300 p-2 rounded-md mr-2 outline-none"
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={() => document.activeElement.blur()}
          className="border border-gray-300 p-2 rounded-md mr-2 outline-none"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={() => document.activeElement.blur()}
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Créé</th>
            <th className="p-2">Mis à jour</th>
            <th className="p-2">Ingrédient</th>
            <th className="p-2">Quantité</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center py-2">Chargement...</td>
            </tr>
          ) : (
            currentStocks.length > 0 ? (
              currentStocks.map((stock) => (
                <tr key={stock.id} className='text-center'>
                  <td className="border-b p-2">{new Date(stock.createdAt).toLocaleDateString()}</td>
                  <td className="border-b p-2">{new Date(stock.updatedAt).toLocaleDateString()}</td>
                  <td className="border-b p-2">{stock.ingredientName}</td>
                  <td className={`border-b p-2 ${stock.quantity <= 5 ? 'text-red-500 font-bold' : ''}`}>
                    {stock.quantity}
                    {stock.quantity <= 5 && (
                      <div className="text-red-500 font-bold">⚠️ Stock faible! Ajoutez du stock.</div>
                    )}
                  </td>
                  <td className="border-b p-2">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                      onClick={() => toggleModal(stock)}
                    >
                      <FaRegEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">Aucun stock trouvé</td>
              </tr>
            )
          )}
        </tbody>

      </table>
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className="self-center">{`Page ${currentPage} sur ${Math.ceil(stocks.length / itemsPerPage)}`}</span>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(stocks.length / itemsPerPage)}
        >
          Suivant
        </button>
      </div>


      {isModalOpen && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md EditModal">
            <h2 className="text-lg font-bold mb-4">Modifier le stock</h2>
            <CreateStock
              onStockCreated={handleStockCreated}
              createStockModale={toggleModal}
              ingredientId={selectedStock ? selectedStock.ingredientId.toString() : ''}
              ingredientName={selectedStock ? selectedStock.ingredientName : ''}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default StockList;
