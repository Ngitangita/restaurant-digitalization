import { FaAngleRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { RiReservedLine } from "react-icons/ri";
import { AiOutlineStock } from "react-icons/ai";
import {
    MdOutlineLogin, MdKeyboardCommandKey,
    MdOutlineCalendarMonth, MdCategory, MdOutlineHome,
    MdMenuBook,
    MdOutlineSettings
} from "react-icons/md";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";


export default function Sidebar() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    };

    return (
        <div className="fixed top-[80px] pb-4 left-0 w-64 h-screen max-h-[calc(100%-80px)] bg-white shadow-md 
        flex flex-col overflow-y-scroll overflow-x-hidden scrollbar-custom"> 
            <span className="p-4 text-2xl font-bold">Tableau de bord</span>
            <ul className="space-y-2 p-4">
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
                        onClick={() => isOpenSubmenu(1)}
                        className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${activeTab === 1 && isToggleSubmenu ? 'bg-gray-200' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <MdMenuBook />
                            <span className="text-gray-700">List des menus</span>
                        </div>
                        <FaAngleRight className={`ml-auto text-gray-500 transition-transform duration-300 ease-in-out ${activeTab === 1 && isToggleSubmenu ? 'rotate-90' : ''}`} />
                    </button>
                    <div className={`pl-4 transition-all duration-300 ease-in-out ${activeTab === 1 && isToggleSubmenu ? 'h-auto' : 'h-0 overflow-hidden'}`}>
                        <ul className={`transition-opacity duration-300 ease-in-out ${activeTab === 1 && isToggleSubmenu ? 'opacity-100' : 'opacity-0'}`}>
                            <li>
                                <Link
                                    to="/categories"
                                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/categories' ? 'bg-gray-200' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MdCategory />
                                        <span className="text-gray-700">Categorie</span>
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
                <li>
                    <Link
                        to="/profile"
                        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/profile' ? 'bg-gray-200' : ''}`}
                    >
                     <span><FaRegUser /></span>
                     <span>My Profile</span>
                     </Link>
                </li>
                <li>
                    <Link
                        to="/commandes"
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/commandes' ? 'bg-gray-200' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <MdKeyboardCommandKey />
                            <span className="text-gray-700">Commandes</span>
                        </div>
                    </Link>
                </li>

                <li className="space-y-2">
                    <button
                        onClick={() => isOpenSubmenu(2)}
                        className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${activeTab === 2 && isToggleSubmenu ? 'bg-gray-200' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <AiOutlineStock />
                            <span className="text-gray-700">Stocks</span>
                        </div>
                        <FaAngleRight className={`ml-auto text-gray-500 transition-transform duration-300 ease-in-out ${activeTab === 2 && isToggleSubmenu ? 'rotate-90' : ''}`} />
                    </button>
                    <div className={`pl-4 transition-all duration-300 ease-in-out ${activeTab === 2 && isToggleSubmenu ? 'h-auto' : 'h-0 overflow-hidden'}`}>
                        <ul className={`transition-opacity duration-300 ease-in-out ${activeTab === 2 && isToggleSubmenu ? 'opacity-100' : 'opacity-0'}`}>
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
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100  ${location.pathname === '/reservations' ? 'bg-gray-200' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <RiReservedLine />
                            <span className="text-gray-700">Reservations</span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/settings"
                        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100  ${location.pathname === '/settings' ? 'bg-gray-200' : ''}`}
                    >
                        <span><MdOutlineSettings /></span>
                        <span className="text-gray-700">Settings</span>
                    </Link>
                </li>
            </ul>
            <Link to="/authentification" className={`w-44 z-50 flex flex-row gap-3 relative left-4 items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/authentication' ? 'bg-gray-200' : ''}`}>
                <button className="flex flex-row gap-3 items-center">
                    <MdOutlineLogin /> <span>Authentication</span>
                </button>
            </Link>
        </div>
    );
}
