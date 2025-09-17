import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast.jsx";
import { apiUrl, fetchJson } from "../../services/api.js";
import dayjs from "dayjs";
import { convertStatusToOrder } from "../../services/convertStatus.js";
import { IoMdTrash } from "react-icons/io";
import { formatPriceInAriary } from "../../services/formatePrice.js";

function OrdersByRoom() {
  const { roomNumber } = useParams();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { showSuccess, showError } = useToast();

  const [fetchState, setFetchState] = useState({
    isLoading: false,
    hasError: false,
    data: {
      room: {},
      order: null,
    },
  });

  const fetchApi = async () => {
    setFetchState((prev) => ({ ...prev, isLoading: true }));
    const url = apiUrl(`/menu-orders/${roomNumber}/details`);
    try {
      const rawData = await fetchJson(url);
      console.log("RAW DATA:", rawData);

      if (rawData) {
        setFetchState({
          isLoading: false,
          hasError: false,
          data: {
            room: rawData.room,
            order: rawData,
          },
        });
      } else {
        setFetchState({
          isLoading: false,
          hasError: false,
          data: { room: {}, order: null },
        });
      }
    } catch (error) {
      console.error(error);
      setFetchState({
        isLoading: false,
        hasError: true,
        data: { room: {}, order: null },
      });
      showError("Échec de la récupération des commandes. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    void fetchApi();
  }, [roomNumber]);

  const handleClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/menu-orders/${selectedOrderId}`), { method: "DELETE" });
      setIsOpenModal(false);
      void fetchApi();
      showSuccess("Commande supprimée avec succès.");
    } catch {
      showError("Erreur lors de la suppression de la commande.");
    }
  };

  const { order, room } = fetchState.data;

  return (
    <div className="container mx-auto bg-white text-black darkBody p-10 pb-14">
      {fetchState.isLoading && (
        <p className="text-center text-lg font-semibold text-gray-500">Chargement en cours...</p>
      )}
      {fetchState.hasError && (
        <p className="text-center text-lg font-semibold text-red-600">
          Erreur lors de la récupération des données.
        </p>
      )}

      {!fetchState.isLoading && !fetchState.hasError && order && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Commandes pour la chambre {room?.number || roomNumber}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Capacité : {room?.capacity || "N/A"} <br />
            Prix par nuit : {formatPriceInAriary(room?.price, false) || "N/A"} <br />
          </p>

          {order.table && (
            <p className="text-md text-gray-600 dark:text-gray-400">
              Table n°{order.table.number} – capacité {order.table.capacity}
            </p>
          )}

          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
          >
            Retour
          </button>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left text-gray-800 dark:text-white">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b">Commande #</th>
                  <th className="px-4 py-2 border-b">Plat</th>
                  <th className="px-4 py-2 border-b">Quantité</th>
                  <th className="px-4 py-2 border-b">Prix Unitaire</th>
                  <th className="px-4 py-2 border-b">Total</th>
                  <th className="px-4 py-2 border-b">Statut</th>
                  <th className="px-4 py-2 border-b">Date de commande</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {order?.orderLines?.length > 0 ? (
                  order.orderLines.map((line) => (
                    <tr key={line.id} className="hover:bg-gray-200 dark:hover:bg-gray-600">
                      <td className="px-4 py-2 border-b">{order.id}</td>
                      <td className="px-4 py-2 border-b">{line.menu?.name}</td>
                      <td className="px-4 py-2 border-b">{line.quantity}</td>
                      <td className="px-4 py-2 border-b">
                        {formatPriceInAriary(line.unitPrice, false)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {formatPriceInAriary(line.totalPrice, false)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {convertStatusToOrder(order.orderStatus)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {dayjs(order.orderDate).format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                          onClick={() => handleClick(order.id)}
                        >
                          <IoMdTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      Aucune ligne de commande trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Total commande */}
            <div className="mt-4 text-right font-bold text-lg">
              Total commande : {formatPriceInAriary(order.totalCost ?? 0, false)}
            </div>
          </div>
        </div>
      )}

      {isOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 DeleteModal">
            <p className="mt-2">
              Êtes-vous sûr de vouloir supprimer <b>toute la commande</b> ?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsOpenModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersByRoom;
