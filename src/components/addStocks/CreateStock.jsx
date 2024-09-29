import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiUrl, fetchJson } from '../../services/api';
import { Link } from 'react-router-dom';

const schema = z.object({
  ingredient_id: z.string().min(1, "L'ingrédient est requis"),
  quantity: z.number().min(0.01, "La quantité doit être supérieure à zéro")
});

function CreateStock() {
  const [ingredients, setIngredients] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await fetchJson(apiUrl("/ingredients"));
        setIngredients(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des ingrédients:', error);
      }
    };

    fetchIngredients();
  }, []);

  const onSubmit = async (data) => {
    try {
      await fetchJson(apiUrl("/stocks/create"), 'POST', data);
      console.log('Stock créé avec succès:', data);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <div className='flex flex-row gap-4 items-end'>
        <div className="mb-4">
          <label htmlFor="ingredient" className="block text-gray-700">Ingrédient</label>
          <select
            id="ingredient"
            {...register("ingredient_id")}
            className={`mt-1 block w-full p-2 border rounded-md ${errors.ingredient_id ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Sélectionnez un ingrédient</option>
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
            ))}
          </select>
          {errors.ingredient_id && <p className="text-red-500 text-sm">{errors.ingredient_id.message}</p>}
        </div>
        <Link to="/ingredients/create">
          <button className="mb-4 bg-blue-500 text-white p-[2px] rounded-md hover:bg-blue-600">
            Créer un ingrédient
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <label htmlFor="quantity" className="block text-gray-700">Quantité</label>
        <input
          id="quantity"
          type="number"
          step="0.01"
          {...register("quantity")}
          className={`mt-1 block w-full p-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Soumettre</button>
    </form>
  );
}

export default CreateStock;
