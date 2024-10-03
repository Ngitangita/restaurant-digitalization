import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateCategories from './CreateCategories'; 
import { MdDelete } from 'react-icons/md'; 

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [categoryToDelete, setCategoryToDelete] = useState(null); 

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await fetchJson(apiUrl("/categories/all")); 
            setCategories(data);
        } catch (err) {
            setError('Erreur lors de la récupération des catégories');
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCategoryCreated = () => {
        fetchCategories(); 
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
            setError('Erreur lors de la suppression de la catégorie');
        } finally {
            setShowDeleteModal(false); 
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false); 
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
                    {categories.map(categorie => (
                        <tr key={categorie.id} className="hover:bg-gray-100 text-center">
                            <td className="py-2 px-4">{categorie.name}</td>
                            <td className="py-2 px-4">
                                <button
                                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                    onClick={() => confirmDelete(categorie.id)}
                                >
                                    <MdDelete />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDeleteModal && ( 
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
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
        </div>
    );
};

export default CategoriesList;
