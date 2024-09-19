import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CreateJournal from "../../components/journal/CreatJournal";
import CreateCategorie from "../../components/addCategorie/CreateCategorie";

export default function Home() {

  return (
    <div className="pl-10 relative w-full max-w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Accueil" />

      <div className="w-full max-w-[930px] h-full flex flex-row flex-wrap gap-7
        max-h-[calc(100%-80px)] fixed
        overflow-y-scroll overflow-x-hidden scrollbar-custom text-gray-500">
        
        <div className="w-full max-w-[220px] p-3 rounded bg-white">
          <div className="relative h-32">
            <img src="../public/img-3.jpg" alt="Salade Fraicheur" className="w-full h-full rounded object-cover" />
          </div>
          <h2 className="font-bold text-center mt-2">Salade Fraicheur</h2>
          <h4 className="text-center">8.000 Ar</h4>
          <div className="flex flex-row justify-between mt-2">
            <Link to="#">
              <button className="bg-blue-500 text-white rounded p-1 w-full">
                Achetez
              </button>
            </Link>
            <button className="bg-green-500 text-white rounded p-1 w-full">
              Voir plus
            </button>
          </div>
        </div>

        <CreateJournal />
        <CreateCategorie />
      </div>
    </div>
  );
}
