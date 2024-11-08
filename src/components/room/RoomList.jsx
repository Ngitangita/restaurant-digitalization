import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../services/api';
import { MdClear, MdDelete, MdEdit } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import CreateRoom from './CreateRoom';
import UpdateStatus from '../updateStatus/UpdateStatus';
import EditRoom from './EditRoom';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [floors, setFloors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'create', 'editStatus', 'editRoom', 'delete'
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const [roomsResponse, statusesResponse, floorsResponse] = await Promise.all([
                fetch(apiUrl('/rooms')),
                fetch(apiUrl('/rooms/status')),
                fetch(apiUrl('/floors')),
            ]);

            if (!roomsResponse.ok || !statusesResponse.ok || !floorsResponse.ok) {
                throw new Error('Erreur lors de la récupération des données.');
            }

            setRooms(await roomsResponse.json());
            setStatuses(await statusesResponse.json());
            setFloors(await floorsResponse.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const toggleModal = (type, room = null) => {
        setModalType(type);
        setSelectedRoom(room);
        setIsModalOpen(!isModalOpen);
    };

    const handleCreateRoom = (newRoom) => {
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        toggleModal('');
    };

    const handleUpdateStatus = async () => {
        try {
            const url = apiUrl(`/rooms/${selectedRoom.id}/status`);
            await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(status),
            });
            toggleModal('');
            fetchRooms();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la salle:', error);
        }
    };

    const handleUpdateRoom = async () => {
        try {
            const url = apiUrl(`/rooms/${selectedRoom.id}`);
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedRoom),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText);
            }
            toggleModal('');
            fetchRooms();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la chambre:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(apiUrl(`/rooms/${selectedRoom.id}`), { method: 'DELETE' });
            toggleModal('');
            fetchRooms();
        } catch (error) {
            console.error('Erreur lors de la suppression du room:', error);
        }
    };

    // Filtrer les salles en fonction du terme de recherche
    const filteredRooms = rooms.filter((room) =>
        room.roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 bg-white">
            <h2 className="text-2xl font-bold mb-4">Liste des Salles</h2>
            <div className="flex flex-row gap-4 mb-4">
                <div className="relative flex items-center w-64">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher une salle"
                        className="p-2 pr-8 border border-gray-300 rounded-md outline-none"
                    />
                    {searchTerm && (
                        <button className="absolute right-2" onClick={() => setSearchTerm('')}>
                            <MdClear />
                        </button>
                    )}
                </div>
                <button
                    className="bg-blue-500 text-white rounded hover:bg-blue-600 px-4 py-2"
                    onClick={() => toggleModal('create')}
                >
                    Créer Salle
                </button>
            </div>

            {isLoading ? (
                <p className="text-center text-gray-500">Chargement...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Numéro de Salle</th>
                            <th className="py-2 px-4">Capacité</th>
                            <th className="py-2 px-4">Prix (Ar)</th>
                            <th className="py-2 px-4">Statut</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-100 text-center border-y border-collapse">
                                    <td className="py-2 px-4">{room.roomNumber}</td>
                                    <td className="py-2 px-4">{room.capacity} personnes</td>
                                    <td className="py-2 px-4">{room.price} Ar</td>
                                    <td className={`py-2 px-4 cursor-pointer ${room.status.toLowerCase() !== "available" ? 'text-red-500 font-bold' : ''}`}>
                                        <button
                                            onClick={() => toggleModal('editStatus', room)}
                                            className='w-full flex flex-col gap-1 items-center'
                                        >
                                            <span className='flex flex-row gap-1 items-center '>
                                                <MdEdit /> {room.status.toLowerCase()}
                                            </span>
                                            {room.status.toLowerCase() !== "available" && (
                                                <div className="text-red-500 text-[10px]">⚠️ désolé cette chambre est {room.status}</div>
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                            onClick={() => toggleModal('editRoom', room)}
                                        >
                                            <FaRegEdit />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                                            onClick={() => toggleModal('delete', room)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center">Aucune salle trouvée</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {isModalOpen && modalType === 'create' && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg EditModal">
                        <div className='flex flex-row justify-between items-center'>
                            <h2 className="text-xl pl-8 pt-8 pb-4">Ajouter le numéro du chambre</h2>
                            <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                                onClick={() => toggleModal('')}>
                                x
                            </span>
                        </div>
                        <CreateRoom
                            onCreate={handleCreateRoom}
                            closeModal={() => toggleModal('')}
                            statuses={statuses}
                            floors={floors}
                        />
                    </div>
                </div>
            )}
            {isModalOpen && modalType === 'editStatus' && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm EditModal">
                        <div className='flex flex-row justify-between items-center'>
                            <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statue</h2>
                            <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                                onClick={() => toggleModal('')}>
                                x
                            </span>
                        </div>
                        <UpdateStatus
                            onSave={handleUpdateStatus}
                            onCancel={() => toggleModal('')}
                            statuses={statuses}
                            setStatus={setStatus}
                            status={status}
                        />
                    </div>
                </div>
            )}
            {isModalOpen && modalType === 'editRoom' && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md EditModal">
                        <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[408px] text-[30px] hover:text-white cursor-pointer'
                            onClick={() => toggleModal('')}>
                            x</span>
                        <EditRoom
                            roomToEdit={selectedRoom}
                            setRoomToEdit={setSelectedRoom}
                            onSave={handleUpdateRoom}
                            onCancel={() => toggleModal('')}
                            floors={floors}
                        />
                    </div>
                </div>
            )}
            {isModalOpen && modalType === 'delete' && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm EditModal">
                        <h3 className="text-lg font-bold mb-4">Confirmation de suppression</h3>
                        <p>Êtes-vous sûr de vouloir supprimer cette salle ?</p>
                        <div className="mt-4 flex justify-end">
                            <button className="bg-red-500 text-white rounded px-4 py-2" onClick={handleDelete}>
                                Supprimer
                            </button>
                            <button className="bg-gray-300 text-gray-700 rounded px-4 py-2 ml-2" onClick={() => toggleModal('')}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomList;
