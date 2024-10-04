import React, { useCallback, useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateIngredient from './CreateIngredient';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";

const IngredientList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [units, setUnits] = useState([]);  
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [ingredientName, setIngredientName] = useState('');
    const [unitId, setUnitId] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Nombre d'éléments par page

    const fetchIngredients = async () => {
        try {
            const data = await fetchJson(apiUrl("/ingredients/all"));
            setIngredients(data);
        } catch (err) {
            setError('Erreur lors de la récupération des ingrédients');
        }
    };

    const fetchUnits = async () => {
        try {
            const data = await fetchJson(apiUrl("/units/all"));  
            setUnits(data);
        } catch (err) {
            setError('Erreur lors de la récupération des unités');
        }
    };

    useEffect(() => {
        fetchIngredients();
        fetchUnits();
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleModalOpen = useCallback((data) => {
        setIsModalOpen(data);
        fetchIngredients();  // Actualiser la liste des ingrédients après ajout
    }, []);

    const confirmDelete = (id) => {
        setSelectedIngredient(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetchJson(apiUrl(`/ingredients/${selectedIngredient}`), 'DELETE');
            setShowDeleteModal(false);
            setSelectedIngredient(null);
            fetchIngredients();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'ingrédient:', error);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedIngredient(null);
    };

    const handleEdit = (ingredient) => {
        setSelectedIngredient(ingredient.id);
        setIngredientName(ingredient.name);
        setUnitId(ingredient.unitId); 
        setShowEditModal(true);
    };

    const handleUpdateIngredient = async () => {
        if (!ingredientName || !unitId) {
            setError('Veuillez fournir un nom et sélectionner une unité');
            return;
        }

        try {
            await fetchJson(apiUrl(`/ingredients`), 'PUT', {
                id: selectedIngredient,
                name: ingredientName,
                unitId: unitId  
            });
            setShowEditModal(false);
            setSelectedIngredient(null);
            fetchIngredients();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'ingrédient:', error);
        }
    };

    const getUnitName = (id) => {
        const unit = units.find(u => u.id === id);
        return unit ? unit.abbreviation : 'N/A';
    };

    // Pagination logic
    const indexOfLastIngredient = currentPage * itemsPerPage;
    const indexOfFirstIngredient = indexOfLastIngredient - itemsPerPage;
    const currentIngredients = ingredients.slice(indexOfFirstIngredient, indexOfLastIngredient);

    const totalPages = Math.ceil(ingredients.length / itemsPerPage);

    // Pagination controls
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    return (
        <div className="ingredient container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Ingrédients</h1>
            {error && <p className="text-red-500">{error}</p>}
            <button
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={toggleModal}
            >
                Créer un ingrédient
            </button>
            {isModalOpen && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center top-7">
                    <div className="CreateIngredientModal bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Ajouter un nouvel ingrédient</h2>
                        <CreateIngredient onModalOpen={handleModalOpen} onToggle={toggleModal} />
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Unité</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody className='ingredientTBody'>
                    {currentIngredients.length === 0 ? (
                        <tr className="text-center">
                            <td colSpan="3" className="py-4 text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                                    <p>Aucun ingrédient disponible</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        currentIngredients.map(ingredient => (
                            <tr key={ingredient.id} className="hover:bg-gray-100 text-center border-y border-collapse">
                                <td className="py-2 px-4">{ingredient.name}</td>
                                <td className="py-2 px-4">{getUnitName(ingredient.unitId)}</td>  
                                <td className="py-2 px-4 flex flex-row gap-2 justify-center">
                                    <button
                                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                        onClick={() => handleEdit(ingredient)}
                                    >
                                        <FaRegEdit />
                                    </button>
                                    <button
                                        className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                        onClick={() => confirmDelete(ingredient.id)}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet ingrédient ?</p>
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

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="EditModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Modifier l'ingrédient</h2>
                        <input
                            type="text"
                            value={ingredientName}
                            onChange={(e) => setIngredientName(e.target.value)}
                            placeholder="Nom de l'ingrédient"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                        <select
                            value={unitId}
                            onChange={(e) => setUnitId(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        >
                            <option value="">Sélectionnez une unité</option>
                            {units.map(unit => (
                                <option key={unit.id} value={unit.id}>{unit.abbreviation}</option>
                            ))}
                        </select>
                        <div className="flex justify-around">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleUpdateIngredient}
                            >
                                Mettre à jour
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowEditModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
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

export default IngredientList;
