import React, { useState } from 'react';
import { apiUrl } from '../../services/api';

const CreateMenu = ({ onCreate, createMenuModal, categories, statuses }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState(''); // Nouveau champ pour le statut
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation des champs
        if (!name || !price || !categoryId || !status) {
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
            status // Assurez-vous que le statut est inclus dans l'objet
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
                // Réinitialiser les champs
                setName('');
                setDescription('');
                setPrice('');
                setCategoryId('');
                setStatus(''); // Réinitialiser le statut
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
            {/* Champ pour le nom */}
            <div>
                <label htmlFor="name">Nom:</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>

            {/* Champ pour la description */}
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />
            </div>

            {/* Champ pour le prix */}
            <div>
                <label htmlFor="price">Prix:</label>
                <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>

            {/* Champ pour la catégorie */}
            <div>
                <label htmlFor="categoryId">Catégorie:</label>
                <select
                    id="categoryId"
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

            {/* Champ pour le statut */}
            <div>
                <label htmlFor="status">Statut:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                >
                    <option value="">Sélectionnez un statut</option>
                    {statuses && statuses.length > 0 ? (
                        statuses.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))
                    ) : (
                        <option value="">Aucun statut disponible</option>
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
