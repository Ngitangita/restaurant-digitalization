import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { apiUrl, fetchJson } from '../../services/api';
import BonDeCommande from '../../components/bonDeCommande/BonDeCommande';

export default function Commande() {
    const [menus, setMenus] = useState([]);
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [commandes, setCommandes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modale

    useEffect(() => {
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
                total: quantity * price,
            };
        });
        setCommandes([...commandes, ...newCommandes]);
        setSelectedMenus([]);
        setQuantities({});
        setIsModalOpen(true); // Ouvre la modale
    };

    const filteredMenus = (menus || []).filter((menu) =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generateDesignation = () => {
        return selectedMenus
            .map((menuName) => {
                const menu = menus.find((m) => m.name === menuName);
                const price = menu?.price || '';
                const quantity = quantities[menuName] || 0;
                return `${menuName} (${quantity}) - ${price}`;
            })
            .join(', ');
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="ListeDesMenu mt-3 w-full flex flex-col border border-gray-300 rounded-md shadow-sm">
            {error && <p className="text-red-500">{error}</p>}
            <div className="Commandes mt-5">
                <h2 className="text-xl font-bold mb-4">Liste des Commandes</h2>
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Nom</th>
                            <th className="py-2 px-4">Quantité</th>
                            <th className="py-2 px-4">Prix unitaire (€)</th>
                            <th className="py-2 px-4">Total (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.map((commande, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-2 px-4">{commande.name}</td>
                                <td className="py-2 px-4">{commande.quantity}</td>
                                <td className="py-2 px-4">{commande.price}</td>
                                <td className="py-2 px-4">{commande.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={addCommande} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Ajouter Commande
                </button>
            </div>

            {/* Modale pour afficher la commande */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Bon de Commande</h2>
                        <BonDeCommande commandes={commandes} />
                        <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
                            Fermer
                        </button>
                    </div>
                    <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
                </div>
            )}
        </div>
    );
}
