import { useEffect, useState } from "react";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { apiUrl, fetchJson } from "../../services/api";
import { MdInfoOutline } from "react-icons/md";
import { convertDepositWithdraw } from "../../services/convertStatus";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";
import { truncate } from "../../services/truncate";
import { BiSolidShow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const History = () => {
  const [histories, setHistories] = useState([]);
  const { showError } = useToast();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        let url = apiUrl("/histories");

        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        const query = params.toString();
        if (query) url += `?${query}`;

        const data = await fetchJson(url);
        setHistories(data);
      } catch (error) {
        console.error(error);
        showError("Erreur lors de la récupération des historiques.");
      }
    };

    fetchHistories();
  }, [startDate, endDate]);

  const handleClick = (id) => {
    navigate(`/history/${id}`);
  };

  return (
    <div className="container mx-auto pr-14 pl-6 darkBody bg-white">
      <div className="flex flex-row gap-4 p-4">
        <h1 className="text-2xl font-bold mb-4">Liste des historiques</h1>
        <button
          onClick={() => navigate("/cashs")}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Retour vers caisse
        </button>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md outline-none"
          />
          <span className="self-center">—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md outline-none"
          />
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden darkBody">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 px-4">Date</th>
            <th className="p-2 px-4">Montant (Ar)</th>
            <th className="p-2 px-4">Type de Transaction</th>
            <th className="p-2 px-4">Mode de Paiement</th>
            <th className="p-2 px-4">Description</th>
            <th className="p-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {histories.length > 0 ? (
            histories
              .toSorted((a, b) => b.id - a.id)
              .map((h, i) => (
                <tr key={i} className="border hover:bg-gray-100 transition-all">
                  <td className="p-3 border">
                    {dayjs(h.transactionDate).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                  <td className="p-3 border font-semibold">{h.amount} Ar</td>
                  <td className="p-3 border">{convertDepositWithdraw(h.transactionType)}</td>
                  <td className="p-3 border">{convertMethodToPayment(h.modeOfTransaction)}</td>
                  <td className="p-3 border">{truncate(h.description || "N/A", 15)}</td>
                  <td className="py-2 px-4 flex justify-center">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                      onClick={() => handleClick(h.id)}
                    >
                      <BiSolidShow />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center w-full">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <span>Aucun historique trouvé</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
