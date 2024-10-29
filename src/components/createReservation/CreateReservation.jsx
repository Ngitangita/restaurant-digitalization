import React, { useState } from 'react';
import { apiUrl } from '../../services/api';

const CreateReservation = ({ onCreate, createReservationModal, rooms = [], customers = [] }) => {
    const [customerId, setCustomerId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(''); // Par exemple, 'CONFIRMED', 'CANCELLED', etc.
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation des champs
        if (!customerId || !roomId || !startDate || !endDate || !description || !status) {
            setErrorMessage('Tous les champs doivent être remplis.');
            return;
        }

        const newReservation = {
            customer: { id: customerId }, // Créez un objet CustomerDTO
            room: { id: roomId }, // Créez un objet RoomDTO
            description,
            reservationStart: new Date(startDate).toISOString(), // Formatez pour LocalDateTime
            reservationEnd: new Date(endDate).toISOString(), // Formatez pour LocalDateTime
            status, // État de la réservation
        };

        try {
            const response = await fetch(apiUrl('/reservations'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReservation),
            });

            if (response.ok) {
                const createdReservation = await response.json();
                onCreate(createdReservation);

                // Réinitialisez les champs après la création réussie
                setCustomerId('');
                setRoomId('');
                setStartDate('');
                setEndDate('');
                setDescription('');
                setStatus('');
                setErrorMessage('');
                createReservationModal(); // Ferme la modal
            } else {
                setErrorMessage('Erreur lors de la création de la réservation.');
            }
        } catch (error) {
            setErrorMessage('Erreur lors de l\'envoi des données.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='CreateReservationModal'>
            <div>
                <label htmlFor="customerId" className="block text-md font-medium text-gray-700">
                    Sélectionnez un Client
                </label>
                <select
                    id="customerId"
                    {...register("customerId")}
                    className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.customerId ? 'border-red-500' : ''}`}
                >
                    <option value="">Sélectionnez un client</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.lastName}</option>
                    ))}
                </select>
                {errors.customerId && <p className="text-red-500 text-sm">{errors.customerId.message}</p>}
            </div>
            <div>
                <label htmlFor="roomId" className="block text-md font-medium text-gray-700">
                    Sélectionnez une Chambre
                </label>
                <select
                    id="roomId"
                    {...register("roomId")}
                    className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.roomId ? 'border-red-500' : ''}`}
                >
                    <option value="">Sélectionnez une chambre</option>
                    {rooms.map(room => (
                        <option key={room.id} value={room.id}>{room.roomNumber}</option>
                    ))}
                </select>
                {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId.message}</p>}
            </div>
            <div>
                <label htmlFor="startDate">Date de début:</label>
                <input
                    id="startDate"
                    type="datetime-local" // Utilisation de datetime-local pour LocalDateTime
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="endDate">Date de fin:</label>
                <input
                    id="endDate"
                    type="datetime-local" // Utilisation de datetime-local pour LocalDateTime
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                    required
                />
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
                    <option value="CONFIRMED">Confirmé</option>
                    <option value="CANCELLED">Annulé</option>
                    {/* Ajoutez d'autres états selon vos besoins */}
                </select>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="flex flex-row gap-52 relative top-4">
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Créer</button>
                <button
                    type="button"
                    onClick={createReservationModal}
                    className="ml-2 bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default CreateReservation;
