import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete, MdClear, MdEdit } from 'react-icons/md';
import EditTable from './EditTable';
import dayjs from "dayjs";
import {convertStatusToTable} from "../../services/convertStatus.js";
import useToast from "../gestionDesMenus/menuOrder/(tantely)/hooks/useToast.jsx";

function TablesList() {
    const [tables, setTables] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const [tableCapacity, setTableCapacity] = useState('');
    const [tableStatus, setTableStatus] = useState('');
    const [tableStatuses, setTableStatuses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditTableModal, setShowEditTableModal] = useState(false);
    const [tableToEdit, setTableToEdit] = useState(null);
    const {showSuccess, showError} = useToast()


    const fetchTables = async () => {
        try {
            const data = await fetchJson(apiUrl("/tables/all"));
            setTables(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des tables:', error);
            showError("Erreur lors de la récupération des tables.");
        }
    };

    const fetchTableStatuses = async () => {
        try {
            const data = await fetchJson(apiUrl("/tables/status"));
            setTableStatuses(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des statuts de table:', error);
            showError("Erreur lors de la récupération des statuts de table.");
        }
    };

    useEffect(() => {
        void fetchTables();
        void fetchTableStatuses();
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
            showSuccess("Table créée avec succès.");
            resetForm();
            void fetchTables();
        } catch (error) {
            console.error('Erreur lors de la création de la table:', error)
            showError("Erreur lors de la création de la table.");
        }
    };

    const resetForm = () => {
        setTableNumber('');
        setTableCapacity('');
        setTableStatus('');
    };
    
    const handleDelete = async () => {
        try {
            await fetch(apiUrl(`/tables/${tableToDelete.id}`), {
                method: 'DELETE',
            });
            setShowDeleteModal(false);
            void fetchTables();
            showSuccess("Table supprimée avec succès.");
        } catch (error) {
            console.error('Erreur lors de la suppression de la table:', error);
            showError("Erreur lors de la suppression de la table.");
        }
    };

    const confirmDelete = (tableId) => {
        const table = tables.find(t => t.id === tableId);
        setTableToDelete(table);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setTableToDelete(null);
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
            void fetchTables();
            showSuccess("Statut de la table mis à jour avec succès.");
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la table:', error);
            showError("Erreur lors de la mise à jour du statut de la table.");

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

    const handleEditTable = (table) => {
        setTableToEdit(table || {});
        setShowEditTableModal(true);
    };

    const handleUpdateTable = async () => {
        console.log('Mise à jour du table:', tableToEdit);
        if (!tableToEdit || !tableToEdit.number || !tableToEdit.capacity) {
            console.error('Les informations du table sont incomplètes.');
            showError("Les informations du table sont incomplètes.");
            return;
        }

        try {
            const url = apiUrl('/tables');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tableToEdit),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour du table: ${response.statusText}`);
            }

            setShowEditTableModal(false);
            void fetchTables();
            showSuccess("Table mise à jour avec succès.");
        } catch (error) {
            console.error('Erreur lors de la mise à jour du table:', error);
            showError("Erreur lors de la mise à jour du table.");
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white TableListe">
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
                    className="bg-blue-500 text-white rounded hover:bg-blue-600 px-4 py-2 mb-4"
                    onClick={() => setShowCreateModal(true)}
                >
                    Créer Table
                </button>
            </div>

            <table className="min-w-full shadow-md rounded-lg overflow-hidden bg-white TableTbl">
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
                            <td colSpan="7" className="py-4 text-gray-500">
                                Aucune table disponible
                            </td>
                        </tr>
                    ) : (
                        filteredTables.toSorted((a, b) => a.id - b.id).map((table) => (
                            <tr key={table.id} className="hover:bg-gray-100 text-center border-y">
                                <td className="py-2 px-4">{table.number}</td>
                                <td className="py-2 px-4">{table.capacity}</td>
                                <td className={`py-2 px-4 cursor-pointer ${table.status.toLowerCase() !== "available" ? 'text-red-500 font-bold' : ''}`}>
                                    <button
                                        onClick={() => handleEditStatus(table)}
                                        className='w-full flex flex-col gap-1 items-center '
                                    >
                                        <span className='flex flex-row gap-1 items-center '>
                                            <MdEdit/> {table.status.toLowerCase() !== "available" && (
                                            <span className="text-red-500 text-[10px]">⚠️ </span>
                                        )}
                                        {convertStatusToTable(table.status)}
                                        </span>
                                        
                                    </button>
                                </td>
                                <td className="py-2 px-4 flex flex-row gap-4 justify-center">
                                    <button
                                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                        onClick={() => handleEditTable(table)}
                                    >
                                        <FaRegEdit/>
                                    </button>
                                    <button
                                        className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                        onClick={() => confirmDelete(table.id)}
                                    >
                                        <MdDelete/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center DeleteModal">
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer la table n°{tableToDelete?.number} ?</p>
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

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white  rounded-lg shadow-lg w-[400px] text-center EditModal">
                        <div className='flex flex-row justify-between items-center'>
                            <h2 className="text-xl pl-8 pt-8 pb-4">Créer une Table</h2>
                            <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                                onClick={() => setShowCreateModal(false)}>
                                x
                            </span>
                        </div>
                        <div className='p-6'>
                            <input
                                type="number"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="Numéro de la table"
                                className="border outline-none focus:border-blue-500 border-gray-300 p-2 mb-4 w-full"
                            />
                            <input
                                type="number"
                                value={tableCapacity}
                                onChange={(e) => setTableCapacity(e.target.value)}
                                placeholder="Capacité de la table"
                                className="border outline-none focus:border-blue-500 border-gray-300 p-2 mb-4 w-full"
                            />
                            <select
                                value={tableStatus}
                                onChange={(e) => setTableStatus(e.target.value)}
                                className="border outline-none focus:border-blue-500 border-gray-300 p-2 mb-4 w-full"
                            >
                                <option value="" disabled>Sélectionner le statut</option>
                                {tableStatuses.map((status) => (
                                    <option key={status} value={status}>{convertStatusToTable(status)}</option>
                                ))}
                            </select>
                            <div className="flex justify-between">

                                <button
                                    className="bg-red-300 text-gray-800 py-2 px-4 rounded-md hover:bg-re-400"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Annuler
                                </button>

                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={handleCreateTable}
                                >
                                    Créer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-[400px] text-center EditModal">
                        <div className='flex flex-row justify-between items-center'>
                            <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
                            <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                                onClick={() => setShowEditModal(false)}>
                                x
                            </span>
                        </div>
                        <div className='p-6'>
                            <select
                                value={tableStatus}
                                onChange={(e) => setTableStatus(e.target.value)}
                                className="border outline-none focus:border-blue-500 border-gray-300 p-2 mb-4 w-full"
                            >
                                {tableStatuses.map((status) => (
                                    <option key={status} value={status}>{convertStatusToTable(status)}</option>
                                ))}
                            </select>
                            <div className="flex justify-between">

                                <button
                                    className="bg-red-300 text-gray-800 px-4 py-2 rounded hover:bg-red-400"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={handleUpdateStatus}
                                >
                                    Mettre à jour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditTableModal && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="relative top-6 bg-white rounded-lg shadow-lg w-full max-w-md EditModal">
                        <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[408px] text-[30px] hover:text-white cursor-pointer'
                            onClick={() => setShowEditTableModal(false)}>
                            x</span>
                        <EditTable
                            tableToEdit={tableToEdit}
                            setTableToEdit={setTableToEdit}
                            onSave={handleUpdateTable}
                            onCancel={() => setShowEditTableModal(false)}
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

export default TablesList;
