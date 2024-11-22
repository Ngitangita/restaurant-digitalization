import React, { useEffect, useState } from 'react';
import { fetchJson, apiUrl } from '../../services/api';
import CreateReservation from '../../components/createReservation/CreateReservation';

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [status, setStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState({});
 
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const [reservationsResponse, roomsResponse, customersResponse, statusesResponse] = await Promise.all([
        fetch(apiUrl(`/reservations`)),
        fetch(apiUrl('/rooms')),
        fetch(apiUrl('/customers/all')),
        fetch(apiUrl('/reservations/status'))
      ]);

      if (!reservationsResponse.ok || !roomsResponse.ok || !customersResponse || !statusesResponse.ok) {
        throw new Error('Erreur lors de la récupération des chambres, clients ou statuts');
      }

      const reservationsData = await reservationsResponse.json();
      const customersData = await customersResponse.json();
      const roomsData = await roomsResponse.json();
      const statusesData = await statusesResponse.json();

      setReservations(reservationsData);
      setRooms(roomsData);
      setStatuses(statusesData);
      setCustomers(customersData)
    } catch (err) {
      setError(err.message);
      showError("Erreur lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchReservations();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Liste des Réservations</h1>

      <button
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
        onClick={toggleModal}
      >
        Créer un réservation
      </button>

      {isModalOpen && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="CreateModal bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className='flex flex-row justify-between items-center'>
              <h2 className="text-xl pl-8 pt-8 pb-4">Créer une nouvelle réservation</h2>
              <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                onClick={toggleModal}>
                x
              </span>
            </div>
            <CreateReservation
              onCreate={reservation => {
                setReservations(prev => [...prev, reservation]);
                toggleModal();
              }}
              createReservationModal={toggleModal}
              rooms={rooms}
              customers={customers}
              statuses={statuses}
            />
          </div>
        </div>
      )}

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Chambre</th>
            <th className="px-4 py-2">Date de début</th>
            <th className="px-4 py-2">Date de fin</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b">
              <td className="px-4 py-2">{reservation.customer.lastName}</td>
              <td className="px-4 py-2">{reservation.room ? reservation.room.roomNumber : 'N/A'}</td>
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
