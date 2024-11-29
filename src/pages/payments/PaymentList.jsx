import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../services/api';
import { MdInfoOutline, MdEdit, MdDelete } from "react-icons/md";
import CreatePayment from '../../components/payment/CreatePayment';
import { convertStatusToPayment } from '../../services/convertStatus';
import useToast from '../../components/gestionDesMenus/menuOrder/(tantely)/hooks/useToast';
import UpdateStatusPayment from '../../components/updateStatus/UpdateStatusPayment';
import UpdateMethodPayment from '../../components/updateStatus/UpdateMethodPayment';

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [status, setStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditMethodModal, setShowEditMethodModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const { showSuccess, showError } = useToast()

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const [paymentsResponse, methodsResponse, reservationResponse, statusesResponse] = await Promise.all([
        fetch(apiUrl('/payments')),
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

    setPayments(prev => [...prev, payment]);
    toggleModal();
  };

  const handleEditStatus = (payment) => {
    setSelectedPaymentId(payment.id);
    
    setStatus(payment.status);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    console.log("STATUS", status);
    try {
      const url = apiUrl(`/payments/update/status/${selectedPaymentId}`);
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });

      if (res.ok) {
        setShowEditModal(false);
        setSelectedPaymentId(null);
        void fetchPayments();
        showSuccess("Statut mis à jour avec succès.");
      }

    } catch {
      showError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleEditMethod = (payment) => {
    setSelectedPaymentId(payment.id);
    setMethod(payment.paymentMethod);

    setShowEditMethodModal(true);
  };

  const handleUpdateMethod = async () => {
    try {

      console.log(method);

      const url = apiUrl(`/payments/update/method/${selectedPaymentId}`);
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(method),
      });

      if (res.ok) {
        setShowEditMethodModal(false);
        setSelectedPaymentId(null);
        void fetchPayments();
        showSuccess("Statut mis à jour avec succès.");
      }

    } catch {

      showError("Erreur lors de la mise à jour du méthod.");
    }
  };

  const confirmDelete = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    setPaymentToDelete(payment);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/payments/delete/${paymentToDelete.id}`), {
        method: 'DELETE',
      });
      setShowDeleteModal(false);
      void fetchPayments();
      showSuccess("Payment supprimée avec succès.");
    } catch (error) {
      console.error('Erreur lors de la suppression du payment:', error);
      showError("Erreur lors de la suppression du payment.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPaymentToDelete(null);
  };

  return (
    <div className="container p-6 pr-14 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Liste des payments</h1>

      <button
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
        onClick={toggleModal}
      >
        Payment
      </button>

      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">N° du chambre</th>
            <th className="py-2 px-4">Method</th>
            <th className="py-2 px-4">Montant</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Payé le</th>
            <th className="py-2 px-4">Modifié le</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr className="text-center">
              <td colSpan="6" className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucun payments disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-100 text-center border border-y">
                <td >{payment.reservationId}</td>
                <td>
                  <button
                    onClick={() => handleEditMethod(payment)}
                    className='w-full flex flex-row gap-1 items-center '>
                    <MdEdit /> {payment.paymentMethod.toLowerCase()}
                  </button>
                </td>
                <td >{payment.amount}</td>
                <td className={`cursor-pointer ${payment.status.toLowerCase() !== "completed" ? 'text-red-500 font-bold' : ''}`}>
                  <button
                    onClick={() => handleEditStatus(payment)}
                    className='w-full flex flex-row gap-1 items-center '>
                    <span className='flex text-sm flex-row gap-1 items-center '>
                      <MdEdit />  {payment.status.toLowerCase() !== "completed" && (
                        <span className="text-red-500 text-[10px]">⚠️</span>
                      )}
                      {convertStatusToPayment(payment.status.toLowerCase())}
                    </span>

                  </button>
                </td>
                <td >{payment.description}</td>
                <td>{payment.paymentDate}</td>
                <td className="p-2">{payment.updatedAt}</td>
                <td>
                  <button
                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                    onClick={() => confirmDelete(payment.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-sm EditModal">
            <div className='flex flex-row justify-between items-center'>
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
              <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                onClick={() => setShowEditModal(false)}>
                x
              </span>
            </div>
            <UpdateStatusPayment
              onSave={handleUpdateStatus}
              onCancel={() => setShowEditModal(false)}
              statuses={statuses}
              setStatus={setStatus}
              status={status}
            />
          </div>
        </div>
      )}

      {showEditMethodModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-sm EditModal">
            <div className='flex flex-row justify-between items-center'>
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier la méthod du payment</h2>
              <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                onClick={() => setShowEditMethodModal(false)}>
                x
              </span>
            </div>
            <UpdateMethodPayment
              onSave={handleUpdateMethod}
              onCancel={() => setShowEditMethodModal(false)}
              methods={methods}
              setMethod={setMethod}
              method={method}
            />

          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center DeleteModal">
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer le payment de {paymentToDelete?.reservationId} ?</p>
            <div className="flex justify-between">

              <button
                className="bg-red-300 text-gray-800 py-2 px-4 rounded-md hover:bg-red-400"
                onClick={cancelDelete}
              >
                Non
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleDelete}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentList; 