import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateCategories from './CreateCategories';
import { MdDelete, MdClear } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await fetchJson(apiUrl("/categories/all"));
            setCategories(data);
        } catch (err) {
            const errorMsg = err.message || 'Erreur lors de la récupération des catégories';
            setError(errorMsg);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCategoryCreated = () => {
        fetchCategories();
        setIsModalOpen(false);
    };

    const confirmDelete = (id) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetchJson(apiUrl(`/categories/${categoryToDelete}`), 'DELETE');
            fetchCategories();
        } catch (err) {
            const errorMsg = err.message || 'Erreur lors de la suppression de la catégorie';
            setError(errorMsg);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category || {});
        setShowEditCategoryModal(true);
    };

    const handleSaveEdit = async () => {
        if (!categoryToEdit || !categoryToEdit.id || !categoryToEdit.name) {
            console.error('Les informations de la catégorie sont incomplètes.');
            return;
        }

        try {
            const url = apiUrl(`/categories`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryToEdit),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour de la catégorie: ${response.statusText}`);
            }

            setShowEditCategoryModal(false);
            fetchCategories();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
        }
    };

    const filteredCategories = categories.filter(categorie =>
        categorie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    const handlePageInputChange = (e) => {
        const page = Number(e.target.value);

        // Vérifie si le nombre est valide et à l'intérieur des limites
        if (!isNaN(page)) {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page); // Met à jour la page courante
            } else if (page < 1) {
                setCurrentPage(1); // Si la page est inférieure à 1, aller à la première page
            } else if (page > totalPages) {
                setCurrentPage(totalPages); // Si la page est supérieure au total, aller à la dernière page
            }
        }
    };

    return (
        <div className="container mx-auto p-4 categories bg-white">
            <h1 className="text-2xl font-bold mb-4">Liste des catégories</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className='flex flex-row gap-4'>
                <div className="w-64 relative flex items-center mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher une catégorie"
                        className="p-2 pr-8 border border-gray-300 rounded-md outline-none"
                    />
                    {searchTerm && (
                        <button className="relative right-5" onClick={handleClearSearch}>
                            <MdClear />
                        </button>
                    )}
                </div>

                <button
                    onClick={toggleModal}
                    className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Créer une catégorie
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="creatUnitModal bg-white p-6 rounded-md shadow-md z-[9999]">
                        <h2 className="text-xl mb-4">Créer une nouvelle catégorie</h2>
                        <CreateCategories onClose={toggleModal} onCategoryCreated={handleCategoryCreated} />
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden categoriesTable">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.length > 0 ? currentCategories.map(categorie => (
                        <tr key={categorie.id} className="hover:bg-gray-100 text-center border-y border-collapse">
                            <td className="py-2 px-4 ">{categorie.name}</td>
                            <td className="py-2 px-4">
                                <button
                                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2"
                                    onClick={() => handleEditCategory(categorie)}
                                >
                                    <FaRegEdit />
                                </button>
                                <button
                                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                    onClick={() => confirmDelete(categorie.id)}
                                >
                                    <MdDelete />
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="2" className="py-4 text-center">Aucune catégorie trouvée</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center DeleteModal">
                        <DeleteModal onDelete={handleDelete} onCancel={cancelDelete} />
                    </div>
                </div>
            )}

            {showEditCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="EditModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <EditModal
                            category={categoryToEdit}
                            setCategoryToEdit={setCategoryToEdit}
                            categoryToEdit={categoryToEdit}
                            onSave={handleSaveEdit}
                            onCancel={() => setShowEditCategoryModal(false)}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-between mt-4 items-center">
                <button
                    onClick={handlePrevPage}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    disabled={currentPage === 1}
                >
                    Précédent
                </button>
                <div className="flex items-center">
                    <span className="mr-2">Page {currentPage}/{totalPages}</span>
                    <input
                        type="number"
                        value={currentPage}
                        onChange={handlePageInputChange} // Met à jour la page courante directement
                        min={1}
                        max={totalPages}
                        className="border border-gray-300 rounded-md px-2 py-1 outline-none w-20"
                    />
                </div>
                <button
                    onClick={handleNextPage}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    disabled={currentPage === totalPages}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default CategoriesList;
