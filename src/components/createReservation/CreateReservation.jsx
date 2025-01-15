import { useState } from 'react';
import { apiUrl } from '../../services/api';
import useToast from '../gestionDesMenus/menuOrder/(tantely)/hooks/useToast';
import { convertStatusToReservation } from '../../services/convertStatus';
import { Autocomplete, TextField, Button } from '@mui/material';

function CreateReservation({ onCreate, createReservationModal, rooms, tables, customers, statuses }) {
    const [formData, setFormData] = useState({
        reservationStart: '',
        reservationEnd: '',
        customerId: '',
        roomIds: [],
        tableIds: [],
        status: '',
        description: '',
    });
    const { showSuccess, showError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAutocompleteChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value.map((item) => item.id) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(apiUrl('/reservations'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const newReservation = await response.json();

            if (!response.ok) {
                showError(newReservation?.message ?? 'Erreur lors de la création de la réservation.');
                return;
            }

            showSuccess('Réservation créée avec succès.');
            onCreate(newReservation);
        } catch (err) {
            showError(err.message || 'Erreur lors de la création de la réservation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between flex-row items-center">
                <div className="mb-4">
                    <label htmlFor="reservationStart" className="block mb-2 font-bold">Date de début</label>
                    <input
                        type="datetime-local"
                        id="reservationStart"
                        name="reservationStart"
                        value={formData.reservationStart}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="reservationEnd" className="block mb-2 font-bold">Date de fin</label>
                    <input
                        type="datetime-local"
                        id="reservationEnd"
                        name="reservationEnd"
                        value={formData.reservationEnd}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-between flex-row items-center">
                <div className="mb-4">

                    <Autocomplete
                        id="customerId"
                        options={customers}
                        getOptionLabel={(customer) => `${customer.lastName} ${customer.firstName}`}
                        value={customers.find((c) => c.id === formData.customerId) || null}
                        onChange={(event, value) => {
                            setFormData((prevData) => ({
                                ...prevData,
                                customerId: value ? value.id : '',
                            }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Client"
                                placeholder="Sélectionnez un client"
                                variant="outlined"
                                required
                            />
                        )}
                        className="w-64"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="roomIds" className="block mb-2 font-bold">Chambres</label>
                    <div>
                        <Autocomplete
                            multiple
                            id="roomIds"
                            className="block w-64"
                            options={rooms}
                            getOptionLabel={(room) => `Chambre ${room.roomNumber}`}
                            onChange={(event, value) => handleAutocompleteChange('roomIds', value)}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" placeholder="Sélectionnez les chambres" />
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between flex-row items-center">
                <div className="mb-4">
                    <label htmlFor="tableIds" className="block mb-2 font-bold">Tables</label>
                    <Autocomplete
                        multiple
                        className="w-64"
                        id="tableIds"
                        options={tables}
                        getOptionLabel={(table) => `Table ${table.number}`}
                        onChange={(event, value) => handleAutocompleteChange('tableIds', value)}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" placeholder="Sélectionnez les tables" />
                        )}
                    />
                </div>

                <div className="mb-4">
                    <Autocomplete
                        id="status"
                        options={statuses || []}
                        value={formData.status}
                        onChange={(event, newValue) => {
                            setFormData((prevData) => ({
                                ...prevData,
                                status: newValue || '',
                            }));
                        }}
                        getOptionLabel={(status) => convertStatusToReservation(status.toLowerCase())}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Statut"
                                variant="outlined"
                                placeholder="Sélectionnez un statut"
                                required
                            />
                        )}
                        className="w-64"
                        disableClearable
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block mb-2 font-bold">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                />
            </div>
            <div className="flex justify-between">
                <Button
                    type="button"
                    variant="contained"
                    color="inherit"
                    onClick={createReservationModal}
                >
                    Annuler
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Création...' : 'Créer'}
                </Button>
            </div>
        </form>
    );
}

export default CreateReservation;
