import {BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom";
import {useEffect} from "react";
import Home from "../pages/home/Home";
import TheCalendar from "../pages/calendar/Calendar";
import Authentication from "../pages/Authentification/Authentication.jsx";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";
import {useAuthStore} from '../stores/useAuthStore';
import {useThemeStore} from "../stores/useThemeStore";
import Ingredients from "../components/ingredients/Ingredients";
import Layout from "../components/layouts/Layout";
import ReservationList from "../pages/reservations/Reservation";
import Stocks from "../pages/Stocks/Stocks";
import MenuList from "../components/gestionDesMenus/MenuList";
import CategoriesList from "../components/categories/Categories";
import TablesList from "../components/tables/TablesList.jsx";
import MenuWithIngredients from "../components/gestionDesMenus/menuIngredients/MenuWithIngredients";
import PurchaseList from "../pages/Stocks/PurchaseList";
import RoomList from "../components/room/RoomList";
import FloorList from "../components/floor/FloorList";
import MenuOrdersList from "../components/gestionDesMenus/menuOrder/MenuOrdersList";
import UnitsList from "../components/units/UnitsList.jsx";
import {ToastContainer} from "react-toastify";

function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <Outlet/> : <Navigate to="/authentification"/>;
}

function AppRouter() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isDark = useThemeStore((state) => state.isDark);

    useEffect(() => {
        document.body.classList.toggle("dark", isDark);
        document.body.classList.toggle("light", !isDark);
    }, [isDark]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/authentification" element={<Layout showHeaderAndSidebar={false}/>}>
                    <Route index element={<Authentication/>}/>
                </Route>

                <Route path="/" element={<ProtectedRoute/>}>
                    <Route element={<Layout showHeaderAndSidebar={isAuthenticated}/>}>
                        <Route index element={<Home/>}/>
                        <Route path="ingredients" element={<Ingredients/>}/>
                        <Route path="menuList" element={<MenuList/>}/>
                        <Route path="units" element={<UnitsList/>}/>
                        <Route path="menu-ingredients/menu/:menuId" element={<MenuWithIngredients/>}/>
                        <Route path="categoriesListe" element={<CategoriesList/>}/>
                        <Route path="roomList" element={<RoomList/>}/>
                        <Route path="tableList" element={<TablesList/>}/>
                        <Route path="floorList" element={<FloorList/>}/>
                        <Route path="calendar" element={<TheCalendar/>}/>
                        <Route path="commandes" element={<MenuOrdersList/>}/>
                        <Route path="reservations" element={<ReservationList/>}/>
                        <Route path="stocks" element={<Stocks/>}/>
                        <Route path="PurchaseList" element={<PurchaseList/>}/>
                        <Route path="settings" element={<Settings/>}/>
                        <Route path="*" element={ <NotFound/>}/>
                    </Route>
                </Route>
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default AppRouter;
