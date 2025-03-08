import React, { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import { FaRegEdit } from "react-icons/fa";
import OperationDetails from "./OperationDetails";
import CreateStock from "../../components/stocks/CreateStock";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { MdInfoOutline } from "react-icons/md";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [quantityMin, setQuantityMin] = useState("");
  const [quantityMax, setQuantityMax] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [, setOperationDetails] = useState(null);
  const [selectedOperationId, setSelectedOperationId] = useState(null);
  const { showError } = useToast();

  const fetchStocks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchJson(apiUrl("/ingredient-groups"));
      setStocks(data);
    } catch (error) {
      showError(
        "Une erreur s'est produite lors du chargement des stocks" +
          error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStocks();
  }, []);

  const toggleModal = (ingredient) => {
    setSelectedStock(ingredient);
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
    void fetchStocks();
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  const filteredData = stocks.map((s) => ({
    ...s,
    ingredients: s.ingredients.filter((i) => {
      const nameMatch = ingredientName
        ? i?.name?.toLowerCase().includes(ingredientName.toLowerCase())
        : true;
      const quantityMatch =
        (!quantityMin || i.stock.quantity >= quantityMin) &&
        (!quantityMax || i.stock.quantity <= quantityMax);

      const createdDate = i.stock.createdAt.split("T")[0];
      const updatedDate = i.stock.updatedAt.split("T")[0];
      const start = startDate ? startDate.split("T")[0] : null;
      const end = endDate ? endDate.split("T")[0] : null;

      const dateMatch =
        (!start || createdDate >= start) && (!end || updatedDate <= end);

      return nameMatch && quantityMatch && dateMatch;
    }),
  }));

  return (
    <div className="darkBody container mx-auto p-4 bg-white pb-10 pr-14">
      <div className="flex flex-row items-center gap-20">
        <h1 className="text-2xl font-bold mb-4">Liste des Stocks</h1>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex mb-4">
        <TextField
          id="outlined-search"
          label="Rechercher par nom de l'ingredient"
          type="search"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: ingredientName && (
              <button
                type="button"
                className="flex items-center"
                onClick={() => setIngredientName("")}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              ></button>
            ),
          }}
          sx={{
            width: "250px",
            height: "50px",
            zIndex: "0px",
            ".MuiInputBase-root": { height: "40px" },
          }}
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
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Créé le</th>
              <th className="py-2 px-4">Modifié le</th>
              <th className="p-2">Ingrédient</th>
              <th className="p-2">Quantité</th>
              <th className="p-2">Unité</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-2">
                  Chargement...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center py-2 text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map(({ name, ingredients }, i) => (
                <React.Fragment key={i}>
                  <tr className="font-bold bg-gray-100 text-center">
                    <td colSpan="6">{name}</td>
                  </tr>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="text-center">
                      <td className="border-b p-2">
                        {ingredient?.stock?.createdAt
                          ? dayjs(ingredient.stock.createdAt).format(
                              "YYYY-MM-DD HH:mm"
                            )
                          : "Non défini"}
                      </td>
                      <td className="border-b p-2">
                        {dayjs(ingredient?.stock?.updatedAt).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                      </td>
                      <td className="border-b p-2">
                        {ingredient.name || "N/A"}
                      </td>
                      <td className="border-b p-2">
                        {ingredient?.stock?.quantity}
                      </td>
                      <td className="border-b p-2">
                        {ingredient?.unit?.abbreviation}
                      </td>
                      <td className="border-b p-2 flex justify-center">
                        <button
                          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2"
                          onClick={() => toggleModal(ingredient)}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="bg-green-500 text-white rounded p-2 hover:bg-green-600"
                          onClick={() =>
                            fetchOperationDetails(ingredient.stock.id)
                          }
                        >
                          Voir Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="6" className="py-4 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                    Aucun stock trouvé
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && selectedStock && (
          <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md EditModal">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le stock</h2>
                <span
                  className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                  onClick={toggleModal}
                >
                  x
                </span>
              </div>
              <CreateStock
                onStockCreated={handleStockCreated}
                createStockModale={toggleModal}
                ingredientId={selectedStock ? selectedStock.id : ""}
                ingredientName={selectedStock ? selectedStock.name : ""}
              />
            </div>
          </div>
        )}

        {showDetailsModal && selectedOperationId && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-1/2 DetailsModal">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl pl-8 pt-8 pb-4">
                  Détails de l&rsquo;Opération
                </h2>
                <span
                  className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                  onClick={closeDetailsModal}
                >
                  x
                </span>
              </div>
              <OperationDetails
                operationId={selectedOperationId}
                onClose={closeDetailsModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockList;
