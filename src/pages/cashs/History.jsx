import React,{ useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true);
        let url = apiUrl("/histories");

        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        const query = params.toString();
        if (query) url += `?${query}`;

        const data = await fetchJson(url);
        setHistories(data);
      } catch (error) {
        console.error(error);
        showError("Erreur lors de la récupération des historiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, [startDate]);

  const handleClick = (id) => {
    navigate(`/history/${id}`);
  };

  const filteredHistories = startDate
    ? histories.filter(
        (h) => dayjs(h.transactionDate).format("YYYY-MM-DD") === startDate
      )
    : histories;

  const groupedByDate = filteredHistories
    .toSorted((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .reduce((groups, h) => {
      const dateKey = dayjs(h.transactionDate).format("DD/MM/YYYY");
      if (!groups[dateKey]) {
        groups[dateKey] = { total: 0, items: [] };
      }
      groups[dateKey].items.push(h);
      groups[dateKey].total += h.amount;
      return groups;
    }, {});

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
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden darkBody mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 px-4">Heure</th>
            <th className="p-2 px-4">Montant (Ar)</th>
            <th className="p-2 px-4">Type de Transaction</th>
            <th className="p-2 px-4">Mode de Paiement</th>
            <th className="p-2 px-4">Description</th>
            <th className="p-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {!loading && Object.keys(groupedByDate).length > 0 ? (
            Object.entries(groupedByDate).map(([date, group]) => (
              <React.Fragment key={date}>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={6} className="text-left p-2">
                    {date} — Total : {group.total.toLocaleString()} Ar
                  </td>
                </tr>

                {group.items.map((h) => (
                  <tr key={h.id} className="border hover:bg-gray-100 transition-all">
                    <td className="p-3 border">
                      {dayjs(h.transactionDate).format("HH:mm:ss")}
                    </td>
                    <td className="p-3 border font-semibold">{h.amount} Ar</td>
                    <td className="p-3 border">
                      {convertDepositWithdraw(h.transactionType)}
                    </td>
                    <td className="p-3 border">
                      {convertMethodToPayment(h.modeOfTransaction)}
                    </td>
                    <td className="p-3 border">
                      {truncate(h.description || "N/A", 15)}
                    </td>
                    <td className="py-2 px-4 flex justify-center">
                      <button
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                        onClick={() => handleClick(h.id)}
                      >
                        <BiSolidShow />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6}>
                {loading ? (
                  "Chargement..."
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <MdInfoOutline className="text-4xl text-gray-400 mb-2" />
                    Aucun historique trouvé
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
