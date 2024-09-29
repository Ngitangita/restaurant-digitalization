import React, { useState } from 'react';
import MenuList from './MenuList';
import ListeDesMenu from '../bonDeCommande/ListeDesMenu';

export default function GestionDesMenus() {
    const [menus, setMenus] = useState([]);

    // Fonction pour ajouter un nouveau menu
    const ajouterMenu = (nouveauMenu) => {
        setMenus((prevMenus) => [...prevMenus, nouveauMenu]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Menus</h1>
            {/* Passer les menus et la fonction d'ajout à MenuList */}
            <MenuList menus={menus} ajouterMenu={ajouterMenu} />
            
            {/* Passer les menus à ListeDesMenu */}
            <ListeDesMenu menus={menus} />
        </div>
    );
}
