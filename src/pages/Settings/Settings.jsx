import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Notifications } from "../../components/settings/Notifications";
import { UpdatePassword } from "../../components/settings/UpdatePassword";

export default function Settings() {
  return (
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Settings" />

     <div className="flex flex-col gap-4">
      <Notifications/> 
      <UpdatePassword/>
     </div>
    </div>
  )
}
