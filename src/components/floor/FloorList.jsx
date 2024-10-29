import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import { MdDelete, MdClear } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateFloor from './CreateFloor';
import EditFloor from './EditFloor';

const FloorsList = () => {
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [showEditFloorModal, setShowEditFloorModal] = useState(false)
  const [floorToEdit, setFloorToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [floorToDelete, setFloorToDelete] = useState(null);

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      const data = await fetchJson(apiUrl("/floors"));
      setFloors(data);
    } catch (err) {
      const errorMsg = err.message || 'Erreur lors de la récupération des étages';
      setError(errorMsg);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditingFloor(null);
  };

  const handleFloorCreated = () => {
    fetchFloors();
    setIsModalOpen(false);
  };


  const handleEditFloor = (floor) => {
    setFloorToEdit(floor || {});
    setShowEditFloorModal(true);
  };

  const handleUpdateFloor = async () => {
    console.log('Mise à jour de l\'étage:', floorToEdit);
    if (!floorToEdit || !floorToEdit.floorNumber || !floorToEdit.description) {
      console.error('Les informations du menu sont incomplètes.');
      return;
    }

    try {
      const url = apiUrl(`/floors/${id}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(floorToEdit),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour de l'\étage: ${response.statusText}`);
      }

      setShowEditFloorModal(false);
      fetchFloors();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étage:', error);
    }
  };

  const handleDelete = async () => {
    try {
        await fetch(apiUrl(`/floors/${floorToDelete.id}`), {
            method: 'DELETE',
        });
        setShowDeleteModal(false);
        fetchFloors();
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'étage:', error);
    }
};

const confirmDelete = (floorId) => {
    const floor = floors.find(f => f.id === floorId);
    setFloorToDelete(floor);
    setShowDeleteModal(true);
};

const cancelDelete = () => {
    setShowDeleteModal(false);
    setFloorToDelete(null);
};

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Liste des étages</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className='flex flex-row gap-4'>
        <button
          onClick={toggleModal}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Créer un étage
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="creatUnitModal bg-white p-6 rounded-md shadow-md z-[9999]">
            <h2 className="text-xl mb-4">
              Créer une nouvelle étage"
            </h2>
            <CreateFloor
              onCreate={handleFloorCreated}
              closeModal={() => setIsModalOpen(false)}
              floorData={editingFloor}
            />
          </div>
        </div>
      )}

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden categoriesTable">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">N° de l'étage</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {floors.length > 0 ? (
            floors.map(floor => (
              <tr key={floor.id} className="hover:bg-gray-100 text-center border-y border-collapse">
                <td className="py-2 px-4">{floor.floorNumber}</td>
                <td className="py-2 px-4">{floor.description}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    onClick={() => handleEditFloor(floor)}
                  >
                    <FaRegEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                    onClick={() => confirmDelete(floor.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-center">Aucun étage trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
      {showEditFloorModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md EditModal">
            <EditFloor
              floorToEdit={floorToEdit}
              setFloorToEdit={setFloorToEdit}
              onSave={handleUpdateFloor}
              onCancel={() => setShowEditFloorModal(false)}
            />
          </div>
        </div>
      )}
      {showDeleteModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
                        <p>Voulez-vous vraiment supprimer l'étage {floorToDelete?.floorNumber} ?</p>
                        <div className="mt-4">
                            <button
                                className="bg-red-500 text-white rounded p-2 hover:bg-red-600 mr-2"
                                onClick={handleDelete}
                            >
                                Oui
                            </button>
                            <button
                                className="bg-gray-300 text-black rounded p-2 hover:bg-gray-400"
                                onClick={cancelDelete}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  );
};

export default FloorsList;
