import React, { useEffect, useState } from 'react';
import { fetchJson, apiUrl } from '../../services/api';

function ReservationList() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsData = await fetchJson(apiUrl("/reservations"));
        setReservations(reservationsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Liste des Réservations</h1>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Chambre</th>
            <th className="px-4 py-2">Table</th>
            <th className="px-4 py-2">Date de début</th>
            <th className="px-4 py-2">Date de fin</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b">
              <td className="px-4 py-2">{reservation.customer.name}</td>
              <td className="px-4 py-2">{reservation.room ? reservation.room.number : 'N/A'}</td>
              <td className="px-4 py-2">{reservation.table ? reservation.table.id : 'N/A'}</td>
              <td className="px-4 py-2">{reservation.reservationStart}</td>
              <td className="px-4 py-2">{reservation.reservationEnd}</td>
              <td className="px-4 py-2">{reservation.status}</td>
              <td className="px-4 py-2">{reservation.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationList;
