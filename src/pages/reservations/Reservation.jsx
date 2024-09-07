
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CreateFacture from "../../components/createFacture/CreateFacture";
import Recettes from "../../components/recettes/Recettes";


export default function Reservation() {
  return (
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Reservation" />
      <Recettes/>
    <CreateFacture/>
    </div>
  )
}
