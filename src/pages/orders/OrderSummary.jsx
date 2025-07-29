import { useEffect, useState } from "react";
import { BiSolidShow } from "react-icons/bi";
import { MdAddBox, MdEdit, MdInfoOutline } from "react-icons/md";
import { apiUrl, fetchJson } from "../../services/api";
import { convertType } from "../../services/convertType";
import { convertStatusToOrder } from "../../services/convertStatus";
import CreateMenuOrder from "../../components/menus/menu-orders/CreateMenuOrder";
import UpdateStatusOrder from "../../components/status/UpdateStatusOrder.jsx";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { generateInvoiceForOrder } from "../../services/invoiceService";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OrderSummary() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi();
    fetchJson(apiUrl("/menu-orders/status")).then(setStatuses).catch(console.error);
  }, []);

  const fetchApi = async () => {
    try {
      const data = await fetchJson(apiUrl("/menu-orders/grouped"));
      const unpaid = data.filter(o =>
        o.orderLines?.some(line => line.menu && !line.paid)
      );
      setOrders(unpaid);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter(order => {
    const num = order.table?.number ?? order.room?.number ?? "";
    const numMatch = searchTerm ? String(num).includes(searchTerm) : true;
    const st = order.orderStatus?.toLowerCase() ?? "";
    return (
      numMatch &&
      (
        (selectedFilters.includes("delivered") && st === "delivered") ||
        (selectedFilters.includes("not_delivered") && st !== "delivered") ||
        selectedFilters.length === 0
      )
    );
  });

  const notDelivered = filtered.filter(o => o.orderStatus?.toLowerCase() !== "delivered");
  const delivered = filtered.filter(o => o.orderStatus?.toLowerCase() === "delivered");
  const sorted = [...notDelivered, ...delivered];

  const handleUpdateStatus = async () => {
    if (
      selectedOrder.orderStatus.toLowerCase() === "delivered" &&
      status.toLowerCase() === "delivered"
    ) {
      showError("Cette commande est déjà livrée, le statut ne peut pas être modifié.");
      return;
    }
    try {
      const res = await fetch(apiUrl("/menu-orders/orderIds/status"), {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ orderIds: [selectedOrder.id], orderStatus: status }),
      });
      if (res.ok) {
        showSuccess("Statut mis à jour avec succès.");
        setEditModalOpen(false);
        await fetchApi();
        if (status.toLowerCase() === "delivered") {
          try {
            await generateInvoiceForOrder(selectedOrder.id);
          } catch {
            showError("Commande livrée mais facture non générée.");
          }
        }
      } else {
        showError("Erreur lors de la mise à jour du statut.");
      }
    } catch {
      showError("Erreur réseau lors du statut.");
    }
  };

  const handleFilterChange = (_e, newFilters) => {
    if (!newFilters) return;
    setSelectedFilters(newFilters);
  };

  const handleClick = order => {
    const isTable = !!order.table;
    const number = isTable ? order.table.number : order.room.number;
    navigate(`/orders/by-${isTable ? "table" : "room"}/${number}`);
  };

  return (
    <div className="text-gray-700 p-4 rounded-lg">
      <div className="fixed z-50 w-[900px] bg-white darkBody px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-3"
        >
          <MdAddBox /> Ajouter une commande
        </button>
        <div className="flex items-center gap-6">
          <TextField
            label="Rechercher chambre / table"
            type="number"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: "150px", ".MuiInputBase-root": { height: "40px" } }}
          />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm">Afficher seulement :</h4>
            <ToggleButtonGroup
              value={selectedFilters}
              onChange={handleFilterChange}
              size="small"
              color="primary"
            >
              <ToggleButton value="delivered">Livré</ToggleButton>
              <ToggleButton value="not_delivered">Non Livré</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      <table className="w-[1000px] bg-white shadow-md rounded-lg text-center relative top-[80px] darkBody">
        <thead className="bg-gray-200 text-gray-700">
          <tr><th>Statut</th><th>Type</th><th>Numéro</th><th>Menus</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {sorted.length > 0 ? (
            sorted.map(order => {
              const isTable = !!order.table;
              const num = isTable ? order.table.number : order.room.number;
              const menus = order.orderLines?.map(l => l.menu?.name).join(", ");
              const st = order.orderStatus?.toLowerCase() ?? "";
              const locked = st === "delivered";
              return (
                <tr key={order.id} className="border-b">
                  <td className="py-2 px-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setStatus(order.orderStatus);
                        setEditModalOpen(true);
                      }}
                      disabled={locked}
                      title={locked ? "Commande déjà livrée" : ""}
                      className={`w-full flex items-center justify-center ${
                        locked ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-red-500"
                      }`}
                    >
                      <MdEdit />
                      <span>{convertStatusToOrder(st)}</span>
                      {st !== "delivered" && <span className="text-red-500 text-xs">⚠️</span>}
                    </button>
                  </td>
                  <td className="py-2 px-4">{convertType(isTable ? "table" : "room")}</td>
                  <td className="py-2 px-4">{num}</td>
                  <td className="py-2 px-2">{menus}</td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleClick(order)}
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    >
                      <BiSolidShow />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-gray-500">
                <div className="flex flex-col items-center">
                  <MdInfoOutline className="text-4xl text-gray-400 mb-2" />
                  Aucune donnée disponible
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded w-full max-w-lg sm:max-w-md CreateModal">
            <CreateMenuOrder
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onOrderCreated={fetchApi}
            />
          </div>
        </div>
      )}

      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg EditModal max-w-md w-full p-4">
            <UpdateStatusOrder
              onSave={handleUpdateStatus}
              onCancel={() => setEditModalOpen(false)}
              statuses={statuses}
              setStatus={setStatus}
              status={status}
              disabled={selectedOrder.orderStatus?.toLowerCase() === "delivered"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
