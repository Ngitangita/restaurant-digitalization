import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiMenuUnfold4Line } from "react-icons/ri";
import SearchBox from '../searchBox/SearchBox';
import { MdOutlineLogout, MdOutlineLightMode } from "react-icons/md";

export default function Header() {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <>
            <header className='fixed top-0 left-0 w-full h-20 bg-white p-4 shadow-md dark:bg-boxdark dark:shadow-none z-50'>
                <div className='flex flex-row justify-between items-center h-full'>
                    <div className='flex flex-row items-center'>
                        <Link to="/" className='flex flex-row gap-2 items-center'>
                            <img src="../public/logo.jpg" alt="logo" className="w-16 h-16 rounded-full" />
                            <span className='text-2xl font-bold'>SOOATEL</span>
                        </Link>

                        <div className='flex flex-row gap-6 ml-6'>
                            <button className="rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200">
                                <RiMenuUnfold4Line />
                            </button>
                            <SearchBox />
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 items-center'>
                        <button className="rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200">
                            <MdOutlineLightMode />
                        </button>
                        {
                            !isLogin ? 
                            <button className="rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200">
                                <Link to="/"><MdOutlineLogout /></Link>
                            </button> 
                            : 'Logout'
                        }
                        <button className='flex items-center gap-3 cursor-pointer flex-row'>
                            <div className='w-10 h-10 rounded-full overflow-hidden border border-blue-800 flex items-center justify-center'>
                                <img src="../public/test.jpg" alt="profil" className="object-cover"/>
                            </div>
                            <span className='flex flex-col text-start'>
                                <h4>Florentino Elise</h4>
                                <p className='text-sm'>hei.elise@gmail.com</p>
                            </span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="pt-20">
                {/* Contenu principal de la page */}
            </div>
        </>
    )
}
