import React, { useState, useEffect } from 'react';
import PaymentList from '../../pages/payments/PaymentList';

const CreatePayment = () => {
    const [reservationId, setReservationId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [methods, setMethods] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = (path) => `http://localhost:8080${path}`;

    useEffect(() => {
        fetchPaymentMethods();
        fetchPaymentStatuses();
        fetchPayments();
    }, []);

    const fetchPaymentMethods = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(apiUrl('/payments/method'));
            if (response.ok) {
                const data = await response.json();
                setMethods(data);
            } else {
                console.error('Failed to fetch payment methods');
            }
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPaymentStatuses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(apiUrl('/payments/status'));
            if (response.ok) {
                const data = await response.json();
                setStatuses(data);
            } else {
                console.error('Failed to fetch payment statuses');
            }
        } catch (error) {
            console.error('Error fetching payment statuses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(apiUrl('/payments'));
            if (response.ok) {
                const data = await response.json();
                setPayments(data);
            } else {
                console.error('Failed to fetch payments');
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const paymentData = {
            reservationId: parseInt(reservationId),
            paymentDate,
            amount: parseFloat(amount),
            paymentMethod,
            status,
            description,
        };

        try {
            const response = await fetch(apiUrl('/payments'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                console.log('Payment saved successfully');
                fetchPayments(); // Refresh payments list after save
            } else {
                console.error('Failed to save payment');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(apiUrl(`/payments/delete/${id}`), { method: 'DELETE' });
            if (response.ok) {
                setPayments(payments.filter((payment) => payment.id !== id));
                console.log('Payment deleted successfully');
            } else {
                console.error('Failed to delete payment');
            }
        } catch (error) {
            console.error('Failed to delete payment:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-xl font-semibold mb-4">Payment Form</h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700">Reservation ID:</label>
                    <input
                        type="number"
                        value={reservationId}
                        onChange={(e) => setReservationId(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
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
                <div className="mb-4">
                    <label className="block text-gray-700">Payment Method:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="">Select a method</option>
                        {methods.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="">Select a status</option>
                        {statuses.map((stat) => (
                            <option key={stat} value={stat}>
                                {stat}
                            </option>
                        ))}
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
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Submit Payment
                </button>
            </form>

            {/* Ajoutez ici le composant PaymentList */}
            <PaymentList payments={payments} onDelete={handleDelete} />
        </div>
    );
};

export default CreatePayment;
