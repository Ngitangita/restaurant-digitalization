import React, { useState } from 'react';
import CreateMenu from './CreateMenu';

const MenuList = ({ menus = [], ajouterMenu }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCreateMenu = (menu) => {
        ajouterMenu(menu); 
        toggleModal();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Menus</h1>
            
            <button 
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={toggleModal}
            >
                Créer un menu
            </button>
            {isModalOpen && (
                <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
                    <div className="CreateMenuModal bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Ajouter un nouveau menu</h2>
                        <CreateMenu onCreate={handleCreateMenu} createMenuModal={toggleModal}/>
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4">ID</th>
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Prix</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.map(menu => (
                        <tr key={menu.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4">{menu.id}</td>
                            <td className="py-2 px-4">{menu.name}</td>
                            <td className="py-2 px-4">{menu.price} €</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuList;
