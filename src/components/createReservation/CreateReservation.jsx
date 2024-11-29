import React, { useState } from 'react';
import { apiUrl } from '../../services/api';
import { convertStatusToReservation } from '../../services/convertStatus';

const CreateReservation = ({ onCreate, createReservationModal, statuses, rooms, customers }) => {
    const [customerId, setCustomerId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

     
        if (!customerId || !roomId || !startDate || !endDate || !description || !status) {
            setErrors('Tous les champs doivent être remplis.');
            return;
        }

        const newReservation = {
            customerId,
            roomId, 
            description,
            reservationStart: new Date(startDate).toISOString(), 
            reservationEnd: new Date(endDate).toISOString(), 
            status, 
        };

        console.log(newReservation);
        

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

                setCustomerId('');
                setRoomId('');
                setStartDate('');
                setEndDate('');
                setDescription('');
                setStatus('');
                setErrors('');
                createReservationModal();
            } else {
                setErrors('Erreur lors de la création de la réservation.');
            }
        } catch (error) {
            setErrors('Erreur lors de l\'envoi des données.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='CreateReservationModal p-8 flex flex-col gap-4'>

            <div className='flex flex-row gap-2'>
                <div>
                    <label htmlFor="customerId">Sélectionnez un client:</label>
                    <select
                        id="customerId"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        className="w-full px-3 border outline-none focus:border-blue-500 py-2 border-gray-300 rounded"
                        required
                    >
                        <option value="">Sélectionnez une chambre</option>
                        {customers && customers.length > 0 ? (
                            customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.lastName}
                                </option>
                            ))
                        ) : (
                            <option value="">Aucune client disponible</option>
                        )}
                    </select>
                    {errors.customerId && <p className="text-red-500 text-sm">{errors.customerId.message}</p>}
                </div>
                <div>
                    <label htmlFor="roomId">Sélectionnez une chambre:</label>
                    <select
                        id="roomId"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full px-3 border outline-none focus:border-blue-500 py-2 border-gray-300 rounded"
                        required
                    >
                        <option value="">Sélectionnez une chambre</option>
                        {rooms && rooms.length > 0 ? (
                            rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.roomNumber}
                                </option>
                            ))
                        ) : (
                            <option value="">Aucune chambre disponible</option>
                        )}
                    </select>
                    {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId.message}</p>}
                </div>
            </div>
            <div className='flex flex-row gap-2'>
                <div>
                    <label htmlFor="startDate">Date de début:</label>
                    <input
                        id="startDate"
                        type="datetime-local" // Utilisation de datetime-local pour LocalDateTime
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded outline-none"
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
                        className="px-3 py-2 border border-gray-300 rounded outline-none"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded outline-none"
                    required
                />
            </div>
            <div>
                <label htmlFor="status">Statut:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border outline-none focus:border-blue-500 px-3 py-2  border-gray-300 rounded"
                    required
                >
                    <option value="">Sélectionnez un statut</option>
                    {statuses && statuses.length > 0 ? (
                        statuses.map(status => (
                            <option key={status} value={status}>
                                {convertStatusToReservation(status.toLowerCase())}
                            </option>
                        ))
                    ) : (
                        <option value="">Aucun statut disponible</option>
                    )}
                </select>
            </div>
            {errors && <p className="text-red-500">{errors}</p>}
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
