import React, { useState } from 'react';
import { FaAngleRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { RiReservedLine } from "react-icons/ri";
import { AiOutlineStock } from "react-icons/ai";
import { RiMenuUnfold4Line } from "react-icons/ri";
import {
  MdKeyboardCommandKey, MdOutlineCalendarMonth,
  MdCategory, MdOutlineHome, MdMenuBook, MdOutlineSettings,
  MdMenu, MdOutlineLogin
} from "react-icons/md";
import { useTitleStore } from '../../stores/useTitleStore';

const menuItems = [
  {
    title: "Accueil",
    icon: <MdOutlineHome />,
    path: "/",
    subItems: [],
  },
  {
    title: "Gestion des menus",
    icon: <MdMenuBook />,
    subItems: [
      {
        title: "List des menus",
        path: "/menuList",
      },
      {
        title: "Liste des catégories",
        path: "/categoriesListe",
      },
      {
        title: "Ingredients",
        path: "/ingredients",
      },
    ],
  },
  {
    title: "List des tables",
    path: "/tableList",
    subItems: [],
  },
  {
    title: "Commandes",
    icon: <MdKeyboardCommandKey />,
    subItems: [
      {
        title: "Bon de commande",
        path: "/bonDeCommandes",
        icon: <MdCategory />,
      },
      {
        title: "Liste des commandes",
        path: "/commandes",
        icon: <MdMenuBook />,
      },
    ],
  },
  {
    title: "Calendrier",
    icon: <MdOutlineCalendarMonth />,
    path: "/calendar",
    subItems: [],
  },
  {
    title: "Stocks",
    icon: <AiOutlineStock />,
    path: "/stocks",
    subItems: [],
  },
  {
    title: "Réservations",
    icon: <RiReservedLine />,
    path: "/reservations",
    subItems: [],
  },
  {
    title: "Paramètres",
    icon: <MdOutlineSettings />,
    path: "/settings",
    subItems: [],
  },
];

export const SidebarToggleButton = ({ handleSidebarToggle, openSidebar }) => (
  <button
    className="fixed top-4 left-20 z-50 rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200 lg:hidden"
    onClick={handleSidebarToggle}
  >
    {openSidebar ? <MdMenu className="text-gray-500 text-xl" /> : <RiMenuUnfold4Line className="text-gray-500 text-xl" />}
  </button>
);

export default function Sidebar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState({});
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const setTitle = useTitleStore(state => state.setTitle);

  const handleSubmenuToggle = (index) => {
    setActiveTab(index);
    setIsToggleSubmenu(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSidebarToggle = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleChangeTitle = (title) => {
    setTitle(title);
  };

  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      setOpenSidebar(false);
    }
  };

  return (
    <>
      <SidebarToggleButton handleSidebarToggle={handleSidebarToggle} openSidebar={openSidebar} />
      <div
        className={`Sidebar fixed top-20 left-0 w-64 h-screen bg-white shadow-md flex flex-col 
          overflow-y-scroll overflow-x-hidden max-h-[calc(100%-80px)] transition-transform duration-300 
          ease-in-out z-40 ${openSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}
        onMouseEnter={() => setShowScrollbar(true)} // Afficher la barre de défilement
        onMouseLeave={() => setShowScrollbar(false)} // Masquer la barre de défilement
        style={{
          scrollbarWidth: showScrollbar ? 'thin' : 'none', // Pour Firefox
          overflowY: showScrollbar ? 'scroll' : 'hidden' // Pour la barre de défilement
        }}
      >
        <div className="flex items-center justify-between p-4 text-2xl font-bold text-gray-500">
          <span>Tableau de bord</span>
        </div>

        <ul className="space-y-2 p-4 text-gray-500 ">
          {menuItems.map((item, index) => (
            <li key={index} className="space-y-2">
              {item.subItems.length > 0 ? (
                <>
                  <button
                    onClick={() => handleSubmenuToggle(index)}
                    className={`button w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${activeTab === index && isToggleSubmenu[index] ? '' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-gray-700">{item.title}</span>
                    </div>
                    <FaAngleRight className={`ml-auto text-gray-500 transition-transform duration-300 ease-in-out ${activeTab === index && isToggleSubmenu[index] ? 'rotate-90' : ''}`} />
                  </button>
                  <div className={`pl-4 transition-all duration-300 ease-in-out ${activeTab === index && isToggleSubmenu[index] ? 'h-auto' : 'h-0 overflow-hidden'}`}>
                    <ul className={`transition-opacity duration-300 ease-in-out ${activeTab === index && isToggleSubmenu[index] ? 'opacity-100' : 'opacity-0'}`}>
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} onClick={() => { handleChangeTitle(subItem.title); handleCloseSidebar(); }}>
                          <Link
                            to={subItem.path}
                            className={`button flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === subItem.path ? 'bg-gray-200 dark:bg-gray-500' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              {subItem.icon}
                              <span className="text-gray-700">{subItem.title}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`button flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === item.path ? 'bg-gray-200 dark:bg-gray-500' : ''}`}
                  onClick={() => { handleChangeTitle(item.title); handleCloseSidebar(); }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-gray-700">{item.title}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="Authentification p-4 bg-white">
          <Link
            to="/authentification"
            className={`button flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/authentification' ? '' : ''}`}
            onClick={handleCloseSidebar}
          >
            <MdOutlineLogin className="text-gray-500 text-xl" />
            <span className="ml-2 text-gray-700">Authentification</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        body {
          overflow-y: hidden; /* Masquer la barre de défilement sur le corps */
        }
        .Sidebar::-webkit-scrollbar {
          width: ${showScrollbar ? '8px' : '0px'}; /* Largeur de la barre de défilement */
        }
        .Sidebar::-webkit-scrollbar-thumb {
          background-color: gray; /* Couleur de la barre de défilement */
          border-radius: 10px; /* Coins arrondis */
        }
      `}</style>
    </>
  );
}
