import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../../services/api";
import CreateMenuOrder from "./CreateMenuOrder"; // Importez le composant ici
import { MdAddBox } from "react-icons/md";

function MenuOrdersList() {
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [searchCriteria, setSearchCriteria] = useState({
        customerId: "",
        roomId: "",
        tableId: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch orders based on search criteria and pagination
    useEffect(() => {
        const params = new URLSearchParams({ ...searchCriteria, page: page - 1, size });
        const url = `${apiUrl("/menu-orders/search")}?${params.toString()}`;

        fetchJson(url, 'GET')
            .then((data) => {
                setOrders(data.items || []);
                setTotalPages(data.totalPages);
            })
            .catch((error) => console.log(error));
    }, [page, size, searchCriteria]);

    // Fetch order statuses
    useEffect(() => {
        fetchJson(apiUrl("/menu-orders/status"))
            .then((data) => setStatuses(data))
            .catch((error) => console.log(error));
    }, []);

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await fetchJson(`${apiUrl(`/menu-orders/${orderId}/status`)}`, "PATCH", { orderStatus: newStatus });
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === orderId ? { ...order, orderStatus: newStatus } : order
            ));
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
        }
    };

    return (
        <div className="w-full p-4 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Liste des Commandes</h2>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
                flex flex-row gap-2 items-center"
            >
                <MdAddBox /> Ajouter une commande
            </button>

            {/* Table d'affichage des commandes */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="py-2">Date de Commande</th>
                        <th className="py-2">Client</th>
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
                            <td className="py-2">{order.customer?.lastName || "N/A"}</td>
                            <td className="py-2">{order.room?.roomNumber || "N/A"}</td>
                            <td className="py-2">{order.table?.number || "N/A"}</td>
                            <td className="py-2">{order.menu?.name || "N/A"}</td>
                            <td className="py-2">{order.quantity}</td>
                            <td className="py-2">{order.cost}</td>
                            <td className="py-2">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button 
                    onClick={() => setPage(page > 1 ? page - 1 : page)} 
                    disabled={page === 1}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Précédent
                </button>
                <span>Page {page} sur {totalPages}</span>
                <button 
                    onClick={() => setPage(page < totalPages ? page + 1 : page)} 
                    disabled={page === totalPages}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Suivant
                </button>
            </div>

            {/* Modal for creating a new order */}
            {isModalOpen && ( 
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                        <CreateMenuOrder 
                            isOpen={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            onOrderCreated={(newOrder) => setOrders(prev => [...prev, newOrder])} 
                        /> 
                </div>
            )}
        </div>
    );
}

export default MenuOrdersList;
