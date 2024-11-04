import React from 'react';

const PaymentList = ({ payments, onDelete }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Payments List</h2>
            <ul>
                {payments.map((payment) => (
                    <li key={payment.id} className="mb-4 p-4 border rounded">
                        <p><strong>Reservation ID:</strong> {payment.reservationId}</p>
                        <p><strong>Amount:</strong> ${payment.amount}</p>
                        <p><strong>Status:</strong> {payment.status}</p>
                        <p><strong>Method:</strong> {payment.paymentMethod}</p>
                        <p><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</p>
                        <button
                            onClick={() => onDelete(payment.id)}
                            className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaymentList;
