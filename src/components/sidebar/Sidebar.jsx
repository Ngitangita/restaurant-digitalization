import { MdOutlineHome } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { MdCategory } from "react-icons/md";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdKeyboardCommandKey } from "react-icons/md";
import { RiReservedLine } from "react-icons/ri";

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className='fixed top-22 left-0 w-64 h-screen bg-white shadow-md'>
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
                        <FaAngleRight className="ml-auto text-gray-500" />
                    </Link>
                </li>
                <li>
                    <Link
                        to="/categories"
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/categories' ? 'bg-gray-200' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <MdCategory />
                            <span className="text-gray-700">Categories</span>
                        </div>
                        <FaAngleRight className="ml-auto text-gray-500" />
                    </Link>
                </li>
                <li>
                    <Link
                        to="/calendar"
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/calendar' ? 'bg-gray-200' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <MdOutlineCalendarMonth />
                            <span className="text-gray-700">Calendrie</span>
                        </div>
                        <FaAngleRight className="ml-auto text-gray-500" />
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
                        <FaAngleRight className="ml-auto text-gray-500" />
                    </Link>
                </li>
                <li>
                    <Link
                        to="/reservations"
                        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/reservations' ? 'bg-gray-200' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <RiReservedLine />
                            <span className="text-gray-700">Reservations</span>
                        </div>
                        <FaAngleRight className="ml-auto text-gray-500" />
                    </Link>
                </li>
            </ul>
        </div>
    );
}
