import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiUrl, fetchJson } from '../../services/api';
import {useNavigate} from "react-router-dom";
import useToast from "../gestionDesMenus/menuOrder/(tantely)/hooks/useToast.jsx";

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  unit: z.string({ message: "l'unité est requis" })
});



function CreateIngredient({ onModalOpen, onToggle }) {
  const [units, setUnits] = useState([]);
  const {showSuccess, showError} = useToast()

  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });



  const navigate= useNavigate()

  const fetchUnits = async () => {
    try {
      const data = await fetchJson(apiUrl("/units/all"));
      setUnits(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des unités:', error);
      showError('Impossible de charger les unités');
    }
  };

  useEffect(() => {
    void fetchUnits();
  }, []);

  const onSubmit = async (data) => {
    try {
      await fetchJson(apiUrl("/ingredients"), 'POST', {
        name: data.name,
        unitId: parseInt(data.unit, 10)
      });
      onModalOpen(false);
      showSuccess('Ingrédient créé avec succès');
      console.log('Ingrédient créé avec succès:', data);
      reset();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showError('Erreur lors de la création de l\'ingrédient');
    }
  };


  return (
    <div className='p-8'>
      <form onSubmit={handleSubmit(onSubmit)} className="m-0 p-4 w-full rounded-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Nom</label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`Input mt-1 block w-full p-2 outline-none border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="unit" className="block text-gray-700">Unité</label>
          <select
            id="unit"
            {...register("unit")}
            className={`Input mt-1 block w-full p-2 outline-none border rounded-md ${errors.unit ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Sélectionnez une unité</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.abbreviation}</option>
            ))}
          </select>
          {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <div className='flex flex-row gap-14'>
            <button type="button" onClick={() => navigate("/units")} className="text-blue-500">Créer une nouvelle unité</button>
            <button type="button" onClick={() => navigate("/units")} className="text-blue-500">Liste des unités</button>
          </div>

          <div className="flex flex-row gap-44 mt-4">
            <button
                type="button"
                onClick={onToggle}
                className="mr-2 bg-red-300 text-gray-700 py-2 px-4 rounded-md hover:bg-red-400"
            >
              Annuler
            </button>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              Soumettre
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}

export default CreateIngredient;
