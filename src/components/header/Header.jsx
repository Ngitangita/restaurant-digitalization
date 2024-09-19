import React, { useContext, useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { MdOutlineLightMode, MdOutlineNightlightRound} from "react-icons/md";
import { MyContext } from '../../App';

export default function Header() {
    const context = useContext(MyContext);
    const [lightMode, setLightMode] = useState(context.themeMode);

    useEffect(() => {
        setLightMode(context.themeMode);
    }, [context.themeMode]);

    return (
        <header className='fixed top-0 left-0 w-full h-20 bg-white p-4 shadow-md z-50 flex items-center justify-between lg:p-6'>
            <div className='flex items-center gap-4'>
                <Link to="/" className='flex items-center gap-2'>
                    <img src="/UTOPIA-B.png" alt="UTOPIA-B" className="w-12 h-12 lg:w-16 lg:h-16 rounded-full" />
                    <div className='hidden lg:flex flex-col'>
                        <span className='text-xl font-bold text-gray-500'>By Sooatel</span>
                        <span className='text-xs text-gray-500'>Ankasina Antananarivo <br /> Tél : 038 96 373 43</span>
                    </div>
                </Link>
            </div>
            <div className='flex items-center gap-3'>
                <button 
                    className="rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200"
                    onClick={() => context.setThemeMode(!context.themeMode)}
                >
                    {lightMode ? (
                        <MdOutlineLightMode />
                    ) : (
                        <MdOutlineNightlightRound />
                    )}
                </button>
            </div>
        </header>
    );
}
