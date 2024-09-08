import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Boutton from '../../components/Boutton/Boutton';
import AddIngredientStock from '../../components/addStocks/AddIngredientStock';
import { MdAdd } from "react-icons/md";

function IngredientStock() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const ingredients = [
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
    { date: "02/12/2024", name: "MAYO", enter: "5", sortie: "3", stockFinal: "2" },
    { date: "02/18/2024", name: "SAUCE PIMENT", enter: "12", sortie: "4", stockFinal: "8" },
  ];

  return (
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Gestion des ingrédients" />
      <Boutton
        onClick={toggleModal}
        type='button'
        className="mb-3 rounded p-1 relative left-[750px] text-white flex flex-row items-center gap-2 bg-blue-500">
        <MdAdd className="size-8" /> Ajoutez l'ingredient
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
              <AddIngredientStock />
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
      <table className="min-w-full bg-white text-gray-500">
        <thead className='text-center'>
          <tr className='bg-slate-300'>
            <th className="py-2 px-4 w-[200px]">Date</th>
            <th className="py-2 px-4 w-[200px]">Nom</th>
            <th className="py-2 px-4 w-[200px]">Entrées</th>
            <th className="py-2 px-4 w-[200px]">Sortie</th>
            <th className="py-2 px-4 w-[200px]">Stock Final</th>
          </tr>
        </thead>
        <tbody className='text-center  w-[930px] bg-white max-h-[calc(100%-80px)] fixed
        overflow-y-scroll overflow-x-hidden scrollbar-custom'>
          {ingredients.map((ingredient, index) => (
            <tr key={index} className='border border-x'>
              <td className="py-2 px-4 w-[200px]">{ingredient.date}</td>
              <td className="py-2 px-4 w-[200px]">{ingredient.name}</td>
              <td className="py-2 px-4 w-[200px]">{ingredient.enter}</td>
              <td className="py-2 px-4 w-[200px]">{ingredient.sortie}</td>
              <td className="py-2 px-4 w-[200px]">{ingredient.stockFinal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IngredientStock;
