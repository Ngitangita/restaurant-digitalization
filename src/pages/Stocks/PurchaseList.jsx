import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import dayjs from 'dayjs';

function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [ingredientName, setIngredientName] = useState('');
  const [error, setError] = useState(null); 
  useEffect(() => {
    const fetchPurchases = async () => {
      const url = `${apiUrl('/purchases')}?page=${page - 1}&size=${size}&ingredientName=${ingredientName}`;
      try {
        const data = await fetchJson(url);
        setPurchases(data.items || []);
        setError(null); 
      } catch (e) {
        console.error(e);
        setError('Erreur lors de la récupération des achats.'); 
      }
    };

    fetchPurchases();
  }, [page, size, ingredientName]);

  


  return (
    <div className="w-full p-4 bg-gray-100 PurchaseList">
      {error && <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          placeholder="Rechercher par nom d'ingrédient"
          className="border border-gray-300 p-2 rounded-lg"
        />
      </div>

      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg PurchaseList">
          <thead >
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Nom Ingrédient</th>
              <th className="py-2 px-4">Quantité</th>
              <th className="py-2 px-4">Coût</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Créé à</th>
              <th className="py-2 px-4">Mis à jour à</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((purchase) => (
                <tr key={purchase.purchaseId} className="border-b border-gray-200">
                  <td className="py-2 px-4">{purchase.ingredientName}</td>
                  <td className="py-2 px-4">{purchase.quantity}</td>
                  <td className="py-2 px-4">{purchase.cost}</td>
                  <td className="py-2 px-4">{purchase.description}</td>
                  <td className="py-2 px-4">{dayjs(purchase.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                  <td className="py-2 px-4">{dayjs(purchase.updatedAt).format('YYYY-MM-DD HH:mm')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default PurchaseList;
