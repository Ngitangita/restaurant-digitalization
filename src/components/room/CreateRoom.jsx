import React, { useState } from 'react';
import { apiUrl } from '../../services/api';

const CreateRoom = ({ onCreate, createRoomModal, statuses = [], floors = [] }) => {
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');
    const [floorId, setFloorId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [capacity, setCapacity] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!roomNumber || !price || !capacity || !status || !floorId) {
            setErrorMessage('Tous les champs doivent être remplis.');
            return;
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            setErrorMessage('Le prix doit être un nombre positif.');
            return;
        }

        const nouveauRoom = {
            roomNumber,
            capacity,
            floorId,
            price: parseFloat(price),
            status,
        };

        try {
            const response = await fetch(apiUrl('/rooms'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nouveauRoom),
            });

            if (response.ok) {
                const createdRoom = await response.json();
                onCreate(createdRoom);

                // Reset fields
                setRoomNumber('');
                setCapacity('');
                setPrice('');
                setStatus('');
                setFloorId('');
                setErrorMessage('');
                createRoomModal();
            } else {
                setErrorMessage('Erreur lors de la création du room.');
            }
        } catch (error) {
            setErrorMessage('Erreur lors de l\'envoi des données.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='CreateRoomModal'>
            <div>
                <label htmlFor="roomNumber">Room number:</label>
                <input
                    id="roomNumber"
                    type="number"
                    placeholder="Numéro de la salle"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="capacity">Capacité:</label>
                <input
                    id="capacity"
                    type="number"
                    placeholder="Capacity de la salle"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>
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

            {/* Floor and Status selectors */}
            <div>
                <label htmlFor="floorId">Etage:</label>
                <select
                    id="floorId"
                    value={floorId}
                    onChange={(e) => setFloorId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                >
                    <option value="">Sélectionnez une étage</option>
                    {floors.map(floor => (
                        <option key={floor.id} value={floor.id}>
                            {floor.floorNumber}
                        </option>
                    ))}
                </select>
            </div>

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
                    {statuses.map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="flex flex-row gap-52 relative top-4">
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Créer</button>
                <button
                    type="button"
                    onClick={createRoomModal}
                    className="ml-2 bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400"
                >
                    Annuler
                </button>

            </div>
        </form>
    );
};

export default CreateRoom;
