import { useState, useEffect } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";

const ProfitsList = () => {
  const [profits, setProfits] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchProfits();
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
      showError('Erreur lors de la récupération des profits: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-full p-6 bg-white shadow-md rounded-lg">
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
            <th className="border p-2">Mode de Transaction</th>
            <th className="border p-2 text-red-500">Perte (ariary)</th>
            <th className="border p-2 text-green-500">Bénéfice (ariary)</th>
          </tr>
        </thead>
        <tbody>
          {profits && profits.length > 0 ? (
            profits.map((profit, index) => (
              <tr key={index}>
                <td className="border p-2">{convertMethodToPayment(profit.modeOfTransaction)}</td>
                <td className="border p-2 text-red-500">
                  {profit.profitOrLoss < 0 ? `${Math.abs(profit.profitOrLoss).toLocaleString()} Ar` : "-"}
                </td>
                <td className="border p-2 text-green-500">
                  {profit.profitOrLoss > 0 ? `${profit.profitOrLoss.toLocaleString()} Ar` : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                Aucune donnée disponible.
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  );
};

export default ProfitsList;
