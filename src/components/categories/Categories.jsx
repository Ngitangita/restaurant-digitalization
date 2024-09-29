import React, { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../services/api';


const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
       (async () => {
            try {
                const data = await fetchJson(apiUrl("/categories"));
                setCategories(data);
            } catch (err) {
                setError('Erreur lors de la récupération des categories');
            }
        })();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des categories</h1>
            {error && <p className="text-red-500">{error}</p>}
            {/* <Link to="/categories/create">
                <button className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Créer un categories
                </button>
            </Link> */}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(categorie => (
                        <tr key={categorie.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4">{categorie.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesList;
