import { useParams } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast.jsx";
import { apiUrl, fetchJson } from "../../services/api.js";
import { convertStatusToOrder } from "../../services/convertStatus.js";
import dayjs from "dayjs";
import { IoMdTrash } from "react-icons/io";
import { formatPriceInAriary } from "../../services/formatePrice.js";

function OrdersByTable() {
    const { tableNumber } = useParams();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const { showSuccess, showError } = useToast();

    const [fetchState, setFetchState] = useState({
        isLoading: false,
        hasError: false,
        data: {
            table: {},
            orders: []
        }
    });

    const fetchApi = async () => {
        setFetchState(prev => ({ ...prev, isLoading: true }));
        const url = apiUrl(`/menu-orders/all/table/${tableNumber}`);
        try {
            const rawData = await fetchJson(url);
            if (rawData.length > 0) {
                const table = rawData[0].table;
                const orders = rawData.map(({ table, ...order }) => order);
                setFetchState({ isLoading: false, hasError: false, data: { table, orders } });
            } else {
                setFetchState({ isLoading: false, hasError: false, data: { table: {}, orders: [] } });
            }
        } catch (error) {
            console.error(error);
            setFetchState({ isLoading: false, hasError: true, data: { table: {}, orders: [] } });
            showError("Échec de la récupération des commandes. Veuillez réessayer.");
        }
    };

    useEffect(() => { void fetchApi() }, [tableNumber]);

    const handleClick = (order) => {
        setSelectedOrderId(order.id);
        setIsOpenModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetch(apiUrl(`/menu-orders/${selectedOrderId}`), { method: 'DELETE' });
            setIsOpenModal(false);
            void fetchApi();
            showSuccess("Commande supprimée avec succès.");
        } catch {
            showError("Erreur lors de la suppression de la commande.");
        }
    };

    // 🔹 Regrouper par date
    const groupedByDate = fetchState.data.orders.reduce((groups, order) => {
        const date = dayjs(order.orderDate).format('YYYY-MM-DD');
        if (!groups[date]) groups[date] = { orders: [], total: 0 };
        groups[date].orders.push(order);
        groups[date].total += order.cost;
        return groups;
    }, {});

    return (
        <div className="container mx-auto bg-white text-black darkBody p-10 pb-14">
            {fetchState.isLoading && <p className="text-center text-lg font-semibold text-gray-500">Chargement en cours...</p>}
            {fetchState.hasError && <p className="text-center text-lg font-semibold text-red-600">Erreur lors de la récupération des données.</p>}

            {!fetchState.isLoading && !fetchState.hasError && (
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Commandes pour la table {fetchState.data.table.number || tableNumber}
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        Capacité de la table : {fetchState.data.table.capacity || "N/A"} <br/>
                    </p>

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
                                    <th className="px-4 py-2 border-b">Coût</th>
                                    <th className="px-4 py-2 border-b">Statut</th>
                                    <th className="px-4 py-2 border-b">Date de commande</th>
                                    <th className="px-4 py-2 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedByDate).map(([date, group]) => (
                                    <Fragment key={date}>
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan={7} className="p-2 text-left">
                                                {dayjs(date).format('DD/MM/YYYY')} — Total : {formatPriceInAriary(group.total, false)}
                                            </td>
                                        </tr>
                                        {group.orders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-200 dark:hover:bg-gray-600">
                                                <td className="px-4 py-2 border-b">{order.id}</td>
                                                <td className="px-4 py-2 border-b">{order.menu?.name}</td>
                                                <td className="px-4 py-2 border-b">{order.quantity}</td>
                                                <td className="px-4 py-2 border-b">{formatPriceInAriary(order.cost, false)}</td>
                                                <td className="px-4 py-2 border-b">{convertStatusToOrder(order.orderStatus)}</td>
                                                <td className="px-4 py-2 border-b">{dayjs(order.orderDate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                <td className="px-4 py-2 border-b">
                                                    <button className="bg-red-500 text-white rounded p-2 hover:bg-red-600" onClick={() => handleClick(order)}>
                                                        <IoMdTrash/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isOpenModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 DeleteModal">
                        <p className="mt-2">Êtes-vous sûr de vouloir supprimer cette commande ?</p>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => setIsOpenModal(false)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">Annuler</button>
                            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrdersByTable;
