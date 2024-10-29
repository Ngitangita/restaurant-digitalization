import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../services/api';

const FloorWithRooms = ({ floorId }) => {
    const [floor, setFloor] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchFloorWithRooms = async () => {
            // Vérifiez si floorId est valide
            if (!floorId || isNaN(floorId)) {
                setErrorMessage('ID de l\'étage invalide.');
                return;
            }

            try {
                const response = await fetch(apiUrl(`/rooms/floor/${floorId}`));
                if (response.ok) {
                    const data = await response.json();
                    setFloor(data);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Erreur lors de la récupération de l\'étage.');
                }
            } catch (error) {
                setErrorMessage('Erreur lors de la récupération de l\'étage.');
            }
        };

        fetchFloorWithRooms();
    }, [floorId]);

    if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;

    return floor ? (
        <div className="mt-4">
            <h2 className="text-xl font-bold">{`Salles de l'Étage ${floor.floorNumber}`}</h2>
            <p>{`Description: ${floor.description}`}</p>
            <ul className="mt-2">
                {floor.rooms.map((room) => (
                    <li key={room.id} className="border p-2 mb-2">
                        <p>{`Salle ${room.roomNumber} - Capacité: ${room.capacity} personnes - Prix: ${room.price} € - Statut: ${room.status}`}</p>
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <p>Chargement...</p>
    );
};

export default FloorWithRooms;
