import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { MdAdd } from "react-icons/md";
import AddDrinkStock from '../../components/addStocks/AddDrinkStock';
import Boutton from '../../components/Boutton/Boutton';

function DrinkStock() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const drinks = [
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
        { name: "GOLD [B]", stockInitial: "20 l", entrees: "10 l", stockFinal: "10 l" },
        { name: "DYNAMO", stockInitial: "15 l", entrees: "5 l", stockFinal: "10 l" },
    ];

    return (
        <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
            <Breadcrumb pageName="Gestion des Boissons" />
            <Boutton
                onClick={toggleModal}
                type='button'
                className="mb-3 rounded p-1 relative left-[750px] text-white flex flex-row items-center gap-2 bg-blue-500">
                <MdAdd className="size-8" /> Ajoutez le boisson
            </Boutton>
            {isOpen && (
                <div
                    id="static-modal"
                    className="bg-black/80 fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full max-h-full overflow-y-auto overflow-x-hidden"
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-500 dark:text-white">
                                    Close modal
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={toggleModal}
                                >
                                    <svg
                                        className="w-3 h-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <AddDrinkStock />
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    onClick={toggleModal}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    I accept
                                </button>
                                <button
                                    onClick={toggleModal}
                                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <table className="min-w-full bg-white border border-gray-300">
                <thead className='text-center'>
                    <tr className='bg-slate-300 text-gray-500'>
                        <th className="py-2 px-4 w-[350px]">Nom</th>
                        <th className="py-2 px-4 ">Stock Initial</th>
                        <th className="py-2 px-4 ">Entrées</th>
                        <th className="py-2 px-4 ">Stock Final</th>
                    </tr>
                </thead>
                <tbody className='text-center 
                w-[930px] bg-white max-h-[calc(100%-80px)] fixed
        overflow-y-scroll overflow-x-hidden scrollbar-custom'>
                    {drinks.map((drink, index) => (
                        <tr key={index} className='border border-x text-gray-500'>
                            <td className="py-2 px-4 w-[350px]">{drink.name}</td>
                            <td className="py-2 px-4 w-[200px]">{drink.stockInitial}</td>
                            <td className="py-2 px-4 w-[200px]">{drink.entrees}</td>
                            <td className="py-2 px-4 w-[200px]">{drink.stockFinal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DrinkStock;
