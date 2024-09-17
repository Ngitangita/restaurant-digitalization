import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function ListeDesMenu({ Foods }) {
    const [personName, setPersonName] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [search, setSearch] = useState('');

    const handleToggle = (name) => {
        setPersonName((prevNames) => {
            if (prevNames.includes(name)) {
                return prevNames.filter((n) => n !== name);
            } else {
                return [...prevNames, name];
            }
        });
    };

    const handleQuantityChange = (name, event) => {
        setQuantities({
            ...quantities,
            [name]: event.target.value,
        });
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const clearSearch = () => {
        setSearch('');
    };

    // Filtrer les noms en fonction de la recherche
    const filteredFoods = Foods.map((food) => ({
        ...food,
        menus: food.menus.filter((menu) =>
            menu.name.toLowerCase().includes(search.toLowerCase())
        ),
    }));

    const generateDesignation = () => {
        return personName
            .map((name) => {
                const food = Foods.find((f) => f.menus.some((m) => m.name === name));
                const menu = food?.menus.find((m) => m.name === name);
                const prix = menu?.prix || '';
                const quantite = quantities[name] || 0;
                return `${name} (${quantite})`;
            })
            .join(', ');
    };

    return (

        <div className="mt-3 w-full flex flex-row justify-between border border-gray-300 rounded-md shadow-sm ">
            <div className="relative inline-block w-80 p-2 border border-gray-300 rounded-md">
                <span className='pl-4 text-gray-500'>Selectionnez vos désignations ici</span>
                <div className="flex items-center mb-3 bg-white border border-gray-300 rounded-md">
                    <label htmlFor="research" className='cursor-pointer'><FaSearch className="text-gray-500 ml-2" /></label>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={handleSearch}
                        id='research'
                        className="w-full px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {search && (
                        <MdClose
                            className="text-gray-500 mr-2 cursor-pointer size-7"
                            onClick={clearSearch}
                        />
                    )}
                </div>
                <div className="max-h-40 overflow-y-scroll overflow-x-hidden scrollbar-custom bg-white">
                    {filteredFoods.map((food) => (
                        <div key={food.id} className="mb-2">
                            <h3 className="bg-gray-200 px-3 py-2 text-gray-500 font-bold">
                                {food.name}
                            </h3>
                            <ul>
                                {food.menus.map((menu) => (
                                    <li key={menu.id} className="flex items-center p-2">
                                        <input
                                            type="checkbox"
                                            checked={personName.includes(menu.name)}
                                            onChange={() => handleToggle(menu.name)}
                                            className="mr-2"
                                        />
                                        <span className="mr-2 text-gray-500">{menu.name}</span>
                                        <span className="text-gray-500">({menu.prix})</span>
                                        {personName.includes(menu.name) && (
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
            <div className="w-[450px] flex flex-col justify-between items-center text-gray-500 ">
                <label htmlFor="designation">Désignation:</label>
                <textarea
                    name="designation"
                    id="designation"
                    placeholder="Les désignations"
                    className="w-[430px] h-52 pl-4 pr-2 py-1 size-10 outline-none 
                    bg-slate-100  border border-gray-300 rounded-md"
                    value={generateDesignation()}
                    readOnly
                />
            </div>
        </div>
    );
}
