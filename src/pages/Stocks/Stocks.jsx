import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateStock from '../../components/addStocks/CreateStock';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [quantityMin, setQuantityMin] = useState('');
  const [quantityMax, setQuantityMax] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const searchParams = new URLSearchParams({
          ingredientName: searchName || "",
          quantityMin: quantityMin ? quantityMin.toString() : "",
          quantityMax: quantityMax ? quantityMax.toString() : "",
          startDate: startDate || "",
          endDate: endDate || ""
        }).toString();
        
        const res = await fetch(apiUrl(`/stocks?page=${currentPage}&size=10&${searchParams}`), {
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
        setTotalPages(data.totalPages || 0);
        setSuccessMessage(null);
      } catch (err) {
        setError('Erreur lors de la récupération des stocks');
        console.error(err);
      }
    };

    fetchStocks();
  }, [searchName, quantityMin, quantityMax, startDate, endDate, currentPage]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleStockCreated = () => {
    setSuccessMessage("Stock créé avec succès!");
    setIsModalOpen(false);
  };

  return (
    <div className="StockList container mx-auto p-4">
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
          className="border border-gray-300 p-2 rounded-md mr-2 outline-none"
        />
        <input 
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
      </div>

      <button 
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        onClick={toggleModal}
      >
        Créer un stock
      </button>

      {isModalOpen && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Ajouter un nouveau stock</h2>
            <CreateStock onStockCreated={handleStockCreated} createStockModale={toggleModal}/>
          </div>
        </div>
      )}

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2">Ingrédient</th>
            <th className="border-b p-2">Quantité</th>
            <th className="border-b p-2">Coût</th>
            <th className="border-b p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {stocks.length > 0 ? stocks.map((stock) => (
            <tr key={stock.id} className='text-center'>
              <td className="border-b p-2">{stock.ingredientName}</td>
              <td className="border-b p-2">{stock.quantity}</td>
              <td className="border-b p-2">{stock.cost}</td>
              <td className="border-b p-2">{stock.description}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="border-b p-2 text-center">Aucun stock trouvé</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button 
          className="bg-gray-300 text-black py-2 px-4 rounded-md disabled:opacity-50" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Précédent
        </button>
        <span>Page {currentPage + 1} sur {totalPages}</span>
        <button 
          className="bg-gray-300 text-black py-2 px-4 rounded-md disabled:opacity-50" 
          onClick={() => setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : prev))}
          disabled={currentPage >= totalPages - 1}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StockList;
