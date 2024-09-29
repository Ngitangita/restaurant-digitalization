import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { apiUrl, fetchJson } from '../../services/api';

export default function BonCommande({ onAjouterCommande }) {
    const [menus, setMenus] = useState([]);
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Récupérer les menus depuis l'API
        (async () => {
            try {
                const data = await fetchJson(apiUrl("/menus"));
                setMenus(data || []);
            } catch (err) {
                setError('Erreur lors de la récupération des menus');
            }
        })();
    }, []);

    const toggleMenuSelection = (menuName) => {
        setSelectedMenus((prevSelectedMenus) => {
            if (prevSelectedMenus.includes(menuName)) {
                return prevSelectedMenus.filter((name) => name !== menuName);
            } else {
                return [...prevSelectedMenus, menuName];
            }
        });
    };

    const handleQuantityChange = (menuName, event) => {
        const value = Math.max(0, parseInt(event.target.value, 10) || 0);
        setQuantities({
            ...quantities,
            [menuName]: value,
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const addCommande = () => {
        const newCommandes = selectedMenus.map((menuName) => {
            const menu = menus.find((m) => m.name === menuName);
            const quantity = quantities[menuName] || 0;
            const price = menu?.price || 0;
            return {
                name: menuName,
                quantity,
                price,
                total: quantity * price, // Calculer le total pour chaque commande
            };
        }).filter(commande => commande.quantity > 0); // Filtrer les commandes avec quantité > 0

        onAjouterCommande(newCommandes); // Appeler la fonction pour ajouter les commandes
        // Vider les sélections après ajout à la commande
        setSelectedMenus([]);
        setQuantities({});
    };

    // Filtrer les menus en fonction du terme de recherche
    const filteredMenus = (menus || []).filter((menu) =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="BonCommande mt-3 w-full flex flex-col justify-between border border-gray-300 rounded-md shadow-sm">
            {error && <p className="text-red-500">{error}</p>}
            <div className="relative inline-block w-80 p-2 border border-gray-300 rounded-md">
                <span className='pl-4 text-gray-500'>Sélectionnez vos désignations ici</span>
                <div className="flex items-center mb-3 bg-white border border-gray-300 rounded-md">
                    <label htmlFor="search" className='cursor-pointer'><FaSearch className="text-gray-500 ml-2" /></label>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        id='search'
                        className="w-full px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {searchTerm && (
                        <MdClose
                            className="text-gray-500 mr-2 cursor-pointer size-7"
                            onClick={clearSearch}
                        />
                    )}
                </div>
                <div className="max-h-40 overflow-y-scroll bg-white">
                    {filteredMenus.map((menu) => (
                        <div key={menu.id} className="mb-2">
                            <ul>
                                <li className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedMenus.includes(menu.name)}
                                        onChange={() => toggleMenuSelection(menu.name)}
                                        className="mr-2"
                                    />
                                    <span className="mr-2 text-gray-500">{menu.name}</span>
                                    <span className="text-gray-500">({menu.price} €)</span>
                                    {selectedMenus.includes(menu.name) && (
                                        <input
                                            type="number"
                                            value={quantities[menu.name] || ''}
                                            onChange={(e) => handleQuantityChange(menu.name, e)}
                                            placeholder="Quantité"
                                            className="block w-20 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    )}
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
                <button 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    onClick={addCommande}
                >
                    Ajouter au bon de commande
                </button>
            </div>
        </div>
    );
}
