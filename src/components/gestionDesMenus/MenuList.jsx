import React, { useEffect, useState } from 'react';
import CreateMenu from './CreateMenu';
import { apiUrl } from '../../services/api';
import { MdDelete, MdClear, MdEdit, MdMoreVert } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import EditMenu from './EditMenu';
import UpdateStatus from './UpdateStatus';
import { useNavigate } from 'react-router-dom';
import ManageMenuIngredients from './menuIngredients/ManageMenuIngredients';

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState({}); // Change here
    const navigate = useNavigate();

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
            const url = apiUrl('/menus');
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
            fetchMenus();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du menu:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(apiUrl(`/menus/${menuToDelete.id}`), {
                method: 'DELETE',
            });
            setShowDeleteModal(false);
            fetchMenus();
        } catch (error) {
            console.error('Erreur lors de la suppression du menu:', error);
        }
    };

    const confirmDelete = (menuId) => {
        const menu = menus.find(m => m.id === menuId);
        setMenuToDelete(menu);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setMenuToDelete(null);
    };

    const filteredMenus = menus.filter(menu =>
        menu.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const menusByCategory = categories.reduce((acc, category) => {
        acc[category.id] = {
            categoryName: category.name,
            menus: filteredMenus.filter(menu => menu.categoryId === category.id),
        };
        return acc;
    }, {});

    const handleClickRow = (menuId) => {
        navigate(`/menu-ingredients/menu/${menuId}`);
    };

    const toggleDetails = (menuId) => {
        setDetailsVisible(prev => ({ ...prev, [menuId]: !prev[menuId] })); // Change here
    };

    return (
        <div className="container bg-white MenuList mx-auto p-10 pb-14">
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
                                        <tr key={menu.id}
                                            className="hover:bg-gray-100 text-center border-y"
                                        >
                                            <td className="py-2 px-4">{menu.name}</td>
                                            <td className="py-2 px-4">{menu.price}</td>
                                            <td className="py-2 px-4">{menu.description}</td>
                                            <td className="py-2 px-4">{menu.status}</td>
                                            <td className="py-2 px-4 flex flex-row justify-center gap-2">
                                                <button
                                                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                                    onClick={() => handleEditMenu(menu)}
                                                >
                                                    <FaRegEdit />
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                                                    onClick={() => confirmDelete(menu.id)}
                                                >
                                                    <MdDelete />
                                                </button>
                                                <button className="relative">
                                                    <button onClick={() => toggleDetails(menu.id)} className="focus:outline-none rounded p-2 bg-gray-200">
                                                        <MdMoreVert />
                                                    </button>
                                                    {detailsVisible[menu.id] && (
                                                        <div className="absolute text-start right-[1px] bottom-9 w-72 bg-gray-300 shadow-md rounded-md z-50 "> {/* Ajustez mt-1 pour espacement */}
                                                            <button onClick={() => handleClickRow(menu.id)} 
                                                            className="block text-start px-4 py-2 hover:bg-gray-100 w-full
                                                            border-y border-white">
                                                                Voir détail
                                                            </button>
                                                            <ManageMenuIngredients menuId={menu.id} />
                                                        </div>
                                                    )}
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
                        <UpdateStatus
                            onUpdate={handleUpdateStatus}
                            onClose={() => setShowEditModal(false)}
                            selectedMenuId={selectedMenuId}
                            menuStatus={menuStatus}
                            setMenuStatus={setMenuStatus}
                        />
                    </div>
                </div>
            )}

            {showEditMenuModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <EditMenu
                            menu={menuToEdit}
                            onUpdate={handleUpdateMenu}
                            onClose={() => setShowEditMenuModal(false)}
                            categories={categories}
                        />
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
                        <p>Voulez-vous vraiment supprimer le menu {menuToDelete?.name} ?</p>
                        <div className="mt-4">
                            <button
                                className="bg-red-500 text-white rounded p-2 hover:bg-red-600 mr-2"
                                onClick={handleDelete}
                            >
                                Oui
                            </button>
                            <button
                                className="bg-gray-300 text-black rounded p-2 hover:bg-gray-400"
                                onClick={cancelDelete}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuList;
