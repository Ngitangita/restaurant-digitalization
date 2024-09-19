import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function ListeDesMenu({ Foods }) {
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const toggleMenuSelection = (menuName) => {
        setSelectedMenus((prevSelectedMenus) => {
            if (prevSelectedMenus.includes(menuName)) {
                return prevSelectedMenus.filter((name) => name !== menuName);
            } else {
                return [...prevSelectedMenus, menuName];
            }
        });
    };

    const handleQuantityChange = (menuName, event) => {
        const value = Math.max(0, parseInt(event.target.value, 10) || 0);
        setQuantities({
            ...quantities,
            [menuName]: value,
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    // Filtrer les menus en fonction du terme de recherche
    const filteredFoods = Foods.map((food) => ({
        ...food,
        menus: food.menus.filter((menu) =>
            menu.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    }));

    const generateDesignation = () => {
        return selectedMenus
            .map((menuName) => {
                const food = Foods.find((f) => f.menus.some((m) => m.name === menuName));
                const menu = food?.menus.find((m) => m.name === menuName);
                const price = menu?.prix || '';
                const quantity = quantities[menuName] || 0;
                return `${menuName} (${quantity}) - ${price}`;
            })
            .join(', ');
    };

    return (
        <div className="ListeDesMenu mt-3 w-full flex flex-row justify-between border border-gray-300 rounded-md shadow-sm">
            <div className="ListeDesMenu relative inline-block w-80 p-2 border border-gray-300 rounded-md">
                <span className='pl-4 text-gray-500'>Sélectionnez vos désignations ici</span>
                <div className="SearchBox flex items-center mb-3 bg-white border border-gray-300 rounded-md">
                    <label htmlFor="search" className='cursor-pointer'><FaSearch className="text-gray-500 ml-2" /></label>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        id='search'
                        className="SearchBox w-full px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {searchTerm && (
                        <MdClose
                            className="text-gray-500 mr-2 cursor-pointer size-7"
                            onClick={clearSearch}
                        />
                    )}
                </div>
                <div className="ListeDesMenu max-h-40 overflow-y-scroll overflow-x-hidden scrollbar-custom bg-white">
                    {filteredFoods.map((food) => (
                        <div key={food.id} className="mb-2">
                            <h3 className="FoodName bg-gray-100 px-3 py-2 text-gray-500 font-bold">
                                {food.name}
                            </h3>
                            <ul>
                                {food.menus.map((menu) => (
                                    <li key={menu.id} className="flex items-center p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedMenus.includes(menu.name)}
                                            onChange={() => toggleMenuSelection(menu.name)}
                                            className="mr-2"
                                        />
                                        <span className="mr-2 text-gray-500">{menu.name}</span>
                                        <span className="text-gray-500">({menu.prix})</span>
                                        {selectedMenus.includes(menu.name) && (
                                            <input
                                                type="number"
                                                value={quantities[menu.name] || ''}
                                                onChange={(e) => handleQuantityChange(menu.name, e)}
                                                placeholder="Quantité"
                                                className="block w-20 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[450px] flex flex-col justify-between items-center text-gray-500">
                <label htmlFor="designation">Désignation:</label>
                <textarea
                    name="designation"
                    id="designation"
                    placeholder="Les désignations"
                    className="designation w-[430px] h-52 pl-4 pr-2 py-1 size-10 outline-none 
                    bg-gray-100 border border-gray-300 rounded-md"
                    value={generateDesignation()}
                    readOnly
                />
            </div>
        </div>
    );
}
