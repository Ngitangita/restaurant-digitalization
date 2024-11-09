import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../../services/api";
import CreateMenuOrder from "./CreateMenuOrder";
import { MdAddBox, MdEdit } from "react-icons/md";
import UpdateStatus from "../../updateStatus/UpdateStatus";

function MenuOrdersList() {
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [status, setStatus] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState({
        roomId: "", // Suppression de customerId
        tableId: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch orders based on search criteria
    const fetchOrders = () => {
        const params = new URLSearchParams(searchCriteria);
        const url = `${apiUrl("/menu-orders/search")}?${params.toString()}`;

        fetchJson(url, 'GET')
            .then((data) => {
                setOrders(data.items || []);
            })
            .catch((error) => console.log(error));
    };

    useEffect(fetchOrders, [searchCriteria]);

    // Fetch order statuses
    useEffect(() => {
        fetchJson(apiUrl("/menu-orders/status"))
            .then((data) => setStatuses(data))
            .catch((error) => console.log(error));
    }, []);

    const handleEditStatus = (order) => {
        setSelectedOrderId(order.id);
        setStatus(order.status);
        setShowEditModal(true);
    };

    const handleUpdateStatus = async () => {
        try {
            const url = apiUrl(`/menu-orders/${selectedOrderId}/status?status=${encodeURIComponent(status)}`);
            await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setShowEditModal(false);
            setSelectedOrderId(null);
            fetchOrders();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la commande:', error);
        }
    };

    return (
        <div className="w-full p-4 bg-white rounded shadow-lg menuOrdersList">
            <h2 className="text-2xl font-bold mb-4">Liste des Commandes</h2>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex flex-row gap-2 items-center"
            >
                <MdAddBox /> Ajouter une commande
            </button>

            {/* Barre de recherche */}
            <div className="flex gap-10 my-4">
                <input
                    type="text"
                    placeholder="numéro de chambre"
                    value={searchCriteria.roomId}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, roomId: e.target.value }))}
                    className="border rounded p-2 outline-none"
                />
                <input
                    type="text"
                    placeholder="numéro de table"
                    value={searchCriteria.tableId}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, tableId: e.target.value }))}
                    className="border rounded p-2 outline-none"
                />
            </div>

            {/* Table d'affichage des commandes */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4 menuOrdersList">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2">Date de Commande</th>
                        <th className="py-2">Chambre</th>
                        <th className="py-2">Table</th>
                        <th className="py-2">Menu</th>
                        <th className="py-2">Quantité</th>
                        <th className="py-2">Coût</th>
                        <th className="py-2">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-100 text-center border-y">
                            <td className="py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="py-2">{order.room?.roomNumber || "-"}</td>
                            <td className="py-2">{order.table?.number || "-"}</td>
                            <td className="py-2">{order.menu?.name || "-"}</td>
                            <td className="py-2">{order.quantity}</td>
                            <td className="py-2">{order.cost}</td>
                            <td className="py-2 px-4 cursor-pointer">
                                <button
                                    onClick={() => handleEditStatus(order)}
                                    className={`w-full flex flex-col gap-1 items-center ${order.orderStatus?.toLowerCase() !== "completed" ? 'text-red-500 font-bold' : ''}`}
                                >
                                    <span className='flex flex-row gap-1 items-center '>
                                        <MdEdit /> {order.orderStatus?.toLowerCase() || "N/A"}
                                    </span>
                                    {order.orderStatus?.toLowerCase() !== "completed" && (
                                        <div className="text-red-500 text-[10px]">⚠️ désolé, la commande est {order.orderStatus}</div>
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg EditModal">
                        <div className='flex flex-row justify-between items-center'>
                            <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
                            <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                                onClick={() => setShowEditModal(false)}>
                                x
                            </span>
                        </div>
                        <UpdateStatus
                            onSave={handleUpdateStatus}
                            onCancel={() => setShowEditModal(false)}
                            statuses={statuses}
                            setStatus={setStatus}
                            status={status}
                        />
                    </div>
                </div>
            )}

            {/* Modal for creating a new order */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <dir className="w-[700px] mx-auto bg-white rounded CreateModal">
                        <div className='flex flex-row justify-between items-center'>
                            <h2 className="text-center font-serif font-bold
                            text-xl pl-8 pt-8 pb-4">
                                Formulaire de Commande
                                <br /><span className="text-[10px]">nb : choisir table ou chambre</span>
                            </h2>
                            <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-8 text-[30px] hover:text-white cursor-pointer'
                                onClick={() => setIsModalOpen(false)}>
                                x
                            </span>
                        </div>
                        <CreateMenuOrder
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onOrderCreated={(newOrder) => setOrders(prev => [...prev, newOrder])}
                        />
                    </dir>
                </div>
            )}
        </div>
    );
}

export default MenuOrdersList;
