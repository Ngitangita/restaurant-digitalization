import React, { useEffect, useState } from 'react';
import CreateMenu from './CreateMenu';
import { apiUrl } from '../../services/api';
import { MdDelete, MdClear, MdEdit } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [menuStatus, setMenuStatus] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditMenuModal, setShowEditMenuModal] = useState(false);
    const [menuToEdit, setMenuToEdit] = useState(null);

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

    const handleEditMenu = (menu) => {
        setMenuToEdit(menu || {});
        setShowEditMenuModal(true);
    };

    const handleUpdateMenu = async () => {
        console.log('Mise à jour du menu:', menuToEdit);
        if (!menuToEdit || !menuToEdit.name || !menuToEdit.price || !menuToEdit.categoryId) {
            console.error('Les informations du menu sont incomplètes.');
            return;
        }

        try {
            const url = apiUrl(`/menus`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuToEdit),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour du menu: ${response.statusText}`);
            }

            setShowEditMenuModal(false);
            fetchMenus(); // Re-fetch menus to reflect changes
        } catch (error) {
            console.error('Erreur lors de la mise à jour du menu:', error);
        }
    };

    const filteredMenus = menus.filter(menu =>
        menu.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Regroupement des menus par catégorie
    const menusByCategory = categories.reduce((acc, category) => {
        acc[category.id] = {
            categoryName: category.name,
            menus: filteredMenus.filter(menu => menu.categoryId === category.id),
        };
        return acc;
    }, {});

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
                            onCreate={menu => {
                                setMenus(prev => [...prev, menu]);
                                toggleModal();
                            }}
                            createMenuModal={toggleModal}
                            categories={categories}
                            statuses={statuses}
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
                            <td colSpan="6" className="text-center py-2">Chargement...</td>
                        </tr>
                    ) : (
                        Object.entries(menusByCategory).map(([_, { categoryName, menus }]) => (
                            menus.length > 0 && (
                                <React.Fragment key={categoryName}>
                                    <tr className='text-center'>
                                        <td colSpan="6" className="font-bold text-lg pt-10">{categoryName}</td>
                                    </tr>
                                    {menus.map(menu => (
                                        <tr key={menu.id} className="hover:bg-gray-100 text-center border-y">
                                            <td className="py-2 px-4">{menu.name}</td>
                                            <td className="py-2 px-4">{menu.price} Ar</td>
                                            <td className="py-2 px-4">{menu.description}</td>
                                            <td className="py-2 px-4 cursor-pointer">
                                                <button
                                                    onClick={() => handleEditStatus(menu)}
                                                    className='flex flex-row gap-1 items-center'
                                                >
                                                    {menu.status}<MdEdit />
                                                </button>
                                            </td>
                                            <td className="py-2 px-4 flex flex-row justify-center">
                                                <button
                                                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                                    onClick={() => handleEditMenu(menu)}
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
                                    ))}
                                </React.Fragment>
                            )
                        ))
                    )}
                </tbody>
            </table>

            {showEditModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Modifier le statut du menu</h2>
                        <select
                            value={menuStatus}
                            onChange={(e) => setMenuStatus(e.target.value)}
                            className="mb-4 border rounded-md p-2"
                        >
                            {statuses.map((status) => (
                                <option key={status.id} value={status.name}>{status.name}</option>
                            ))}
                        </select>
                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                onClick={handleUpdateStatus}
                            >
                                Mettre à jour
                            </button>
                            <button
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                                onClick={() => setShowEditModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditMenuModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{menuToEdit.id ? 'Modifier' : 'Créer'} un Menu</h2>
                        <input
                            type="text"
                            placeholder="Nom"
                            value={menuToEdit.name || ''}
                            onChange={(e) => setMenuToEdit({ ...menuToEdit, name: e.target.value })}
                            className="mb-4 border rounded-md p-2 w-full"
                        />
                        <input
                            type="number"
                            placeholder="Prix"
                            value={menuToEdit.price || ''}
                            onChange={(e) => setMenuToEdit({ ...menuToEdit, price: e.target.value })}
                            className="mb-4 border rounded-md p-2 w-full"
                        />
                        <textarea
                            placeholder="Description"
                            value={menuToEdit.description || ''}
                            onChange={(e) => setMenuToEdit({ ...menuToEdit, description: e.target.value })}
                            className="mb-4 border rounded-md p-2 w-full"
                        />
                        <select
                            value={menuToEdit.categoryId || ''}
                            onChange={(e) => setMenuToEdit({ ...menuToEdit, categoryId: e.target.value })}
                            className="mb-4 border rounded-md p-2 w-full"
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                onClick={handleUpdateMenu}
                            >
                                Enregistrer
                            </button>
                            <button
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                                onClick={() => setShowEditMenuModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuList;
