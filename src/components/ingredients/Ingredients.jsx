import React, { useCallback, useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import CreateIngredient from './CreateIngredient';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline, MdClear } from "react-icons/md";
import useFetch from '../../hooks/useFetch';
import EditIngredients from './EditIngredients';

const IngredientList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null); // Pour stocker l'ID de l'ingrédient sélectionné
    const [ingredientName, setIngredientName] = useState(null);
    const [unitId, setUnitId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const { data: units } = useFetch(() => apiUrl("/units/all"));
    const [searchTerm, setSearchTerm] = useState('');

    // Fonction pour récupérer les ingrédients
    const fetchIngredients = async () => {
        try {
            const data = await fetchJson(apiUrl("/ingredients/all"));
            setIngredients(data);
        } catch (err) {
            setError('Erreur lors de la récupération des ingrédients');
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    // Gérer l'ouverture/fermeture de la modale
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Rechargement des ingrédients après ajout/mise à jour
    const handleModalOpen = useCallback((data) => {
        setIsModalOpen(data);
        fetchIngredients();
    }, []);

    // Confirmer la suppression
    const confirmDelete = (id) => {
        setSelectedIngredient(id); // Stocker l'ID de l'ingrédient sélectionné
        setShowDeleteModal(true);
    };

    // Supprimer un ingrédient
    const handleDelete = async () => {
        try {
            await fetchJson(apiUrl(`/ingredients/${selectedIngredient}`), 'DELETE');
            setShowDeleteModal(false);
            setSelectedIngredient(null);
            fetchIngredients(); // Mettre à jour la liste après suppression
        } catch (error) {
            setError('Erreur lors de la suppression de l\'ingrédient');
        }
    };

    // Annuler la suppression
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedIngredient(null);
    };

    // Ouvrir la modale d'édition avec les informations de l'ingrédient
    const handleEdit = (ingredient) => {
        setSelectedIngredient(ingredient.id); // Stocker l'ID de l'ingrédient sélectionné
        setIngredientName(ingredient.name);
        setUnitId(ingredient.unitId);
        setShowEditModal(true);
    };

    // Mettre à jour un ingrédient
    const handleUpdateIngredient = async () => {
        if (!ingredientName || !unitId) {
            setError('Veuillez fournir un nom et sélectionner une unité');
            return;
        }

        try {
            await fetchJson(apiUrl(`/ingredients`), 'PUT', {
                id: selectedIngredient, // Utiliser l'ID de l'ingrédient sélectionné
                name: ingredientName,
                unitId: unitId
            });
            setShowEditModal(false);
            setSelectedIngredient(null);
            fetchIngredients(); // Mettre à jour la liste après l'édition
        } catch (error) {
            setError('Erreur lors de la mise à jour de l\'ingrédient');
        }
    };

    // Récupérer le nom de l'unité
    const getUnitName = (id) => {
        const unit = units.find(u => u.id === id);
        return unit ? unit.abbreviation : 'N/A';
    };

    // Filtrer les ingrédients par terme de recherche
    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastIngredient = currentPage * itemsPerPage;
    const indexOfFirstIngredient = indexOfLastIngredient - itemsPerPage;
    const currentIngredients = filteredIngredients.slice(indexOfFirstIngredient, indexOfLastIngredient);

    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
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
        <div className="ingredient container mx-auto p-4 bg-white">
            <h1 className="text-2xl font-bold mb-4">Liste des Ingrédients</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className='flex flex-row gap-4'>
                <div className="w-64 relative flex items-center mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un ingrédient"
                        className="p-2 pr-8 border border-gray-300 rounded-md outline-none"
                    />
                    {searchTerm && (
                        <button className="relative right-5" onClick={handleClearSearch}>
                            <MdClear />
                        </button>
                    )}
                </div>
                <button
                    className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
                    onClick={toggleModal}
                >
                    Créer un ingrédient
                </button>
            </div>

            {isModalOpen && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center ">
                    <div className="CreateIngredientModal bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Ajouter un nouvel ingrédient</h2>
                        <CreateIngredient onModalOpen={handleModalOpen} onToggle={toggleModal} />
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden ingredientTable">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Unité</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
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
                            <tr key={ingredient.id} className="hover:bg-gray-100 text-center border-y">
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

            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Précédent
                </button>
                <div className="flex items-center">
                    <span className="self-center">{`Page ${currentPage} / ${totalPages}`}</span>
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
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Suivant
                </button>
            </div>

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg DeleteModal">
                        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer cet ingrédient ?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2" onClick={handleDelete}>Supprimer</button>
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={cancelDelete}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'édition */}
            {showEditModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg EditModal">
                        <EditIngredients
                            ingredientName={ingredientName}
                            setIngredientName={setIngredientName}
                            unitId={unitId}
                            setUnitId={setUnitId}
                            units={units}
                            onSave={handleUpdateIngredient}
                            onCancel={() => setShowEditModal(false)}
                            error={error}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientList;
