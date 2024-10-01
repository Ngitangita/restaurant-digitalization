import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiUrl, fetchJson } from '../../services/api';
import UnitsListe from '../units/UnitsListe';

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  unit: z.string({ message: "l'unité est requis" })
});

const unitSchema = z.object({
  name: z.string().min(1, "Le nom de l'unité est requis"),
  abbreviation: z.string().min(1, "L'abréviation est requise"),
});

function CreateIngredient({ onModalOpen, onToggle }) {
  const [units, setUnits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenListeUnit, setIsModalOpenListeUnit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    register: registerUnit,
    handleSubmit: handleSubmitUnit,
    formState: { errors: unitErrors },
    reset: resetUnitForm,
  } = useForm({
    resolver: zodResolver(unitSchema),
  });

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

  const onSubmit = async (data) => {
    try {
      await fetchJson(apiUrl("/ingredients"), 'POST', {
        name: data.name,
        unitId: parseInt(data.unit, 10)
      });
      onModalOpen(false);
      console.log('Ingrédient créé avec succès:', data);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const onSubmitUnit = async (data) => {
    try {
      await fetchJson(apiUrl("/units"), 'POST', data);
      console.log('Unité créée avec succès:', data);
      setIsModalOpen(false);
      resetUnitForm();
      await fetchUnits();
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'unité:', error);
    }
  };

  return (
    <div >
      <form onSubmit={handleSubmit(onSubmit)} className="CreateIngredient m-0 p-4 w-full rounded-md">
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
            <button type="button" onClick={() => setIsModalOpen(true)} className="text-blue-500">Créer une nouvelle unité</button>
            <button type="button" onClick={() => setIsModalOpenListeUnit(true)} className="text-blue-500">Liste des unités</button>
          </div>

          <div className="flex flex-row gap-44 mt-4">
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              Soumettre
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>

      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="creatUnitModal bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl mb-4">Créer une nouvelle unité</h2>
            <form onSubmit={handleSubmitUnit(onSubmitUnit)}>
              <div className="mb-4">
                <label htmlFor="unitName" className="block text-gray-700">Nom de l'unité</label>
                <input
                  id="unitName"
                  type="text"
                  {...registerUnit("name")}
                  className={`mt-1 block w-full p-2 outline-none border rounded-md ${unitErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {unitErrors.name && <p className="text-red-500 text-sm">{unitErrors.name.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="abbreviation" className="block text-gray-700">Abréviation</label>
                <input
                  id="abbreviation"
                  type="text"
                  {...registerUnit("abbreviation")}
                  className={`mt-1 block w-full p-2 outline-none border rounded-md ${unitErrors.abbreviation ? 'border-red-500' : 'border-gray-300'}`}
                />
                {unitErrors.abbreviation && <p className="text-red-500 text-sm">{unitErrors.abbreviation.message}</p>}
              </div>
              <div className='flex flex-row gap-44'>
              <button type="submit" className="bg-blue-500 text-white p-2 px-4 rounded-md hover:bg-blue-600">
                Créer</button>
              <button type="button" onClick={() => setIsModalOpen(false)}  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Annuler</button>
              </div>
           </form>
          </div>
        </div>
      )}
      {isModalOpenListeUnit &&
        (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="ModalListeUnit bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl mb-4">Liste des unités</h2>
            <UnitsListe />
            <button type="button" onClick={() => setIsModalOpenListeUnit(false)}  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Annuler</button>
          </div>
        </div>)}
    </div>
  );
}

export default CreateIngredient;
