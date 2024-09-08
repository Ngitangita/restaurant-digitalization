import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

function Commande() {
 
  const Commands = [
    { date: "06/09/2024", table: "5", chambre: "102", quantity: "02", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "105", quantity: "01", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "103", quantity: "03", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "102", quantity: "02", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "105", quantity: "01", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "103", quantity: "03", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "102", quantity: "02", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "105", quantity: "01", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "103", quantity: "03", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "102", quantity: "02", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "105", quantity: "01", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "103", quantity: "03", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "102", quantity: "02", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "105", quantity: "01", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "103", quantity: "03", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "102", quantity: "02", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "105", quantity: "01", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "103", quantity: "03", designation: "Pomme frite" },
    { date: "06/09/2024", table: "5", chambre: "102", quantity: "02", designation: "Pizza" },
    { date: "12/09/2024", table: "2", chambre: "105", quantity: "01", designation: "Akoho gasy rony" },
    { date: "03/03/2024", table: "8", chambre: "103", quantity: "03", designation: "Pomme frite" },
  ];

  return (
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Gestion des commandes" />
      
      <table className="min-w-full bg-white border border-gray-300">
        <thead className='text-center text-gray-500'>
          <tr className="bg-gray-300">
            <th className="py-2 px-4 border border-y">Date & heure</th>
            <th className="py-2 px-4 border border-y">N° de table</th>
            <th className="py-2 px-4 border border-y">Chambre</th>
            <th className="py-2 px-4 border border-y">Quantités</th>
            <th className="py-2 px-4 border border-y">Désignation</th>
          </tr>
        </thead>
        <tbody className='text-center w-[930px] bg-white max-h-[calc(100%-80px)] fixed
        overflow-y-scroll overflow-x-hidden scrollbar-custom'>
          {Commands.map((Command, i) => (
            <tr key={i} className="border border-x text-gray-500">
              <td className="py-2 px-4 w-[200px]">{Command.date}</td>
              <td className="py-2 px-4 w-[200px]">{Command.table}</td>
              <td className="py-2 px-4 w-[200px]">{Command.chambre}</td>
              <td className="py-2 px-4 w-[200px]">{Command.quantity}</td>
              <td className="py-2 px-4 w-[200px]">{Command.designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Commande;


