import React, { useState } from 'react';
import { FaAngleRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { RiReservedLine } from "react-icons/ri";
import { AiOutlineStock } from "react-icons/ai";
import { RiMenuUnfold4Line } from "react-icons/ri";
import { MdKeyboardCommandKey, MdOutlineCalendarMonth, MdCategory, MdOutlineHome, MdMenuBook, MdOutlineSettings, MdMenu, MdOutlineLogin } from "react-icons/md";

export const SidebarToggleButton = ({ handleSidebarToggle, openSidebar }) => (
    <button
        className="fixed top-4 left-20 z-50 rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200 lg:hidden"
        onClick={handleSidebarToggle}
    >
        {openSidebar ? (
            <MdMenu className="text-gray-500 text-xl" />
        ) : (
            <RiMenuUnfold4Line className="text-gray-500 text-xl" />
        )}
    </button>
);

export default function Sidebar() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(null);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState({});
    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSubmenuToggle = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSidebarToggle = () => {
        setOpenSidebar(!openSidebar);
    };

    return (
        <>
            <SidebarToggleButton handleSidebarToggle={handleSidebarToggle} openSidebar={openSidebar} />

            <div className={`fixed top-20 left-0 w-64 h-screen bg-white shadow-md flex flex-col overflow-y-scroll overflow-x-hidden scrollbar-custom
                transition-transform duration-300 ease-in-out z-40 ${openSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>

                <div className="flex items-center justify-between p-4 text-2xl font-bold text-gray-500">
                    <span>Tableau de bord</span>
                </div>

                <ul className="space-y-2 p-4 text-gray-500">
                    <li>
                        <Link
                            to="/"
                            className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/' ? 'bg-gray-200' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <MdOutlineHome />
                                <span className="text-gray-700">Accueil</span>
                            </div>
                        </Link>
                    </li>
                    <li className="space-y-2">
                        <button
                            onClick={() => handleSubmenuToggle(1)}
                            className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${activeTab === 1 && isToggleSubmenu[1] ? 'bg-gray-200' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <MdKeyboardCommandKey />
                                <span className="text-gray-700">Commandes</span>
                            </div>
                            <FaAngleRight className={`ml-auto text-gray-500 transition-transform duration-300 ease-in-out ${activeTab === 1 && isToggleSubmenu[1] ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`pl-4 transition-all duration-300 ease-in-out ${activeTab === 1 && isToggleSubmenu[1] ? 'h-auto' : 'h-0 overflow-hidden'}`}>
                            <ul className={`transition-opacity duration-300 ease-in-out ${activeTab === 1 && isToggleSubmenu[1] ? 'opacity-100' : 'opacity-0'}`}>
                                <li>
                                    <Link
                                        to="/bonDeCommandes"
                                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/bonDeCommandes' ? 'bg-gray-200' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MdCategory />
                                            <span className="text-gray-700">Bon de commande</span>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/commandes"
                                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/commandes' ? 'bg-gray-200' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MdMenuBook />
                                            <span className="text-gray-700">Liste des commandes</span>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link
                            to="/calendar"
                            className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/calendar' ? 'bg-gray-200' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <MdOutlineCalendarMonth />
                                <span className="text-gray-700">Calendrier</span>
                            </div>
                        </Link>
                    </li>
                    <li className="space-y-2">
                        <button
                            onClick={() => handleSubmenuToggle(2)}
                            className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${activeTab === 2 && isToggleSubmenu[2] ? 'bg-gray-200' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <AiOutlineStock />
                                <span className="text-gray-700">Stocks</span>
                            </div>
                            <FaAngleRight className={`ml-auto text-gray-500 transition-transform duration-300 ease-in-out ${activeTab === 2 && isToggleSubmenu[2] ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`pl-4 transition-all duration-300 ease-in-out ${activeTab === 2 && isToggleSubmenu[2] ? 'h-auto' : 'h-0 overflow-hidden'}`}>
                            <ul className={`transition-opacity duration-300 ease-in-out ${activeTab === 2 && isToggleSubmenu[2] ? 'opacity-100' : 'opacity-0'}`}>
                                <li>
                                    <Link
                                        to="/drinkStocks"
                                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/drinkStocks' ? 'bg-gray-200' : ''}`}
                                    >
                                        Stocks boissons
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/foodStocks"
                                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/foodStocks' ? 'bg-gray-200' : ''}`}
                                    >
                                        Stocks alimentaires
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/ingredientStocks"
                                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/ingredientStocks' ? 'bg-gray-200' : ''}`}
                                    >
                                        Stocks ingrédients
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link
                            to="/reservations"
                            className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/reservations' ? 'bg-gray-200' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <RiReservedLine />
                                <span className="text-gray-700">Réservations</span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/settings"
                            className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/settings' ? 'bg-gray-200' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <MdOutlineSettings />
                                <span className="text-gray-700">Paramètres</span>
                            </div>
                        </Link>
                    </li>
                </ul>

                <div className="p-4 bg-white">
                    <Link
                        to="/authentification"
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/authentification' ? 'bg-gray-200' : ''}`}
                    >
                        <MdOutlineLogin className="text-gray-500 text-xl" />
                        <span className="ml-2 text-gray-700">Authentification</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
