import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

const AddIngredientsToMenu = ({ onAddIngredients, ingredients, closeModal }) => {
    const [ingredientQuantities, setIngredientQuantities] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedForDeletion, setSelectedForDeletion] = useState([]);
    const [hoveredIngredient, setHoveredIngredient] = useState(null);
    const { menuId } = useParams();
    const navigate = useNavigate();

    const addIngredient = () => {
        if (!selectedIngredient || !quantity || parseFloat(quantity) <= 0) {
            setErrorMessage('Sélectionnez un ingrédient et entrez une quantité valide.');
            return;
        }

        const existingIngredient = ingredientQuantities.find(iq => iq.ingredientId === parseInt(selectedIngredient, 10));
        if (existingIngredient) {
            setErrorMessage('Cet ingrédient a déjà été sélectionné.');
            return;
        }

        const newIngredient = {
            ingredientId: parseInt(selectedIngredient, 10),
            quantity: parseFloat(quantity),
            name: ingredients.find(i => i.id === parseInt(selectedIngredient, 10)).name
        };

        setIngredientQuantities([...ingredientQuantities, newIngredient]);
        setSelectedIngredient('');
        setQuantity('');
        setErrorMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!menuId || ingredientQuantities.length === 0) {
            setErrorMessage('Veuillez sélectionner un menu et ajouter au moins un ingrédient.');
            return;
        }

        const menuIngredientsData = {
            menuId: parseInt(menuId, 10),
            ingredients: ingredientQuantities.map(({ ingredientId, quantity }) => ({
                ingredientId,
                quantity
            }))
        };

        try {
            const response = await fetch(apiUrl('/menus/add-ingredients'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuIngredientsData),
            });

            if (response.ok) {
                onAddIngredients();
                closeModal();
                navigate(`/menu-ingredients/menu/${menuId}`);
            } else {
                setErrorMessage('Erreur lors de l’ajout des ingrédients au menu.');
            }
        } catch (error) {
            setErrorMessage('Erreur lors de l’envoi des données.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="AddIngredientsModal">
            <h1 className="text-2xl font-bold mb-4">Gestion des ingrédients de menus</h1>
            {/* Formulaire pour ajouter les ingrédients */}
            <div className='flex flex-row gap-2 border-b-[1px] pb-5'>
                <div>
                    <label htmlFor="ingredientId">Ingrédient:</label>
                    <select
                        id="ingredientId"
                        value={selectedIngredient}
                        onChange={(e) => setSelectedIngredient(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Sélectionnez un ingrédient</option>
                        {ingredients.length > 0 ? (
                            ingredients.map(ingredient => (
                                <option key={ingredient.id} value={ingredient.id}>
                                    {ingredient.name}
                                </option>
                            ))
                        ) : (
                            <option value="">Aucun ingrédient disponible</option>
                        )}
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity">Quantité (g):</label>
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <button type="button" onClick={addIngredient}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 mt-6">
                    Ajouter l'ingrédient
                </button>
            </div>

            {/* Liste des ingrédients ajoutés */}
            <div>
                <ul className="mt-4 pb-5">
                    {ingredientQuantities.map((ingredient, index) => (
                        <li 
                            key={index} 
                            className={`flex items-center cursor-pointer hover:bg-gray-100 text-center ${selectedForDeletion.includes(ingredient.ingredientId) ? 'bg-gray-200' : ''} transition-all`} 
                        >
                            {ingredient.name} - Quantité: {ingredient.quantity} g
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
                    Soumettre
                </button>
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 ml-2">
                    Annuler
                </button>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
        </form>
    );
};

export default AddIngredientsToMenu;
