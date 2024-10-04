import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete, MdClear } from 'react-icons/md';

function TablesListe() {
    const [tables, setTables] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const [tableCapacity, setTableCapacity] = useState('');
    const [tableStatus, setTableStatus] = useState('');
    const [tableStatuses, setTableStatuses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTables = async () => {
        try {
            const data = await fetchJson(apiUrl("/tables/all"));
            setTables(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des tables:', error);
        }
    };

    const fetchTableStatuses = async () => {
        try {
            const data = await fetchJson(apiUrl("/tables/status"));
            setTableStatuses(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des statuts de table:', error);
        }
    };

    useEffect(() => {
        fetchTables();
        fetchTableStatuses();
    }, []);

    const handleCreateTable = async () => {
        try {
            const tableData = {
                number: tableNumber,
                capacity: tableCapacity,
                status: tableStatus
            };

            await fetchJson(apiUrl(`/tables`), 'POST', tableData);
            setShowCreateModal(false);
            resetForm();
            fetchTables();
        } catch (error) {
            console.error('Erreur lors de la création de la table:', error);
        }
    };

    const resetForm = () => {
        setTableNumber('');
        setTableCapacity('');
        setTableStatus('');
    };

    const confirmDelete = (id) => {
        setSelectedTable(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetchJson(apiUrl(`/tables/${selectedTable}`), 'DELETE');
            setShowDeleteModal(false);
            setSelectedTable(null);
            fetchTables();
        } catch (error) {
            console.error('Erreur lors de la suppression de la table:', error);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedTable(null);
    };

    const handleEditStatus = (table) => {
        setSelectedTableId(table.id);
        setTableStatus(table.status);
        setShowEditModal(true);
    };

    const handleUpdateStatus = async () => {
        try {
            const updateData = {
                id: selectedTableId,
                status: tableStatus
            };

            await fetchJson(apiUrl(`/tables/status`), 'PUT', updateData);
            setShowEditModal(false);
            setSelectedTableId(null);
            fetchTables();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la table:', error);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

   
    const filteredTables = tables.filter((table) =>
        table.number.toString().includes(searchTerm) ||
        table.capacity.toString().includes(searchTerm) || 
        table.status.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Tables</h1>
            <div className='flex flex-row gap-4'>
                <div className="w-64 relative flex items-center mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher une table"
                        className="p-2 pr-8 border border-gray-300 rounded-md outline-none"
                    />
                    {searchTerm && (
                        <button className="relative right-5" onClick={handleClearSearch}>
                            <MdClear />
                        </button>
                    )}
                </div>

                <button
                    className="bg-green-500 text-white rounded px-4 py-2 mb-4"
                    onClick={() => setShowCreateModal(true)}
                >
                    Créer Table
                </button>
            </div>

            <table className="min-w-full shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Numéro</th>
                        <th className="py-2 px-4">Capacité</th>
                        <th className="py-2 px-4">Statut</th>
                        <th className="py-2 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTables.length === 0 ? (
                        <tr className="text-center">
                            <td colSpan="4" className="py-4 text-gray-500">
                                Aucune table disponible
                            </td>
                        </tr>
                    ) : (
                        filteredTables.map((table) => (
                            <tr key={table.id} className="hover:bg-gray-100 text-center">
                                <td className="py-2 px-4">{table.number}</td>
                                <td className="py-2 px-4">{table.capacity}</td>
                                <td className="py-2 px-4">{table.status}</td>
                                <td className="py-2 px-4 flex flex-row gap-4 justify-center">
                                    <button
                                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                        onClick={() => handleEditStatus(table)}
                                    >
                                        <FaRegEdit />
                                    </button>
                                    <button
                                        className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                        onClick={() => confirmDelete(table.id)}
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
                        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette table ?</p>
                        <div className="flex justify-around">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={handleDelete}
                            >
                                Supprimer
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={cancelDelete}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Créer une Table</h2>
                        <input
                            type="number"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Numéro de la table"
                            className="border border-gray-300 p-2 mb-4 w-full"
                        />
                        <input
                            type="number"
                            value={tableCapacity}
                            onChange={(e) => setTableCapacity(e.target.value)}
                            placeholder="Capacité de la table"
                            className="border border-gray-300 p-2 mb-4 w-full"
                        />
                        <select
                            value={tableStatus}
                            onChange={(e) => setTableStatus(e.target.value)}
                            className="border border-gray-300 p-2 mb-4 w-full"
                        >
                            <option value="" disabled>Sélectionner le statut</option>
                            {tableStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <div className="flex justify-around">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={handleCreateTable}
                            >
                                Créer
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Modifier le statut</h2>
                        <select
                            value={tableStatus}
                            onChange={(e) => setTableStatus(e.target.value)}
                            className="border border-gray-300 p-2 mb-4 w-full"
                        >
                            {tableStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <div className="flex justify-around">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleUpdateStatus}
                            >
                                Mettre à jour
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowEditModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TablesListe;
