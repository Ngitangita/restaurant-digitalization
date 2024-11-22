import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiUrl, fetchJson } from "../../../services/api";

const schema = z.object({
    menuId: z.number().min(1, "La MenuId doit être supérieure à 0"),
    quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
});

function MenuItems({ onSave }) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [menuInput, setMenuInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await fetchJson(apiUrl("/menus/all"));
                setMenus(data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMenus();
    }, []);

    const handleMenuInputChange = (event) => {
        const input = event.target.value.toLowerCase();
        setMenuInput(event.target.value);

        const foundMenus = menus.filter(menu => menu.name.toLowerCase().includes(input));
        setFilteredMenus(foundMenus);
        setShowSuggestions(foundMenus.length > 0);
    };

    const handleSuggestionClick = (menu) => {
        setMenuInput(menu.name);
        setValue("menuId", menu.id);
        setShowSuggestions(false);
    };

    const handleConfirm = (data) => {
        onSave(data);
        reset();
        setMenuInput("");
    };

    return (
        <div className="w-full flex flex-row gap-4 items-start">
            {/* Champ de recherche de menu */}
            <div className="flex flex-col w-full relative">
                <label htmlFor="menuInput">Menu Sélectionné</label>
                <input
                    id="menuInput"
                    type="text"
                    value={menuInput}
                    onChange={handleMenuInputChange}
                    placeholder="Tapez les noms du menu..."
                    className="mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2"
                />
                {showSuggestions && (
                    <ul className="Suggestions absolute top-full left-0 w-full border border-gray-300 bg-white mt-1 max-h-32 overflow-y-auto z-10">
                        {filteredMenus.map(menu => (
                            <li
                                key={menu.id}
                                onClick={() => handleSuggestionClick(menu)}
                                className="p-2 hover:bg-blue-100 cursor-pointer Suggestions"
                            >
                                {menu.name}
                            </li>
                        ))}
                    </ul>
                )}
                {errors.menuId && <p className="text-red-500 text-sm">{errors.menuId.message}</p>}
            </div>

            {/* Champ de quantité */}
            <div className="flex flex-col w-full">
                <label htmlFor="quantity">Quantité</label>
                <input
                    id="quantity"
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${
                        errors.quantity ? "border-red-500" : ""
                    }`}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
            </div>

            {/* Bouton de soumission */}
            <div className="w-full">
                <button
                    type="button"
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mt-8"
                    onClick={handleSubmit(handleConfirm)}
                >
                    Ajouter
                </button>
            </div>
        </div>
    );
}

export default MenuItems;
