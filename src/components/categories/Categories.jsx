import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateCategories from './CreateCategories'; 
import { MdDelete } from 'react-icons/md'; 

// Composant Modal pour confirmer la suppression
const DeleteModal = ({ onDelete, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
            <div className="flex justify-around">
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={onDelete}
                >
                    Supprimer
                </button>
                <button
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>
            </div>
        </div>
    </div>
);

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [categoryToDelete, setCategoryToDelete] = useState(null); 

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Nombre d'éléments par page

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

    // Pagination logic
    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des catégories</h1>
            {error && <p className="text-red-500">{error}</p>}
            
            <button
                onClick={toggleModal}
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
                Créer une catégorie
            </button>

            {isModalOpen && (
                <CreateCategories onClose={toggleModal} onCategoryCreated={handleCategoryCreated} />
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
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
                <DeleteModal onDelete={handleDelete} onCancel={cancelDelete} />
            )}

         
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Précédent
                </button>
                <span className="self-center">{`Page ${currentPage} sur ${totalPages}`}</span>
                <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default CategoriesList;
