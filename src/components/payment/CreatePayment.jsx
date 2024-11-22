import React, { useState, useEffect } from 'react';
import PaymentList from '../../pages/payments/PaymentList';
import useToast from '../gestionDesMenus/menuOrder/(tantely)/hooks/useToast';
import { convertStatusToPayment } from '../../services/convertStatus';
import { apiUrl } from '../../services/api';
import { truncate } from '../../services/truncate';

const CreatePayment = ({onCreate, annulerModal }) => {
    const [reservationId, setReservationId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const { showSuccess, showError } = useToast()
    const [reservations, setReservations] = useState([])
    const [methods, setMethods] = useState([])
    const [statuses, setStatuses] = useState([])


    const fetchData = async () => {
        setIsLoading(true);
        try {
          const [reservationsResponse, paymentMethodResponse, statusPaymentResponse] = await Promise.all([
            fetch(apiUrl(`/reservations`)),
            fetch(apiUrl(`/payments/method`)),
            fetch(apiUrl(`/payments/status`))
          ]);
    
          if (!reservationsResponse.ok || !paymentMethodResponse.ok || !statusPaymentResponse.ok) {
            throw new Error('Erreur lors de la récupération des reservations, methodes, status');
          }
    
          const reservationsData = await reservationsResponse.json();
          const paymentMethodData = await paymentMethodResponse.json();
          const paymentStatusData = await statusPaymentResponse.json();
    
          setReservations(reservationsData);
          setStatuses(paymentStatusData)
          setMethods(paymentMethodData)
        } catch (err) {
          showError("Erreur lors de la récupération des données.");
        } finally {
          setIsLoading(false);
        }
      };
    
      useEffect(() => {
        void fetchData();
      }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!reservationId || !amount || !paymentMethod || !status) {
            setErrorMessage('Tous les champs doivent être remplis.');
            showError('Tous les champs doivent être remplis.');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            setErrorMessage('Le prix doit être un nombre positif.');
            showError('Le prix doit être un nombre positif.');
            return;
        }

        const nouveauPayment = {
            paymentMethod,
            description,
            paymentDate: new Date(paymentDate).toISOString(),
            amount: parseFloat(amount),
            reservationId: parseInt(reservationId, 10),
            status
        };
        

        try {
            const response = await fetch(apiUrl('/payments'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nouveauPayment),
            });
            const createdPayment = await response.json();
            
            if (response.ok) {
                await onCreate(createdPayment);

                showSuccess('Payment créé avec succès!');
                setPaymentMethod('');
                setDescription('');
                setAmount('');
                setReservationId('');
                setStatus('');
                setErrorMessage('');
            } else {
                setErrorMessage('Erreur lors de la création du payment.');
                showError('Erreur lors de la création du payment.');
            }
        } catch (e){
            console.log(e);
            setErrorMessage('Erreur lors de l\'envoi des données.');
            showError('Erreur lors de l\'envoi des données.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-xl font-semibold mb-4">Payment Form</h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <div>
                <label htmlFor="reservationId">Reservation:</label>
                <select
                    id="reservationId"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                    className="w-full px-3 border outline-none focus:border-blue-500 py-2 border-gray-300 rounded"
                    required
                >
                    <option value="">Sélectionnez une Reservation</option>
                    {reservations && reservations.length > 0 ? (
                        reservations.map(reservation => (
                            <option key={reservation.id} value={reservation.id}>
                                {reservation.id} {reservation.customer.lastName}
                            </option>
                        ))
                    ) : (
                        <option value="">Aucune reservation disponible</option>
                    )}
                </select>
            </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Payment Date:</label>
                    <input
                        type="datetime-local"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="paymentMethod">Payment method:</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full border outline-none focus:border-blue-500 px-3 py-2  border-gray-300 rounded"
                        required
                    >
                        <option value="">Sélectionnez payment method</option>
                        {methods && methods.length > 0 ? (
                            methods.map(method => (
                                <option key={method} value={method}>
                                    {method.toLowerCase()}
                                </option>
                            ))
                        ) : (
                            <option value="">Aucun method disponible</option>
                        )}
                    </select>
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
                                    {convertStatusToPayment(status.toLowerCase())}
                                </option>
                            ))
                        ) : (
                            <option value="">Aucun statut disponible</option>
                        )}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        rows="3"
                    />
                </div>
                <div className="flex flex-row gap-52 relative top-4">
                    <button type="button" onClick={annulerModal}
                        className="ml-2 bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400">
                        Annuler
                    </button>
                    <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
                        Submit Payment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePayment;
