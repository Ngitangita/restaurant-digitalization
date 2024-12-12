import React, { useState } from 'react';
import { apiUrl } from '../../services/api';
import useToast from '../gestionDesMenus/menuOrder/(tantely)/hooks/useToast';
import { convertStatusToReservation } from '../../services/convertStatus';

function CreateReservation({ onCreate, createReservationModal, rooms, customers, statuses }) {
    const [formData, setFormData] = useState({
        reservationStart: '',
        reservationEnd: '',
        customerId: '',
        roomId: '',
        status: '',
        description: '',
    });
    const { showSuccess, showError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(apiUrl('/reservations'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                setErrors('Erreur lors de la création de la réservation.');
            }

            const newReservation = await response.json();
            showSuccess('Réservation créée avec succès.');
            onCreate(newReservation);
        } catch (err) {
            showError(err.message || 'Erreur lors de la création de la réservation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className='flex flex-row gap-2'>
                <div className="mb-4">
                    <label htmlFor="reservationStart" className="block mb-2 font-bold">Date de début</label>
                    <input
                        type="datetime-local"
                        id="reservationStart"
                        name="reservationStart"
                        value={formData.reservationStart}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="reservationEnd" className="block mb-2 font-bold">Date de fin</label>
                    <input
                        type="datetime-local"
                        id="reservationEnd"
                        name="reservationEnd"
                        value={formData.reservationEnd}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
            </div>
            <div className='flex flex-row gap-2'>
                <div className="mb-4">
                    <label htmlFor="customerId" className="block mb-2 font-bold">Client</label>
                    <select
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">-- Sélectionnez un client --</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.lastName} {customer.firstName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="roomId" className="block mb-2 font-bold">Chambre</label>
                    <select
                        id="roomId"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">-- Sélectionnez une chambre --</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                Chambre {room.roomNumber}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
           
            <div className="mb-4">
                <label htmlFor="status" className="block mb-2 font-bold">Statut</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">-- Sélectionnez un statut --</option>
                    {statuses && statuses.length > 0 ? (statuses.map((status) => (
                        <option key={status} value={status}>
                            {convertStatusToReservation(status.toLowerCase())}
                        </option>
                    ))):(
                        <option value="">Aucun statut disponible</option>
                    )}
                </select>
            </div>
            {errors && <p className="text-red-500">{errors}</p>}
            <div className="mb-4">
                <label htmlFor="description" className="block mb-2 font-bold">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 mr-2"
                    onClick={createReservationModal}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Création...' : 'Créer'}
                </button>
            </div>
        </form>
    );
}

export default CreateReservation;
