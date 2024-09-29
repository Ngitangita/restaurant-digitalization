import React, { useState } from 'react';

const CreateMenu = ({ onCreate }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!name || !price) {
            return;
        }

        const nouveauMenu = {
            id: Date.now(), // Simple génération d'ID
            name,
            price: parseFloat(price),
        };

        onCreate(nouveauMenu); // Appel de la fonction d'ajout
        setName('');
        setPrice('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Nom du Menu:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="price">Prix du Menu:</label>
                <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
            </div>
            <div className="mt-4">
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Ajouter
                </button>
            </div>
        </form>
    );
};

export default CreateMenu;
