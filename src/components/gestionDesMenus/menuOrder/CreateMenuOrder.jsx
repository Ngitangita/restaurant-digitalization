import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../../services/api";
import MenuItems from "./MenuItems";
import { MdDelete } from "react-icons/md";

// Schéma de validation mis à jour
const schema = z.object({
    customerId: z.string().optional(),
    roomId: z.string().nullable(),
    tableId: z.string().nullable(),
}).refine(data => data.roomId || data.tableId, {
    message: "Il faut choisir soit une table soit une chambre.",
    path: ["roomId"], // Place l'erreur sur roomId pour la validation
});

function CreateMenuOrder({ onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuRequest, setMenuRequest] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [menuError, setMenuError] = useState("");
    const [stockError, setStockError] = useState("");
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [menus, setMenus] = useState([]);

    const findByNumber = (number, type) => {
       if(type === "table"){
          return tables.find(t => t.number == number)
       } else {
        return rooms.find(r => r.roomNumber == number)
       }
    }


    const handleConfirm = async (data) => {
        if (menuRequest.length === 0) {
            setMenuError("Veuillez ajouter au moins un élément de menu.");
            return;
        }

        setMenuError("");
        setStockError("");

        const room = findByNumber(data.roomId, 'room')
        const table = findByNumber(data.table, 'table')

        const payload = {
            customerId: data.customerId ? Number(data.customerId) : null,
            roomId: room?.id ?? null,
            tableId: table?.id ?? null,
            menuItems: menuRequest,
        };

        console.log(payload);
        

        try {
            const response = await fetchJson(`${apiUrl("/menu-orders")}`, 'POST', payload);
            console.log('Réponse du serveur:', response);
            onClose(); 
        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = useCallback((data) => {
        setMenuRequest((prev) => [...prev, data]);
    }, []);

    const removeItem = (menuId) => {
        setMenuRequest(menuRequest.filter(item => item.menuId !== menuId));
    };

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
                setMenus(menusData || []);
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);

    const handleCancel = () => {
        setMenuRequest([]);
        onClose();
    };

    return (
            <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4 p-8">
                <div className="flex flex-row gap-3 items-center">
                    <div className="flex flex-col w-full relative">
                        <label htmlFor="customerInput">
                            Un Client (facultatif)
                        </label>
                        <input
                            id="customerInput"
                            type="text"
                            {...register("customerId")}
                            placeholder="Tapez le nom du client..."
                            className="mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2"
                        />
                        {errors.customerId && <p className="text-red-500 text-sm">{errors.customerId.message}</p>}
                    </div>

                    <div className="flex flex-col w-full relative">
                        <label htmlFor="roomInput">
                            Une Chambre
                        </label>
                        <input
                            id="roomInput"
                            type="text"
                            {...register("roomId")}
                            placeholder="Tapez le numéro de la chambre..."
                            className="mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2"
                        />
                        {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId.message}</p>}
                    </div>

                    <div className="flex flex-col w-full relative">
                        <label htmlFor="tableInput">
                            Une Table
                        </label>
                        <input
                            id="tableInput"
                            type="text"
                            {...register("tableId")}
                            placeholder="Tapez le numéro de la table..."
                            className="mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2"
                        />
                        {errors.tableId && <p className="text-red-500 text-sm">{errors.tableId.message}</p>}
                    </div>
                </div>

                <div>
                    <MenuItems isOpen={isOpen} setIsOpen={setIsOpen} onSave={handleSave} />
                    {menuError && <p className="text-red-500 text-sm">{menuError}</p>}
                    {stockError && <p className="text-red-500 text-sm">{stockError}</p>}

                    {menuRequest.length > 0 && (
                        <div className="mt-4 ">
                            <h2 className="font-semibold">Articles sélectionnés :</h2>
                            <ul className="mt-4 pb-5 overflow-y-auto scrollbar-custom h-20 border border-collapse">
                                {menuRequest.map((item, index) => {
                                    const menu = menus.find(m => m.id === item.menuId);
                                    return (
                                        <li key={index} className="flex items-center justify-between py-2">
                                            <span>{menu ? menu.name : 'Menu inconnu'} - Quantité: {item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.menuId)}
                                                className="bg-red-500 text-white rounded p-1 hover:bg-red-600 ml-2"
                                            >
                                                <MdDelete />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-between space-x-2 mt-4">
                    <button
                        type="button"
                        className="ml-2 bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400"
                        onClick={handleCancel}
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
    );
}

export default CreateMenuOrder;
