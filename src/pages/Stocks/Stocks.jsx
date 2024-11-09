import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import { FaRegEdit } from 'react-icons/fa';
import OperationDetails from "./OperationDetails";
import CreateStock from "../../components/addStocks/CreateStock";

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [searchName, setSearchName] = useState("");
  const [quantityMin, setQuantityMin] = useState("");
  const [quantityMax, setQuantityMax] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [operationDetails, setOperationDetails] = useState(null);
  const [selectedOperationId, setSelectedOperationId] = useState(null);

  useEffect(() => {

    setIsLoading(true);
    setError(null);
    const url = `${apiUrl("/stocks")}?size=${size}&page=${page - 1}&name=${searchName}&quantityMin=${quantityMin}&quantityMax=${quantityMax}&startDate=${startDate}&endDate=${endDate}`;

    console.log("Requête API URL:", url);

    fetchJson(url)
      .then((d) => {
        console.log("Données récupérées :", d);
        setStocks(d.items || []);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Une erreur s'est produite lors du chargement des stocks.");
        setIsLoading(false);
      });
  }, [size, page, searchName, quantityMin, quantityMax, startDate, endDate]);


  useEffect(() => {
    setPage(1);
  }, [searchName, quantityMin, quantityMax, startDate, endDate]);

  const toggleModal = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(!isModalOpen);
  };

  const fetchOperationDetails = (stockId) => {
    setSelectedOperationId(stockId);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setOperationDetails(null);
  };

  const handleStockCreated = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
    setSuccessMessage("Le stock a été mis à jour avec succès.");
    setTimeout(() => setSuccessMessage(null), 3000);
    setPage(1);
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

      <div className="flex-grow overflow-auto">
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
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-2 text-red-500">{error}</td>
              </tr>
            ) : stocks.length > 0 ? (
              stocks.map((stock) => (
                <tr key={stock.id} className='text-center'>
                  <td className="border-b p-2">{new Date(stock.createdAt).toLocaleDateString()}</td>
                  <td className="border-b p-2">{new Date(stock.updatedAt).toLocaleDateString()}</td>
                  <td className="border-b p-2">{stock.ingredientName}</td>
                  <td className={`border-b p-2 ${stock.quantity <= 5 ? 'text-red-500 font-bold' : ''}`}>
                    {stock.quantity}
                    {stock.quantity <= 5 && (
                      <div className="text-red-500 text-[10px]">⚠️ Stock faible! Ajoutez du stock.</div>
                    )}
                  </td>
                  <td className="border-b p-2 flex justify-center">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2"
                      onClick={() => toggleModal(stock)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
                      onClick={() => fetchOperationDetails(stock.id)}
                    >
                      Voir Détails
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">Aucun stock trouvé</td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && selectedStock && (
          <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md EditModal">
              <div className='flex flex-row justify-between items-center'>
                <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le stock</h2>
                <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                  onClick={toggleModal}>
                  x
                </span>
              </div>
              <CreateStock
                onStockCreated={handleStockCreated}
                createStockModale={toggleModal}
                ingredientId={selectedStock ? selectedStock.ingredientId.toString() : ''}
                ingredientName={selectedStock ? selectedStock.ingredientName : ''}
              />
            </div>
          </div>
        )}

        {showDetailsModal && selectedOperationId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-1/2 DetailsModal">
              <div className='flex flex-row justify-between items-center'>
                <h2 className="text-xl pl-8 pt-8 pb-4">Détails de l'Opération</h2>
                <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                  onClick={closeDetailsModal}>
                  x
                </span>
              </div>
              <OperationDetails operationId={selectedOperationId} onClose={closeDetailsModal} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StockList;