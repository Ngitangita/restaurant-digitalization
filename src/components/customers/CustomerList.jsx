import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { apiUrl, fetchJson } from "../../services/api";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [page] = useState(1);
  const [size] = useState(8);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const url = `${apiUrl("/customers")}?size=${size}&page=${page - 1}`;
    fetchJson(url)
      .then((d) => {
        setCustomers(d.items || []);
      })
      .catch((e) => console.log(e));
  }, [size, page]);

  const confirmDelete = (id) => {
    setSelectedCustomer(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetchJson(apiUrl(`/customers/${selectedCustomer}`), "DELETE");
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      // fetchCustomers();
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer.id);
    setCustomerData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      address: customer.address,
    });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async () => {
    try {
      await fetchJson(
        apiUrl(`/customers/${selectedCustomer}`),
        "PUT",
        customerData
      );
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Prénom</th>
            <th className="py-2 px-4">Téléphone</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="ModalListeCustomer">
          {customers.length === 0 ? (
            <tr className="text-center">
              <td colSpan="6" className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucun client disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-100 text-center">
                <td className="py-2 px-4">{customer.name}</td>
                <td className="py-2 px-4">{customer.phoneNumber}</td>
                <td className="py-2 px-4 w-[300px] flex flex-row gap-2 justify-end">
                  <button
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    onClick={() => handleEdit(customer)}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                    onClick={() => confirmDelete(customer.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer ce client ?
            </p>
            <div className="flex justify-around">
              <button
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Annuler
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="EditModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <h2 className="text-lg font-semibold mb-4">Modifier le client</h2>
            {Object.keys(customerData).map((key) => (
              <input
                key={key}
                name={key}
                type={key === "email" ? "email" : "text"}
                value={customerData[key]}
                onChange={handleChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="border border-gray-300 p-2 mb-4 w-full"
              />
            ))}
            <div className="flex justify-around">
              <button
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleUpdateCustomer}
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    
    </div>
  );
}

export default CustomerList;
