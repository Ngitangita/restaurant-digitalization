import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function OperationStatistics() {
  const [totalStocks, setTotalStocks] = useState([]);
  const [stockId, setStockId] = useState("");
  const [ingredientName, setIngredientName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiUrl("/operations/statistic")}?stockId=${stockId}&ingredientName=${ingredientName}`;
      try {
        const data = await fetchJson(url);
        console.log(data);
        setTotalStocks(data);
      } catch (error) {
        console.error("Error fetching operation statistics", error);
      }
    };

    fetchData();
  }, [stockId, ingredientName]);

  return (
      <div className="container bg-white w-[1109px] MenuList mx-auto p-10 pb-14">
        <h2 className="text-xl font-semibold mb-4">Statistiques des Opérations</h2>

        <div className="flex gap-4 mb-4">
          <input
              type="number"
              value={stockId}
              onChange={(e) => setStockId(e.target.value)}
              placeholder="Stock ID"
              className="border border-gray-300 p-2 rounded-lg"
          />
          <input
              type="text"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              placeholder="Nom de l'ingrédient"
              className="border border-gray-300 p-2 rounded-lg"
          />
        </div>

        {/* Chart section */}
        <div className="mb-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalStocks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ingredientName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">Ingrédient</th>
            <th className="py-2 px-4">Quantité Totale</th>
          </tr>
          </thead>
          <tbody>
          {totalStocks.length > 0 ? (
              totalStocks.map((stock) => (
                  <tr key={stock.ingredientName} className="border-b border-gray-200">
                    <td className="py-2 px-4">{stock.ingredientName}</td>
                    <td className="py-2 px-4">{stock.totalQuantity}</td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="2" className="py-4 text-center text-gray-500">
                  Aucune donnée disponible
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
}

export default OperationStatistics;
