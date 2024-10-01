import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { useLocation } from 'react-router-dom'

const noMainPath = ["/authentification"];

function Layout({ children, showHeaderAndSidebar }) {
  const location = useLocation();

  if (noMainPath.includes(location.pathname)) {
    return (
      <div className="flex">
        {showHeaderAndSidebar && (
          <>
            <Header />
            <Sidebar />
          </>
        )}

        {children}
      </div>
    );
  }

  return (
    <div className="flex">
      {showHeaderAndSidebar && (
        <>
          <Header />
          <Sidebar />
        </>
      )}
      <main className="
        flex-1 pl-10 relative w-full lg:left-[250px] top-[100px]
        overflow-x-scroll lg:overflow-x-hidden">
        <div className="
          w-full max-w-[980px] h-full flex flex-row flex-wrap gap-7
          max-h-[calc(100%-80px)] fixed 
          overflow-y-scroll overflow-x-hidden scrollbar-custom text-gray-500">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
