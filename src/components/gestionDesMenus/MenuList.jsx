import React, { useEffect, useState } from 'react';
import CreateMenu from './CreateMenu';
import { apiUrl } from '../../services/api';
import { MdDelete, MdClear } from 'react-icons/md';

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Nombre d'éléments par page

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const fetchMenus = async () => {
        setIsLoading(true);
        try {
            const [menusResponse, categoriesResponse] = await Promise.all([
                fetch(apiUrl('/menus/all')),
                fetch(apiUrl('/categories/all'))
            ]);

            if (!menusResponse.ok || !categoriesResponse.ok) {
                throw new Error('Erreur lors de la récupération des menus ou des catégories');
            }

            const menusData = await menusResponse.json();
            const categoriesData = await categoriesResponse.json();

            setMenus(menusData);
            setCategories(categoriesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const filteredMenus = menus.filter(menu =>
        menu.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastMenu = currentPage * itemsPerPage;
    const indexOfFirstMenu = indexOfLastMenu - itemsPerPage;
    const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);

    const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleCreateMenu = (menu) => {
        setMenus((prevMenus) => [...prevMenus, menu]);
        toggleModal();
    };

    const confirmDelete = (id) => {
        setSelectedMenu(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetch(apiUrl(`/menus/${selectedMenu}`), { method: 'DELETE' });
            setShowDeleteModal(false);
            setSelectedMenu(null);
            fetchMenus(); // Récupérer à nouveau les menus après la suppression
        } catch (error) {
            console.error('Erreur lors de la suppression du menu:', error);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedMenu(null);
    };

    // Pagination controls
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Menus</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className='flex flex-row gap-4'>
                <div className="w-64 relative flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher un menu"
                        className="pr-10 p-2 border rounded-md outline-none"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && (
                        <button className='absolute right-8' onClick={handleClearSearch}>
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
                        <h2 className="text-lg font-bold mb-4">Ajouter un nouveau menu</h2>
                        <CreateMenu
                            onCreate={handleCreateMenu}
                            createMenuModal={toggleModal}
                            categories={categories}
                        />
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Prix</th>
                        <th className="py-2 px-4">Description</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="4" className="text-center py-2">Chargement...</td>
                        </tr>
                    ) : (
                        currentMenus.length > 0 ? (
                            currentMenus.map(menu => (
                                <tr key={menu.id} className="hover:bg-gray-100 text-center border-y border-collapse">
                                    <td className="py-2 px-4">{menu.name}</td>
                                    <td className="py-2 px-4">{menu.price} €</td>
                                    <td className="py-2 px-4">{menu.description}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                            onClick={() => confirmDelete(menu.id)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-2">Aucun menu disponible</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce menu ?</p>
                        <div className="flex justify-around">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={handleDelete}
                            >
                                Supprimer
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={cancelDelete}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    Précédent
                </button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default MenuList;
