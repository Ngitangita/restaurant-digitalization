import React, { useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { apiUrl, fetchJson } from '../../services/api';

function UnitsListe() {
    const [units, setUnits] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [unitName, setUnitName] = useState('');
    const [unitAbbreviation, setUnitAbbreviation] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const fetchUnits = async () => {
        try {
            const data = await fetchJson(apiUrl("/units/all"));
            setUnits(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des unités:', error);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const confirmDelete = (id) => {
        setSelectedUnit(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetchJson(apiUrl(`/units/${selectedUnit}`), 'DELETE');
            setShowDeleteModal(false);
            setSelectedUnit(null);
            fetchUnits();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'unité:', error);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedUnit(null);
    };

    const handleEdit = (unit) => {
        setSelectedUnit(unit.id);
        setUnitName(unit.name);
        setUnitAbbreviation(unit.abbreviation);
        setShowEditModal(true);
    };

    const handleUpdateUnit = async () => {
        try {
            console.log('Mise à jour de l\'unité:', selectedUnit, { name: unitName, abbreviation: unitAbbreviation }); // Debug
            await fetchJson(apiUrl(`/units`), 'PUT', {
                id: selectedUnit,
                name: unitName,
                abbreviation: unitAbbreviation
            });
            setShowEditModal(false);
            setSelectedUnit(null);
            fetchUnits();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'unité:', error); 
        }
    };
    

    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Abréviation</th>
                        <th className="py-2 px-4">Action</th>
                    </tr>
                </thead>
                <tbody className='ModalListeUnit'>
                    {units.length === 0 ? (
                        <tr className="text-center">
                            <td colSpan="3" className="py-4 text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                                    <p>Aucune unité disponible</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        units.map((unit) => (
                            <tr key={unit.id} className="hover:bg-gray-100 text-center">
                                <td className="py-2 px-4">{unit.name}</td>
                                <td className="py-2 px-4">{unit.abbreviation}</td>
                                <td className="py-2 px-4 w-[120px] flex flex-row gap-2 justify-end">
                                    <button
                                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                        onClick={() => handleEdit(unit)}
                                    >
                                        <FaRegEdit />
                                    </button>
                                    <button
                                        className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                        onClick={() => confirmDelete(unit.id)}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette unité ?</p>
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

            {/* Modal d'édition d'unité */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="EditModal bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Modifier l'unité</h2>
                        <input
                            type="text"
                            value={unitName}
                            onChange={(e) => setUnitName(e.target.value)}
                            placeholder="Nom de l'unité"
                            className="border border-gray-300 p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            value={unitAbbreviation}
                            onChange={(e) => setUnitAbbreviation(e.target.value)}
                            placeholder="Abréviation de l'unité"
                            className="border border-gray-300 p-2 mb-4 w-full"
                        />
                        <div className="flex justify-around">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleUpdateUnit}
                            >
                                Enregistrer
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

export default UnitsListe;
