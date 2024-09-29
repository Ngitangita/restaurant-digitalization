

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl, fetchJson } from '../../services/api';


const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
       (async () => {
            try {
                const data = await fetchJson(apiUrl("/reservations"));
                setReservations(data);
            } catch (err) {
                setError('Erreur lors de la récupération des reservations');
            }
        })();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des reservations</h1>
            {error && <p className="text-red-500">{error}</p>}
            <Link to="/reservations/create">
                <button className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Créer un reservation
                </button>
            </Link>

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Client</th>
                        <th className="py-2 px-4">Chambre</th>
                        <th className="py-2 px-4">Table</th>
                        <th className="py-2 px-4">Date de début</th>
                        <th className="py-2 px-4">Date de fin</th>
                        <th className="py-2 px-4">Statut</th>
                        <th className="py-2 px-4">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4">{reservation.customer_id}</td>
                            <td className="py-2 px-4">{reservation.room_id}</td>
                            <td className="py-2 px-4">{reservation.table_id}</td>
                            <td className="py-2 px-4">{reservation.reservation_start}</td>
                            <td className="py-2 px-4">{reservation.reservation_end}</td>
                            <td className="py-2 px-4">{reservation.status}</td>
                            <td className="py-2 px-4">{reservation.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationList;

