import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../services/api';

const RoomDetail = ({ roomId, closeDetail }) => {
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [ isLoading, setIsLoading] = useState(false)

    const fetchRooms = async () => {
        try {
            const [roomsResponse] = await Promise.all([
                fetch(apiUrl(`/rooms/${id}`))
            ]);

            if (!roomsResponse.ok ) {
                throw new Error('Erreur lors de la récupération des données.');
            }

            setRoom(await roomsResponse.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    if (error) return <p>{error}</p>;

    return room ? (
        <div>
            <h2>Détails de la salle</h2>
            <p>Numéro: {room.roomNumber}</p>
            <p>Capacité: {room.capacity}</p>
            <p>Prix: {room.price}</p>
            <p>Statut: {room.status}</p>
            <button onClick={closeDetail}>Fermer</button>
        </div>
    ) : (
        <p>Chargement...</p>
    );
};

export default RoomDetail;
