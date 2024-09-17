import Boutton from '../../components/Boutton/Boutton';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SearchBox from '../../components/searchBox/SearchBox';

function Commande() {

  const Commands = [
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
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="List des commandes réçu" />
      <SearchBox />
      <table className="min-w-full bg-white border border-gray-300">
        <thead className='text-center text-gray-500'>
          <tr className="bg-gray-300">
            <th className="py-2 px-4  border border-y">
              <input type="checkbox" name="checkbox" id="checkbox" />
            </th>
            <th className="py-2 px-4 w-[150px]">Date & heure</th>
            <th className="py-2 px-4 w-[150px] ">N° de table</th>
            <th className="py-2 px-4 w-[150px]">Chambre</th>
            <th className="py-2 px-4 w-[350px]">Désignation</th>
            <th className="py-2 px-4 w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody className='text-center w-[930px] bg-white max-h-[calc(100%-80px)] fixed
        overflow-y-scroll overflow-x-hidden scrollbar-custom'>
          {Commands.map((Command, i) => (
            <tr key={i} className="border text-gray-500 hover:bg-slate-100">
              <td className="py-2 px-4  border border-y">
                <input type="checkbox" name="checkbox" id="checkbox" />
              </td>
              <td className="py-2 px-4 w-[160px]  border border-y">{Command.date}</td>
              <td className="py-2 px-4 w-[150px]  border border-y">{Command.table}</td>
              <td className="py-2 px-4 w-[150px]  border border-y">{Command.chambre}</td>
              <td className="py-2 px-4 w-[360px]  border border-y">{Command.designation}</td>
              <td className="py-2 px-4 w-[120px]  border border-y flex flex-row gap-2 justify-end ">
                <Boutton className="bg-green-500 rounded p-1">
                  édite
                </Boutton>
                <Boutton className="bg-red-500 rounded p-1">
                  supr
                </Boutton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Commande;


