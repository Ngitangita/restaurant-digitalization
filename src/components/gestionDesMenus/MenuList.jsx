import React, { useEffect, useState } from 'react';
import CreateMenu from './CreateMenu';
import { apiUrl } from '../../services/api';
import { MdDelete, MdClear } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa'; // Import de l'icône

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMenuId, setSelectedMenuId] = useState(null); // ID du menu sélectionné
    const [menuStatus, setMenuStatus] = useState(''); // Statut du menu sélectionné
    const [showEditModal, setShowEditModal] = useState(false); // Contrôle de l'affichage de la modale d'édition
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const fetchMenus = async () => {
        setIsLoading(true);
        try {
            const [menusResponse, categoriesResponse, statusesResponse] = await Promise.all([
                fetch(apiUrl('/menus/all')),
                fetch(apiUrl('/categories/all')),
                fetch(apiUrl('/menus/status'))
            ]);

            if (!menusResponse.ok || !categoriesResponse.ok || !statusesResponse.ok) {
                throw new Error('Erreur lors de la récupération des menus, catégories ou statuts');
            }

            const menusData = await menusResponse.json();
            const categoriesData = await categoriesResponse.json();
            const statusesData = await statusesResponse.json();

            setMenus(menusData);
            setCategories(categoriesData);
            setStatuses(statusesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleEditStatus = (menu) => {
        setSelectedMenuId(menu.id);
        setMenuStatus(menu.status);
        setShowEditModal(true);
    };

    const handleUpdateStatus = async () => {
        try {
            const url = apiUrl(`/menus/${selectedMenuId}/status?status=${encodeURIComponent(menuStatus)}`);

            await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setShowEditModal(false);
            setSelectedMenuId(null);
            fetchMenus();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut du menu:', error);
        }
    };


    const filteredMenus = menus.filter(menu =>
        menu.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastMenu = currentPage * itemsPerPage;
    const indexOfFirstMenu = indexOfLastMenu - itemsPerPage;
    const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);
    const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

    return (
        <div className="container bg-white MenuList mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Menus</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className='flex flex-row gap-4'>
                <div className="w-64 relative flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher un menu"
                        className="pr-10 p-2 border rounded-md outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className='absolute right-8' onClick={() => setSearchTerm('')}>
                            <MdClear />
                        </button>
                    )}
                </div>

                <button
                    className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
                    onClick={toggleModal}
                >
                    Créer un menu
                </button>
            </div>

            {isModalOpen && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="CreateMenuModal relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <CreateMenu
                            onCreate={menu => setMenus(prev => [...prev, menu])}
                            createMenuModal={toggleModal}
                            categories={categories}
                            statuses={statuses} // Passez les statuts au composant CreateMenu
                        />

                    </div>
                </div>
            )}

            <table className="min-w-full bg-white MenuList shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Prix</th>
                        <th className="py-2 px-4">Description</th>
                        <th className="py-2 px-4">Statut</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="text-center py-2">Chargement...</td>
                        </tr>
                    ) : (
                        currentMenus.length > 0 ? (
                            currentMenus.map(menu => (
                                <tr key={menu.id} className="hover:bg-gray-100 text-center border-y border-collapse">
                                    <td className="py-2 px-4">{menu.name}</td>
                                    <td className="py-2 px-4">{menu.price} €</td>
                                    <td className="py-2 px-4">{menu.description}</td>
                                    <td className="py-2 px-4 cursor-pointer">
                                        <button
                                        onClick={() => handleEditStatus(menu)}
                                        >
                                            {menu.status}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                            onClick={() => handleEditStatus(menu)}
                                        >
                                            <FaRegEdit />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                                            onClick={() => setSelectedMenuId(menu.id)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-2">Aucun menu disponible</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    Précédent
                </button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>

            {/* Modale pour l'édition du statut */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold mb-4">Modifier le statut du menu</h2>
                        <select
                            value={menuStatus}
                            onChange={(e) => setMenuStatus(e.target.value)}
                            className="p-2 border rounded-md w-full"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                                onClick={() => setShowEditModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleUpdateStatus}
                            >
                                Mettre à jour
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuList;
