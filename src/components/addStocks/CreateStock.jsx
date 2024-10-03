import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiUrl, fetchJson } from '../../services/api';

const schema = z.object({
  ingredientId: z.string().min(1, "L'ingrédient est requis"),
  quantity: z.string().refine((val) => parseFloat(val) > 0, {
    message: "La quantité doit être supérieure à zéro",
  }),
  cost: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Le coût doit être supérieur à zéro",
  }),
  description: z.string().max(255, "La description ne doit pas dépasser 255 caractères").optional(),
});

function CreateStock({ onStockCreated, createStockModale }) {
  const [ingredients, setIngredients] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await fetchJson(apiUrl("/ingredients/all"));
        setIngredients(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des ingrédients:', error);
      }
    };
    fetchIngredients();
  }, []);

  const onSubmit = async (data) => {
    try {
      await fetchJson(apiUrl("/stocks/add"), 'POST', data);
      console.log('Stock créé avec succès:', data);
      reset();  // Réinitialise le formulaire
      if (onStockCreated) onStockCreated();  // Appelle la fonction passée en props
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="ingredient" className="block text-gray-700">Ingrédient</label>
        <select
          id="ingredient"
          {...register("ingredientId")}
          className={`block w-full p-2 border rounded-md ${errors.ingredientId ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Sélectionnez un ingrédient</option>
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
          ))}
        </select>
        {errors.ingredientId && <p className="text-red-500">{errors.ingredientId.message}</p>}
      </div>

      <div className='flex flex-row gap-20'>
        <div>
          <label htmlFor="quantity" className="block text-gray-700">Quantité</label>
          <input
            id="quantity"
            type="text"
            {...register("quantity")}
            className={`block w-full p-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
        </div>

        <div>
          <label htmlFor="cost" className="block text-gray-700">Coût</label>
          <input
            id="cost"
            type="text"
            {...register("cost")}
            className={`block w-full p-2 border rounded-md ${errors.cost ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.cost && <p className="text-red-500">{errors.cost.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700">Description (facultatif)</label>
        <textarea
          id="description"
          {...register("description")}
          className={`block w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex flex-row gap-44">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Soumettre
        </button>
        <button
          type="button"
          onClick={createStockModale}
          className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default CreateStock;
