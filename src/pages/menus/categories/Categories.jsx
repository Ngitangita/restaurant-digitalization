import { useState } from "react";
import CreateCategorie from "../../../components/addCategorie/CreateCategorie";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Boutton from "../../../components/Boutton/Boutton";
import { MdAdd } from "react-icons/md";
import BonDeCommande from "../../../components/bonDeCommande/BonDeCommande";
import { Link } from "react-router-dom";

export default function Categories() {
  const [isOpenCommande, setIsOpenCommande] = useState(false);

  const toggleModalCommande = () => {
    setIsOpenCommande(!isOpenCommande);
  };

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggleModalMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const Foods = [
    {
      id: 1,
      name: "NOS PIZZAS",
      menus: [
        { id: 1, name: "Pizza Margherita", prix: "22 000 AR" },
        { id: 2, name: "Pizza Cremiera", prix: "22 000 AR" },
        { id: 3, name: "Pizza 4 Fromage", prix: "25 000 AR" },
      ]
    },
    {
      id: 2,
      name: "NOS SNACKS",
      menus: [
        { id: 1, name: "Pizza Margherita", prix: "22 000 AR" },
        { id: 2, name: "Pizza Cremiera", prix: "22 000 AR" },
        { id: 3, name: "Pizza 4 Fromage", prix: "25 000 AR" },
      ]
    },
    {
      id: 3,
      name: "NOS SNACKS",
      menus: [
        { id: 1, name: "Pizza Margherita", prix: "22 000 AR" },
        { id: 2, name: "Pizza Cremiera", prix: "22 000 AR" },
        { id: 3, name: "Pizza 4 Fromage", prix: "25 000 AR" },
      ]
    }, {
      id: 4,
      name: "NOS SNACKS",
      menus: [
        { id: 1, name: "Pizza Margherita", prix: "22 000 AR" },
        { id: 2, name: "Pizza Cremiera", prix: "22 000 AR" },
        { id: 3, name: "Pizza 4 Fromage", prix: "25 000 AR" },
      ]
    }, {
      id: 5,
      name: "NOS SNACKS",
      menus: [
        { id: 1, name: "Pizza Margherita", prix: "22 000 AR" },
        { id: 2, name: "Pizza Cremiera", prix: "22 000 AR" },
        { id: 3, name: "Pizza 4 Fromage", prix: "25 000 AR" },
      ]
    }
  ]

  return (
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Categories" />
      <div className="flex flex-row gap-4 justify-end">
        <Boutton
          onClick={toggleModalCommande}
          type='button'
          className="mb-3 rounded p-1 relative  text-white flex flex-row items-center gap-2 bg-blue-500">
          <MdAdd className="size-8" />ajoutez le commande
        </Boutton>
        <Boutton
          onClick={toggleModalMenu}
          type='button'
          className="mb-3 rounded p-1 relative text-white flex flex-row items-center gap-2 bg-blue-500">
          <MdAdd className="size-8" /> Ajoutez le menu
        </Boutton>
      </div>
      {isOpenCommande && (
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
                  onClick={toggleModalCommande}
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
              <BonDeCommande />
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <Link to="/commandes">
                  <button
                    // onClick={toggleModalCommande}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    I accept
                  </button>
                </Link>
                <button
                  onClick={toggleModalCommande}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpenMenu && (
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
                  onClick={toggleModalMenu}
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
              <CreateCategorie />
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={toggleModalMenu}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
                <button
                  onClick={toggleModalMenu}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="min-w-full bg-white">
        <thead> 
          <div className="bg-gray-300 text-gray-500">
            <th className="py-2 px-4 w-[400px] border border-y">Nom</th>
            <th className="py-2 px-4 w-[300px] border border-y">Prix</th>
            <th className="py-2 px-4 w-[200px] border border-y">Choix</th>
          </div>
        </thead>
        <tbody className='text-center w-[930px] bg-white max-h-[calc(100%-80px)] fixed
        overflow-y-scroll overflow-x-hidden scrollbar-custom' >
          {Foods.map((food, i) => (
            <tr key={i} className="flex flex-col">
              <td className="py-2 px-4 pt-10 text-gray-500 bg-gray-100 flex flex-row gap-96 w-full font-bold">Categorie <span> {food.name}</span> </td>
              {food.menus.map((menu) => (
                <tr key={menu.id} className="border border-x text-gray-500">
                  <td className="py-2 px-4 w-[400px]">{menu.name} </td>
                  <td className="py-2 px-4 w-[300px]">{menu.prix} </td>
                  <td className="py-2 px-4 w-[200px]"><input type="checkbox" name="checkbox" id="checkbox" /> </td>
                </tr>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

