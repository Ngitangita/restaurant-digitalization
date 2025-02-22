import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

function CashHistoryById() {
  const [cashDetails, setCashDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) {
      setError("ID de l'historique non fourni.");
      return;
    }

    const url = apiUrl(`/histories/${id}`);
    fetchJson(url)
      .then((data) => {
        setCashDetails(data);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError("Erreur lors de la récupération des détails du cash by id.");
      });
  }, [id]);

  if (!cashDetails) {
    return <div>Chargement des détails...</div>;
  }

  return (
    <div className="p-8">
      {error && <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>}
      {!error && (
        <>
          <h3 className="text-md font-semibold mt-4">Liste des historiques dans la caisse :</h3>
          <ul
            className="h-[300px] overflow-y-auto scrollbar-custom border border-collapse p-4"
            onMouseEnter={() => setShowScrollbar(true)}
            onMouseLeave={() => setShowScrollbar(false)}
            style={{
              scrollbarWidth: showScrollbar ? "thin" : "none",
              overflowY: showScrollbar ? "scroll" : "hidden",
            }}
          >
            <li key={cashDetails.id} className="border-b border-gray-300 py-2">
              <p>
                <strong>Type de transaction:</strong> {cashDetails.transactionType}
              </p>
              <p>
                <strong>Méthode de paiement:</strong> {cashDetails.modeOfTransaction}
              </p>
              <p>
                <strong>Prix:</strong> {cashDetails.amount}
              </p>
              <p>
                <strong>Date:</strong> {dayjs(cashDetails.transactionDate).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>
                <strong>Description:</strong> {cashDetails.description}
              </p>
            </li>
          </ul>
        </>
      )}
      <button
        onClick={() => navigate("/history")}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
       Retour vers l&apos;historique
      </button>
    </div>
  );
}

export default CashHistoryById;
