import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../../services/api";
import MenuItems from "./MenuItems";
import { MdAddBox } from "react-icons/md";

const schema = z.object({
    customerId: z.string().nullable(),
    roomId: z.string().nullable(),
    tableId: z.string().nullable(),
}).refine(data => data.roomId || data.tableId, {
    message: "Il faut choisir soit une table soit une chambre.",
    path: ["roomId"], // Set the path for the error
});

function CreateMenuOrder({ onClose }) { // Ajout de props pour fermer le modal
    const [isOpen, setIsOpen] = useState(false);
    const [menuRequest, setMenuRequest] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [menuError, setMenuError] = useState("");
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [menus, setMenus] = useState([]);

    const handleConfirm = async (data) => {
        if (menuRequest.length === 0) {
            setMenuError("Veuillez ajouter au moins un élément de menu.");
            return;
        }

        setMenuError("");

        const payload = {
            customerId: data.customerId ? Number(data.customerId) : null,
            roomId: data.roomId ? Number(data.roomId) : null,
            tableId: data.tableId ? Number(data.tableId) : null,
            menuItems: menuRequest,
        };

        console.log(payload);

        try {
            const response = await fetchJson(`${apiUrl("/menu-orders")}`, 'POST', payload);
            console.log('Réponse du serveur:', response);
            onClose(); // Fermer le modal après une confirmation réussie
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la commande:', error);
        }
    };

    const handleSave = useCallback((data) => {
        setMenuRequest((prev) => [...prev, data]);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const urls = [
                `${apiUrl("/customers/all")}`,
                `${apiUrl("/tables/all")}`,
                `${apiUrl("/rooms")}`,
                `${apiUrl("/menus/all")}`
            ];

            try {
                const [customersData, tablesData, roomsData, menusData] = await Promise.all(
                    urls.map(url => fetchJson(url))
                );
                setCustomers(customersData || []);
                setTables(tablesData || []);
                setRooms(roomsData || []);
                setMenus(menusData || []); // Set the menus state
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);

    const handleCancel = () => {
        setMenuRequest([]); // Réinitialiser la sélection du menu si nécessaire
        onClose(); // Fermer le modal
    };

    return (
        <div className="w-[900px] mx-auto p-4 bg-white rounded">
            <h1 className="text-center text-3xl font-serif font-bold mb-4">
                Formulaire de Commande
            </h1>

            <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
                <div>
                    <label htmlFor="customerId" className="block text-md font-medium text-gray-700">
                        Sélectionnez un Client
                    </label>
                    <select
                        id="customerId"
                        {...register("customerId")}
                        className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.customerId ? 'border-red-500' : ''}`}
                    >
                        <option value="">Sélectionnez un client</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.lastName}</option>
                        ))}
                    </select>
                    {errors.customerId && <p className="text-red-500 text-sm">{errors.customerId.message}</p>}
                </div>
                <div>
                    <label htmlFor="roomId" className="block text-md font-medium text-gray-700">
                        Sélectionnez une Chambre
                    </label>
                    <select
                        id="roomId"
                        {...register("roomId")}
                        className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.roomId ? 'border-red-500' : ''}`}
                    >
                        <option value="">Sélectionnez une chambre</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>{room.roomNumber}</option>
                        ))}
                    </select>
                    {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId.message}</p>}
                </div>

                <div>
                    <label htmlFor="tableId" className="block text-md font-medium text-gray-700">
                        Sélectionnez une Table
                    </label>
                    <select
                        id="tableId"
                        {...register("tableId")}
                        className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.tableId ? 'border-red-500' : ''}`}
                    >
                        <option value="">Sélectionnez une table</option>
                        {tables.map(table => (
                            <option key={table.id} value={table.id}>{table.number}</option>
                        ))}
                    </select>
                    {errors.tableId && <p className="text-red-500 text-sm">{errors.tableId.message}</p>}
                </div>

                <div>
                    <label className="block text-md font-medium text-gray-700">
                        Éléments de Menu
                    </label>
                    <span className="text-blue-500 text-sm cursor-pointer hover:text-blue-600 flex flex-row gap-2 items-center" onClick={() => setIsOpen(!isOpen)}>
                        <MdAddBox /> Ajoutez plusieurs éléments de menu. 
                    </span>
                    <MenuItems isOpen={isOpen} setIsOpen={setIsOpen} onSave={handleSave} />
                    {menuError && <p className="text-red-500 text-sm">{menuError}</p>}

                    {menuRequest.length > 0 && (
                        <div className="mt-4">
                            <h2 className="font-semibold">Articles sélectionnés :</h2>
                            <textarea
                                readOnly
                                className="w-full h-24 border-2 border-gray-300 p-2 mt-2"
                                value={menuRequest.map(item => {
                                    const menu = menus.find(m => m.id === item.menuId);
                                    return `${menu ? menu.name : 'Menu inconnu'} - Quantité: ${item.quantity}`;
                                }).join('\n')}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-between space-x-2 mt-4">
                    <button
                        type="button"
                        className="bg-gray-500 text-gray-800 rounded px-4 py-2 hover:bg-gray-600"
                        onClick={handleCancel} // Appel à la fonction de gestion de l'annulation
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    >
                        Confirmer
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateMenuOrder;
