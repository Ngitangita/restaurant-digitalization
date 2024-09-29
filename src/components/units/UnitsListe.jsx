import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiUrl, fetchJson } from '../../services/api';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";

const schema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    unit: z.enum(['kg', 'g', 'l', 'ml'], { message: "L'unité est requise" }),
});

function UnitsListe() {
    const [units, setUnits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [unitToDelete, setUnitToDelete] = useState(null);
    const {
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const fetchUnits = async () => {
        try {
            const data = await fetchJson(apiUrl("/units"));
            setUnits(data.items);
        } catch (error) {
            console.error('Erreur lors de la récupération des unités:', error);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const confirmDelete = (id) => {
        setUnitToDelete(id);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetchJson(apiUrl(`/units/${unitToDelete}`), 'DELETE');
            setShowModal(false);
            setUnitToDelete(null);
            fetchUnits();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'unité:', error);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setUnitToDelete(null);
    };

    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Abréviation</th>
                        <th className='py-2 px-4'>Action</th>
                    </tr>
                </thead>
                <tbody>
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
                                    <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
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
                    {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
                </tbody>
            </table>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette unité ?</p>
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
        </div>
    );
}

export default UnitsListe;
