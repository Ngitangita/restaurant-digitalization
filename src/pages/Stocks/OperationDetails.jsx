import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from 'dayjs';

function OperationDetails({ operationId, onClose }) {
  const [operationDetails, setOperationDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${apiUrl("/operations/details/")}${operationId}`;
    fetchJson(url)
      .then((data) => {
        setOperationDetails(data);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError("Erreur lors de la récupération des détails de l'opération.");
      });
  }, [operationId]);

  if (!operationDetails) {
    return <div>Chargement des détails...</div>;
  }

  return (
    <div className="p-8">
        {error && <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>}
        {!error && (
          <>
            <p><strong>Nom de l'Ingrédient:</strong> {operationDetails.ingredientName}</p>
            <h3 className="text-md font-semibold mt-4">Liste des opérations résumées :</h3>
            <ul className="h-[300px] overflow-y-auto scrollbar-custom">
              {operationDetails.operations.map((op) => (
                <li key={op.id} className="border-b border-gray-300 py-2">
                  <p><strong>Type:</strong> {op.type}</p>
                  <p><strong>Date:</strong> {dayjs(op.date).format('YYYY-MM-DD HH:mm')}</p>
                  <p><strong>Description:</strong> {op.description}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Fermer
        </button>
      </div>
  );
}

export default OperationDetails;
