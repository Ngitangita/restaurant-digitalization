import AccountDetails from "../../components/Account/AccountDetails";
import AccountInfo from "../../components/Account/AccountInfo";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

export default function Profile() {
  return (
    <div className="pl-10 relative w-[970px] left-[250px] top-[100px]">
      <Breadcrumb pageName="Profile" />
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <AccountInfo />
        </div>
        <div className="lg:col-span-8">
          <AccountDetails />
        </div>
      </div>
    </div>
  )
}
