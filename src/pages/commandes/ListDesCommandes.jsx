import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SearchBox from '../../components/searchBox/SearchBox';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Commande() {

  const Commandes = [
    { date: "06/09/2024", table: "", chambre: "102", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "", chambre: "103", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "", designation: "Pizza" },
    { date: "12/09/2024", table: "", chambre: "105", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "", designation: "Pomme frite" },
    { date: "06/09/2024", table: "", chambre: "102", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "", chambre: "103", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "", designation: "Pizza" },
    { date: "12/09/2024", table: "", chambre: "105", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "", designation: "Pomme frite" },
    { date: "06/09/2024", table: "", chambre: "102", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "", chambre: "103", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "", designation: "Pizza" },
    { date: "12/09/2024", table: "", chambre: "200", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "", chambre: "103", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "", designation: "Pizza" },
    { date: "12/09/2024", table: "", chambre: "105", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "", designation: "Pomme frite" },
  ];

  return (
    <div className="w-full flex justify-end relative top-28 ">
      <div className="  px-4 md:px-10 lg:px-10 lg:pl-20 lg:top-[100px]">
        <div className="hidden xl:block">
          <Breadcrumb pageName="Liste des commandes reçues" />
        </div>
        <SearchBox />

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className='text-center text-gray-500 '>
              <tr className="bg-gray-300">
                <th className="py-2 px-2 sm:px-4 border border-y">
                  <input type="checkbox" name="checkbox" id="checkbox" />
                </th>
                <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[150px]">Date & heure</th>
                <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[150px]">N° de table</th>
                <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[150px]">Chambre</th>
                <th className="py-2 px-2 sm:px-4 w-[200px] sm:w-[350px]  border border-y">Désignation</th>
                <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-500  scrollbar-custom
              xl:w-[965px] xl:max-h-[calc(100%-80px)]
              className='DrinkStock w-[930px] bg-white max-h-[calc(100%-80px)] 
              fixed overflow-y-scroll overflow-x-hidden scrollbar-custom'">
              {Commandes.map((commande, i) => (
                <tr key={i} className=" text-gray-500 hover:bg-slate-100 ">
                  <td className="py-2 px-2 sm:px-4 border border-y">
                    <input type="checkbox" name="checkbox" id="checkbox" />
                  </td>
                  <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[160px] border border-y">{commande.date}</td>
                  <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[150px] border border-y">{commande.table}</td>
                  <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[150px] border border-y">{commande.chambre}</td>
                  <td className="py-2 px-2 sm:px-4 w-[300px] sm:w-[360px] border border-y">{commande.designation}</td>
                  <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] border border-y flex flex-row gap-2 justify-end">
                    <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
                      <FaRegEdit />
                    </button>
                    <button className="bg-red-500 text-white rounded p-2 hover:bg-red-600">
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Commande;
