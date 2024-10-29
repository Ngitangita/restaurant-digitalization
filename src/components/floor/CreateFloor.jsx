import React, { useState } from 'react';
import { apiUrl } from '../../services/api';

const CreateFloor = ({ onCreate, closeModal }) => {
    const [floorNumber, setFloorNumber] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation des champs
        if (!floorNumber || !description) {
            setErrorMessage('Tous les champs doivent être remplis.');
            return;
        }

        const nouveauFloor = {
            floorNumber,
            description,
        };

        try {
            const response = await fetch(apiUrl('/floors'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nouveauFloor),
            });

            if (response.ok) {
                const createdFloor = await response.json();
                onCreate(createdFloor); 
                setFloorNumber('');
                setDescription('');
                setErrorMessage('');
            } else {
                console.error('Erreur lors de la création du floor');
                setErrorMessage('Erreur lors de la création du floor.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            setErrorMessage('Erreur lors de l\'envoi des données.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Créer un nouvel étage</h2>
            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Numéro de l'étage"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isLoading && <p>Loading...</p>}
            <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
                    Créer
                </button>
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600">
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default CreateFloor;
