import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { MdDelete } from 'react-icons/md';
import { apiUrl } from '../../../services/api';

const schema = zod.object({
    quantity: zod.number().positive().min(1, 'Quantité invalide'),
});

const AddIngredientsToMenu = ({ onAddIngredients, ingredients, closeModal }) => {
    const [ingredientQuantities, setIngredientQuantities] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedForDeletion, setSelectedForDeletion] = useState([]);

    const { menuId } = useParams();
    const navigate = useNavigate();

    const { handleSubmit } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        setIngredientQuantities([]);
    }, [ingredients]);

    const addIngredient = () => {
        if (!selectedIngredient || !quantity || parseFloat(quantity) <= 0) {
            setErrorMessage('Sélectionnez un ingrédient et entrez une quantité valide.');
            return;
        }

        const existingIngredient = ingredientQuantities.find(iq => iq.ingredientId === selectedIngredient.id);
        if (existingIngredient) {
            setErrorMessage('Cet ingrédient a déjà été sélectionné.');
            return;
        }

        const newIngredient = {
            ingredientId: selectedIngredient.id,
            name: selectedIngredient.name,
            quantity: parseFloat(quantity),
        };

        setIngredientQuantities([...ingredientQuantities, newIngredient]);
        setSelectedIngredient(null);
        setQuantity('');
        setErrorMessage('');
    };

    const toggleDeleteMode = (ingredientId) => {
        if (selectedForDeletion.includes(ingredientId)) {
            setSelectedForDeletion(selectedForDeletion.filter(id => id !== ingredientId));
        } else {
            setSelectedForDeletion([...selectedForDeletion, ingredientId]);
        }
    };

    const handleIngredientClick = (ingredientId) => {
        toggleDeleteMode(ingredientId);
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

        try {
            const response = await fetch(apiUrl('/menus/add-ingredients'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuIngredientsData),
            });

            if (response.ok) {
                onAddIngredients();
                closeModal();
                navigate(`/menu-ingredients/menu/${menuId}`);
            } else {
                setErrorMessage('Erreur lors de l’ajout des ingrédients au menu.');
            }
        } catch {
            setErrorMessage('Erreur lors de l’envoi des données.');
        }
    };

    const removeSelectedIngredients = () => {
        setIngredientQuantities(ingredientQuantities.filter(iq => !selectedForDeletion.includes(iq.ingredientId)));
        setSelectedForDeletion([]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="AddIngredientsModal">
            <h1 className="text-2xl font-bold mb-4">Gestion des ingrédients de menus</h1>

            <div className="flex flex-row gap-2 border-b-[1px] pb-5 items-center">
                <Autocomplete
                    options={ingredients}
                    getOptionLabel={(option) => option.name || ''}
                    value={selectedIngredient}
                    onChange={(event, newValue) => setSelectedIngredient(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingrédient"
                            placeholder="Sélectionnez un ingrédient..."
                        />
                    )}
                    sx={{
                        width: '300px',
                        height: '50px',
                        '.MuiInputBase-root': { height: '40px' },
                    }}
                />
                <TextField
                    id="outlined-number"
                    label="Quantité"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        width: '150px',
                        height: '50px',
                        '.MuiInputBase-root': { height: '40px' },
                    }}
                />


                <button
                    type="button"
                    onClick={addIngredient}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 mb-2"
                >
                    Ajouter l'ingrédient
                </button>
            </div>

            <div>
                <ul className="mt-4 pb-5">
                    {ingredientQuantities.map((ingredient) => (
                        <li
                            key={ingredient.ingredientId}
                            className={`flex items-center cursor-pointer hover:bg-gray-100 text-center ${selectedForDeletion.includes(ingredient.ingredientId) ? 'bg-gray-200' : ''
                                } transition-all`}
                            onClick={() => handleIngredientClick(ingredient.ingredientId)}
                        >
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedForDeletion.includes(ingredient.ingredientId)}
                                onChange={() => toggleDeleteMode(ingredient.ingredientId)}
                            />
                            {ingredient.name} - Quantité: {ingredient.quantity}
                        </li>
                    ))}
                </ul>

                {selectedForDeletion.length > 0 && (
                    <button
                        type="button"
                        onClick={removeSelectedIngredients}
                        className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                    >
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

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </form>
    );
};

export default AddIngredientsToMenu;
