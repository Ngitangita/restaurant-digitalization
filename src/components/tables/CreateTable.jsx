// CreateTable.jsx
import React, { useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';

const CreateTable = ({ fetchTables, setShowCreateModal }) => {
    const [tableNumber, setTableNumber] = useState('');
    const [tableCapacity, setTableCapacity] = useState('');
    const [tableStatus, setTableStatus] = useState('');
    const [tableStatuses, setTableStatuses] = useState([]);

    const fetchTableStatuses = async () => {
        try {
            const data = await fetchJson(apiUrl("/tables/status"));
            setTableStatuses(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des statuts de table:', error);
        }
    };

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

    // Fetch table statuses on mount
    React.useEffect(() => {
        fetchTableStatuses();
    }, []);

    return (
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
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleCreateTable}
                    >
                        Créer
                    </button>
                    <button
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => {
                            setShowCreateModal(false);
                            resetForm();
                        }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTable;
