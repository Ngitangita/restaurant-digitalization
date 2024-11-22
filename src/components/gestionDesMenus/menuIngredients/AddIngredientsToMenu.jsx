import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const schema = zod.object({
    ingredientId: zod.number().positive().optional(),
    quantity: zod.number().positive().min(1, 'Quantité invalide'),
});

const AddIngredientsToMenu = ({ onAddIngredients, ingredients, closeModal }) => {
    const [ingredientQuantities, setIngredientQuantities] = useState([]);
    const [ingredientInput, setIngredientInput] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedForDeletion, setSelectedForDeletion] = useState([]);
    const [hoveredIngredient, setHoveredIngredient] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { menuId } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        setIngredientQuantities([]);
    }, [ingredients]);

    const handleIngredientInputChange = (event) => {
        const term = event.target.value.toLowerCase();
        setIngredientInput(term);
        
        const foundIngredients = ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(term));
        setFilteredIngredients(foundIngredients);
        setShowSuggestions(foundIngredients.length > 0);
    };

    const handleSuggestionClick = (ingredient) => {
        setIngredientInput(ingredient.name);
        setSelectedIngredient(ingredient.id);
        setShowSuggestions(false);
    };

    const addIngredient = () => {
        if (!selectedIngredient || !quantity || parseFloat(quantity) <= 0) {
            setErrorMessage('Sélectionnez un ingrédient et entrez une quantité valide.');
            return;
        }

        const existingIngredient = ingredientQuantities.find(iq => iq.ingredientId === selectedIngredient);
        if (existingIngredient) {
            setErrorMessage('Cet ingrédient a déjà été sélectionné.');
            return;
        }

        const newIngredient = {
            ingredientId: selectedIngredient,
            quantity: parseFloat(quantity),
            name: ingredients.find(i => i.id === selectedIngredient).name,
        };

        setIngredientQuantities([...ingredientQuantities, newIngredient]);
        setIngredientInput('');
        setQuantity('');
        setSelectedIngredient(null);
        setErrorMessage('');
    };

    const onSubmit = async () => {
        if (!menuId || ingredientQuantities.length === 0) {
            setErrorMessage('Veuillez sélectionner un menu et ajouter au moins un ingrédient.');
            return;
        }

        const menuIngredientsData = {
            menuId: parseInt(menuId, 10),
            ingredients: ingredientQuantities.map(({ ingredientId, quantity }) => ({
                ingredientId,
                quantity,
            })),
        };
        console.log(menuIngredientsData);
        

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

    const toggleDeleteMode = (ingredientId) => {
        setSelectedForDeletion(selectedForDeletion.includes(ingredientId) ? 
            selectedForDeletion.filter(id => id !== ingredientId) :
            [...selectedForDeletion, ingredientId]);
    };

    const removeSelectedIngredients = () => {
        setIngredientQuantities(ingredientQuantities.filter(iq => !selectedForDeletion.includes(iq.ingredientId)));
        setSelectedForDeletion([]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="AddIngredientsModal">
            <h1 className="text-2xl font-bold mb-4">Gestion des ingrédients de menus</h1>

            <div className="flex flex-row gap-2 border-b-[1px] pb-5">
                <div className="flex flex-col w-full relative">
                    <label htmlFor="ingredientInput" className="block text-md font-medium text-gray-700">
                        Ingrédient Sélectionné
                    </label>
                    <input
                        id="ingredientInput"
                        type="text"
                        value={ingredientInput}
                        onChange={handleIngredientInputChange}
                        placeholder="Tapez les noms de l'ingrédient..."
                        className="block border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2"
                    />
                    {showSuggestions && (
                        <ul className="absolute top-full left-0 w-full border border-gray-300 bg-white max-h-32 overflow-y-auto z-10">
                            {filteredIngredients.map(ingredient => (
                                <li
                                    key={ingredient.id}
                                    onClick={() => handleSuggestionClick(ingredient)}
                                    className="p-2 hover:bg-blue-100 cursor-pointer"
                                >
                                    {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    {errors.ingredientId && <p className="text-red-500 text-sm">{errors.ingredientId.message}</p>}
                </div>

                <div>
                    <label htmlFor="quantity">Quantité :</label>
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded outline-none"
                    />
                </div>

                <button type="button" onClick={addIngredient}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 mt-6">
                    Ajouter l'ingrédient
                </button>
            </div>

            <div>
                <ul className="mt-4 pb-5">
                    {ingredientQuantities.map((ingredient, index) => (
                        <li
                            key={index}
                            className={`flex items-center cursor-pointer hover:bg-gray-100 text-center ${selectedForDeletion.includes(ingredient.ingredientId) ? 'bg-gray-200' : ''} transition-all`}
                            onMouseEnter={() => !selectedForDeletion.includes(ingredient.ingredientId) && setHoveredIngredient(ingredient.ingredientId)}
                            onMouseLeave={() => setHoveredIngredient(null)}
                            onClick={() => toggleDeleteMode(ingredient.ingredientId)}
                        >
                            {(hoveredIngredient === ingredient.ingredientId || selectedForDeletion.includes(ingredient.ingredientId)) && (
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedForDeletion.includes(ingredient.ingredientId)}
                                    onChange={() => toggleDeleteMode(ingredient.ingredientId)}
                                />
                            )}
                            {ingredient.name} - Quantité: {ingredient.quantity} 
                        </li>
                    ))}
                </ul>

                {selectedForDeletion.length > 0 && (
                    <button type="button" onClick={removeSelectedIngredients}
                        className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2">
                        <MdDelete />
                    </button>
                )}

                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </div>

            <div className="mt-4">
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
                    Soumettre
                </button>
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 ml-2">
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default AddIngredientsToMenu;
