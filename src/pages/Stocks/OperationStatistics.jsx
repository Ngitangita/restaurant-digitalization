import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import { Box, TextField, Autocomplete, Typography } from "@mui/material";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function OperationStatistics() {
  const [totalStocks, setTotalStocks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [minTotalQuantity, setMinTotalQuantity] = useState(null);
  const [ingredientId, setIngredientId] = useState(null);
  const [date, setDate] = useState(null);
  const [maxTotalQuantity, setMaxTotalQuantity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams();

      if (ingredientId !== null && ingredientId !== undefined) {
        queryParams.append("ingredientId", ingredientId);
      }

      if (minTotalQuantity !== null && minTotalQuantity !== undefined) {
        queryParams.append("minTotalQuantity", minTotalQuantity);
      }

      if (maxTotalQuantity !== null && maxTotalQuantity !== undefined) {
        queryParams.append("maxTotalQuantity", maxTotalQuantity);
      }

      if (date) {
        queryParams.append("date", date);
      }
      const url = `${apiUrl("/operations/statistic")}?${queryParams.toString()}`;

      console.log(url);
      

      try {
        const data = await fetchJson(url);        
        setTotalStocks(data);
      } catch (error) {
        console.error("Error fetching operation statistics", error);
      }
    };

    void fetchData();
  }, [ingredientId, maxTotalQuantity, minTotalQuantity, date]);

  useEffect(() => {
    (async () => {
      const url = apiUrl("/ingredients/all");
      try {
        const data = await fetchJson(url);
        setIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients", error);
      }
    })();
  }, []);
  

  return (
    <div className="container bg-white w-[1109px] darkBody mx-auto p-10 pb-14">
      <h2 className="text-xl font-semibold mb-4">Statistiques des Opérations</h2>

      <div className="flex gap-4 mb-4">
          <Autocomplete
            options={ingredients}
            getOptionLabel={(option) => option.name || "Nom indisponible"}
            className="w-[20%]"
            onChange={(_e, v) => setIngredientId(v?.id ?? null)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nom de l'ingrédient"
                variant="outlined"
                fullWidth
              />
            )}
          />

        <input
          type="number"
          value={minTotalQuantity || ""}
          onChange={(e) => setMinTotalQuantity(e.target.value ? Number(e.target.value) : "")}
          placeholder="Quantité min"
          className="border  outline-none focus:border-blue-500 border-gray-300 p-2 rounded-lg"
        />

        <input
          type="number"
          value={maxTotalQuantity || ""}
          onChange={(e) => setMaxTotalQuantity(e.target.value ? Number(e.target.value) : "")}
          placeholder="Quantité max"
          className="border outline-none focus:border-blue-500 border-gray-300 p-2 rounded-lg"
        />
        <input
          type="date"
          value={date || ""}
          onChange={(e) => setDate(e.target.value)}
          className="border outline-none focus:border-blue-500 border-gray-300 p-2 rounded-lg"
        />
      </div>

      <div className="mb-6 w-[calc(100%-100px)]">
        {totalStocks.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalStocks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ingredientName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" textAlign="center" color="textSecondary">
            Aucune donnée disponible pour l'instant.
          </Typography>
        )}
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
                <td className="py-2 px-4">{stock.totalQuantity} (en {stock.unitAbbreviation})</td>
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
