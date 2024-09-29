import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Notifications } from "../../components/settings/Notifications";
import { UpdatePassword } from "../../components/settings/UpdatePassword";

export default function Settings() {
  return (
     <div className="w-[970px] flex flex-col gap-4">
      <Notifications/> 
      <UpdatePassword/>
     </div>
  )
}
