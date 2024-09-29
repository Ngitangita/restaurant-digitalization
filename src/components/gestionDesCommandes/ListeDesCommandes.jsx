import React from 'react';

export default function ListeDesCommandes({ commandes }) {
    return (
        <div className="Commandes mt-5">
            <h2 className="text-xl font-bold mb-4">Liste des Commandes</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Quantité</th>
                        <th className="py-2 px-4">Prix unitaire (€)</th>
                        <th className="py-2 px-4">Total (€)</th>
                    </tr>
                </thead>
                <tbody>
                    {commandes.map((commande, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="py-2 px-4">{commande.name}</td>
                            <td className="py-2 px-4">{commande.quantity}</td>
                            <td className="py-2 px-4">{commande.price}</td>
                            <td className="py-2 px-4">{commande.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
