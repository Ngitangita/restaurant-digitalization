import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiMenuUnfold4Line } from "react-icons/ri";
import SearchBox from '../searchBox/SearchBox';
import { MdOutlineLightMode } from "react-icons/md";
import ProfileMenu from '../profileMenu/ProfileMenu';

export default function Header() {

    return (
        <>
            <header className='fixed top-0 left-0 w-full h-20 bg-white p-10 shadow-md dark:bg-boxdark dark:shadow-none z-50'>
                <div className='flex flex-row justify-between items-center h-full'>
                    <div className='flex flex-row items-center gap-4'>
                        <Link to="/" className='flex flex-row gap-2 items-center'>
                            <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
                            <div className='flex flex-col'>
                                <span className='text-2xl font-bold text-gray-500'>By Sooatel</span>
                                <span className='text-xs text-gray-500'>Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
                            </div>
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
                        <button className="rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200">
                            <Link to="/"><MdOutlineLightMode /></Link>
                        </button>
                        <div className='flex flex-row items-end'>
                            <ProfileMenu />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
