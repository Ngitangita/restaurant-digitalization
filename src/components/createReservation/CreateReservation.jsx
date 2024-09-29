import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiUrl, fetchJson } from '../../services/api';
import { useNavigate } from 'react-router-dom'; // Import pour la navigation

const schema = z.object({
  customer_id: z.number().min(1, "Le client est requis"),
  room_id: z.union([z.number().nullable(), z.undefined()]),
  table_id: z.union([z.number().nullable(), z.undefined()]),
  reservation_start: z.string().min(1, "La date de début est requise"),
  reservation_end: z.string().min(1, "La date de fin est requise"),
  status: z.string().min(1, "Le statut est requis"),
  description: z.string().optional(),
}).refine(data => data.room_id || data.table_id, {
  message: "Vous devez réserver soit une chambre, soit une table, mais pas les deux.",
});

function CreateReservation() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate(); // Hook pour la navigation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await fetchJson(apiUrl("/customers"));
        setCustomers(customersData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await fetchJson(apiUrl("/reservations/create"), 'POST', data);
      console.log('Réservation créée avec succès:', data);
      navigate('/reservations'); // Rediriger après la création de la réservation
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirige l'utilisateur vers la page d'accueil
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}
     className="m-0 p-6 w-[930px] bg-white shadow-md rounded-md
      flex flex-row flex-wrap justify-between items-center">
      <div className="mb-4 w-[280px]">
        <label htmlFor="customer_id" className="block text-gray-700">Client</label>
        <select
          id="customer_id"
          {...register("customer_id")}
          className={`mt-1 block w-full p-2 border rounded-md ${errors.customer_id ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Sélectionnez un client</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
        {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id.message}</p>}
      </div>

      <div className="mb-4 w-[280px]">
        <label htmlFor="room_id" className="block text-gray-700">Chambre</label>
        <input
          id="room_id"
          type="text"
          {...register("room_id")}
          className={`mt-1 block w-full p-2 border rounded-md ${errors.room_id ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Entrez l'ID de la chambre"
        />
        {errors.room_id && <p className="text-red-500 text-sm">{errors.room_id.message}</p>}
      </div>

      <div className="mb-4 w-[280px]">
        <label htmlFor="table_id" className="block text-gray-700">Table</label>
        <input
          id="table_id"
          type="text"
          {...register("table_id")}
          className={`mt-1 block w-full p-2 border rounded-md ${errors.table_id ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Entrez l'ID de la table"
        />
        {errors.table_id && <p className="text-red-500 text-sm">{errors.table_id.message}</p>}
      </div>

      <div className="mb-4 w-[280px]">
        <label htmlFor="reservation_start" className="block text-gray-700">Date de début</label>
        <input
          id="reservation_start"
          type="datetime-local"
          {...register("reservation_start")}
          className={`mt-1 block w-full p-2 border rounded-md ${errors.reservation_start ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.reservation_start && <p className="text-red-500 text-sm">{errors.reservation_start.message}</p>}
      </div>

      <div className="mb-4 w-[280px]">
        <label htmlFor="reservation_end" className="block text-gray-700">Date de fin</label>
        <input
          id="reservation_end"
          type="datetime-local"
          {...register("reservation_end")}
          className={`mt-1 block w-full p-2 border rounded-md ${errors.reservation_end ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.reservation_end && <p className="text-red-500 text-sm">{errors.reservation_end.message}</p>}
      </div>

      <div className="mb-4 w-[280px]">
        <label htmlFor="status" className="block text-gray-700">Statut</label>
        <input
          id="status"
          type="text"
          {...register("status")}
          className={`mt-1 block w-full p-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>

      <div className="mb-4 w-[900px]">
        <label htmlFor="description" className="block text-gray-700">Description</label>
        <textarea
          id="description"
          {...register("description")}
          className="mt-1 block w-full p-2 border rounded-md h-[100px] outline-none"
        />
      </div>

      <div className="flex space-x-4">
        <button type="submit" className="w-full bg-blue-500 text-white 
        p-2 rounded-md hover:bg-blue-600">
          Soumettre
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default CreateReservation;
