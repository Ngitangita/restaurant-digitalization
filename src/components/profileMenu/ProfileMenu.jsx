import React, { useState } from 'react';
import { MdOutlineLogout, MdOutlinePersonAddAlt1, MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { useProfile } from '../profileMenu/ProfileContext'; // Corrigez le chemin si nécessaire

export default function ProfileMenu() {
    const [anchorEl, setAnchorEl] = useState(false);
    const { profileImage } = useProfile();

    const handleClick = () => {
        setAnchorEl(!anchorEl);
    };

    const handleClose = () => {
        setAnchorEl(false);
    };

    return (
        <div className="flex items-center text-center">
            <div className="relative">
                <button
                    aria-controls={anchorEl ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                    onClick={handleClick}
                    className='w-[55px] h-[55px] flex items-center cursor-pointer flex-row'>
                    <div className='w-[40px] h-[40px] border-[1.5px] border-blue-500 p-[1px] overflow-hidden rounded-full flex items-center'>
                        <span className='overflow-hidden rounded-full flex items-center'>
                            <img src={profileImage} alt="Profile" className="object-cover" />
                        </span>
                    </div>
                    <FaAngleRight className="ml-auto text-gray-500 rotate-90 relative top-3" />
                </button>
                {anchorEl && (
                    <div
                        id="account-menu"
                        className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                        onClick={handleClose}
                    >
                        <div className="p-2 px-4 flex items-center cursor-pointer hover:bg-gray-100">
                            <Link
                                to="/profile"
                                className={`flex items-center gap-3${location.pathname === '/profile' ? 'bg-gray-200' : ''}`}
                            >
                                <span><FaRegUser /></span>
                                <span>My Profile</span>
                            </Link>
                        </div>
                        <hr />
                        <div className="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100">
                            <span className="mr-3"><MdOutlinePersonAddAlt1 /></span>
                            <span>Add account</span>
                        </div>
                        <div className="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100">
                            <span className="mr-3"><MdOutlineSettings /></span>
                            <span>Settings</span>
                        </div>
                        <hr />
                        <div className="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100">
                            <Link to="/authentification" className='px-4 flex flex-row gap-2 items-center'>
                                <MdOutlineLogout /><span>Log Out</span></Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
