import { useState, useEffect } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";

const ProfitsList = () => {
  const [profits, setProfits] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalMenuProfit, setTotalMenuProfit] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { showSuccess, showError } = useToast();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCashId, setSelectedCashId] = useState(null);

  useEffect(() => {
    fetchProfits();
    fetchTotalProfit();
    fetchTotalMenuProfit();
  }, [startDate, endDate]);

  const fetchProfits = async () => {
    let url = apiUrl("/profits");
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    try {
      const data = await fetchJson(url);
      setProfits(data);
      showSuccess("Données récupérées avec succès");
    } catch (error) {
      showError("Erreur lors de la récupération des profits: " + error.message);
    }
  };

  const fetchTotalProfit = async () => {
    let url = apiUrl("/totalProfit");
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    try {
      const data = await fetchJson(url);
      setTotalProfit(data);
    } catch (error) {
      showError("Erreur lors de la récupération du bénéfice total: " + error.message);
    }
  };

  const fetchTotalMenuProfit = async () => {
    let url = apiUrl("/totalMenuSaleProfit");
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    try {
      const data = await fetchJson(url);
      setTotalMenuProfit(data);
    } catch (error) {
      showError("Erreur lors de la récupération du bénéfice des ventes: " + error.message);
    }
  };

  const fetchCashDetails = (cashId) => {
    setSelectedCashId(cashId);
  };

  useEffect(() => {
    if (selectedCashId) {
      setShowDetailsModal(true);
    }
  }, [selectedCashId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Bénéfices par Méthode de Paiement</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Sélectionner une période :</label>
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
          <span className="self-center">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Méthode de Paiement</th>
            <th className="border p-2">Bénéfices</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {profits.map((profit, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{convertMethodToPayment(profit.modeOfTransaction)}</td>
              <td className={`border p-2 font-semibold ${profit.profitOrLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                {profit.profitOrLoss.toFixed(2)} Ar
              </td>
              <td className="border-b p-2 text-center">
                {profit.cashId ? (
                  <button
                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                    onClick={() => fetchCashDetails(profit.cashId)}
                  >
                    Voir Détails
                  </button>
                ) : (
                  <span className="text-gray-500">Aucun détail</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mt-4">Bénéfice Total: {totalProfit.toFixed(2)} Ar</h3>
      <h3 className="text-lg font-semibold mt-4">Bénéfice Total des Ventes de Menu: {totalMenuProfit.toFixed(2)} Ar</h3>

      {showDetailsModal && selectedCashId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-1/2 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Détails de l&apos;Opération</h2>
              <button
                className="text-red-600 text-xl hover:text-red-800"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCashId(null);
                }}
              >
                ✖
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitsList;
