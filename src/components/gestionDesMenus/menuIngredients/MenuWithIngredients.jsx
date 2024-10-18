import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { apiUrl, fetchJson } from '../../../services/api';
import ManageMenuIngredients from './ManageMenuIngredients';

function MenuWithIngredients() {
  const { menuId } = useParams(); 
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuWithIngredients = async () => {
    try {
      const parsedMenuId = parseInt(menuId, 10); 
      if (isNaN(parsedMenuId)) {
        throw new Error("ID de menu invalide.");
      }

      const url = apiUrl(`/menu-ingredients/menu/${parsedMenuId}`); 
      const data = await fetchJson(url);

      if (!data) {
        throw new Error("Données du menu non disponibles");
      }

      setMenu(data); 
    } catch (error) {
      console.error('Erreur lors de la récupération du menu:', error.message);
      setError('Erreur lors de la récupération des données du menu.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchMenuWithIngredients();
  }, [menuId]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!menu) {
    return <p>Aucun menu trouvé.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Passe la fonction fetchMenuWithIngredients comme prop */}
      <ManageMenuIngredients 
        onAddIngredients={fetchMenuWithIngredients}  // Rafraîchir après l'ajout
        ingredients={menu.ingredients} 
      />
      <h1 className="text-2xl font-bold mb-4">{menu.menuName}</h1>
      <p className="mb-4">{menu.menuDesc}</p>
      <p className="mb-4">Prix : {menu.menuPrice} €</p>
      <p className="mb-4">Statut : {menu.status}</p>

      <h2 className="text-xl font-bold mt-6">Ingrédients :</h2>
      <table className="min-w-full shadow-md rounded-lg overflow-hidden mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Nom de l'ingrédient</th>
            <th className="py-2 px-4">Quantité</th>
            <th className="py-2 px-4">Unité</th>
            <th className="py-2 px-4">Créé le</th>
            <th className="py-2 px-4">Mis à jour le</th>
          </tr>
        </thead>
        <tbody>
          {menu.ingredients.length === 0 ? (
            <tr className="text-center">
              <td colSpan="5" className="py-4 text-gray-500">
                Aucun ingrédient disponible pour ce menu.
              </td>
            </tr>
          ) : (
            menu.ingredients.map((ingredient, i) => (
              <tr key={i} className="hover:bg-gray-100 text-center">
                <td className="py-2 px-4">{ingredient.ingredientName}</td>
                <td className="py-2 px-4">{ingredient.quantity}</td>
                <td className="py-2 px-4">{ingredient.unitName}</td>
                <td className="py-2 px-4">
                  {new Date(ingredient.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(ingredient.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MenuWithIngredients;
