import React, { useEffect, useState } from 'react';
import { fetchJson, apiUrl } from '../../services/api';
import CreateReservation from '../../components/createReservation/CreateReservation';
import CreatePayment from '../../components/payment/CreatePayment';

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [methods, setMethods] = useState([]);
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

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const [paymentsResponse, methodsResponse, reservationResponse, statusesResponse] = await Promise.all([
        fetch(apiUrl(`/payments`)),
        fetch(apiUrl('/payments/method')),
        fetch(apiUrl('/reservations')),
        fetch(apiUrl('/payments/status'))
      ]);

      if (!paymentsResponse.ok || !methodsResponse.ok || !reservationResponse || !statusesResponse.ok) {
        throw new Error('Erreur lors de la récupération des chambres, clients ou statuts');
      }

      const paymentsData = await paymentsResponse.json();
      const reservationData = await reservationResponse.json();
      const methodsData = await methodsResponse.json();
      const statusesData = await statusesResponse.json();

      setPayments(paymentsData);
      setMethods(methodsData);
      setStatuses(statusesData);
      setReservation(reservationData)
    } catch (err) {
      setError(err.message);
      showError("Erreur lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPayments();
  }, []);

  const handleCreate = async (payment) => {
    console.log(payment);
    setPayments(prev => [...prev, payment]); // Commentée
    toggleModal(); // Commentée
  };
  

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
              <h2 className="text-xl pl-8 pt-8 pb-4">Créer une nouvelle payment</h2>
              <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                onClick={toggleModal}>
                x
              </span>
            </div>
            <CreatePayment
  onCreate={handleCreate}
  annulerModal={toggleModal}
/>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default PaymentList;
