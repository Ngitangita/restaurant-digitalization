import React, { useState } from 'react';
import { apiUrl } from '../../services/api';

const CreateMenu = ({ onCreate, createMenuModal, categories }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const handleSubmit = async (event) => {
        event.preventDefault();

        
        if (!name || !price || !categoryId) {
            setErrorMessage('Tous les champs doivent être remplis.');
            return;
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            setErrorMessage('Le prix doit être un nombre positif.');
            return;
        }

        const nouveauMenu = {
            name,
            description,
            price: parseFloat(price),
            categoryId: parseInt(categoryId, 10),
        };

        try {
            const response = await fetch(apiUrl('/menus'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nouveauMenu),
            });

            if (response.ok) {
                const createdMenu = await response.json();
                onCreate(createdMenu); 
                setName('');
                setDescription('');
                setPrice('');
                setCategoryId('');
                setErrorMessage(''); 
            } else {
                console.error('Erreur lors de la création du menu');
                setErrorMessage('Erreur lors de la création du menu.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            setErrorMessage('Erreur lors de l\'envoi des données.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='CreateMenuModal'>
            <div>
                <label htmlFor="name">Nom du Menu:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />
            </div>
            <div>
                <label htmlFor="price">Prix:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="category">Catégorie:</label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories && categories.length > 0 ? (
                        categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))
                    ) : (
                        <option value="">Aucune catégorie disponible</option>
                    )}
                </select>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="flex flex-row gap-52 relative top-4">
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Créer</button>
                <button type="button" onClick={createMenuModal} className="ml-2 bg-gray-300 rounded px-4 py-2 hover:bg-gray-400">Annuler</button>
            </div>
        </form>
    );
};

export default CreateMenu;
