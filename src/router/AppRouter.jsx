
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/home/Home";
import TheCalendar from "../pages/calendar/Calendar";
import Authentification from "../pages/Authentification/Authentification";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";
import Commande from "../pages/commandes/ListDesCommandes";
import BonDeCommandes from "../pages/commandes/BonDeCommandes";
import { useAuthStore } from '../stores/useAuthStore';
import { useThemeStore } from "../stores/useThemeStore";
import Ingredients from "../components/ingredients/Ingredients";
import Layout from "../components/layouts/Layout";
import ReservationList from "../pages/reservations/Reservation";
import CreateReservation from "../components/createReservation/CreateReservation";
import Stocks from "../pages/Stocks/Stocks";
import MenuList from "../components/gestionDesMenus/MenuList";
import CategoriesList from "../components/categories/Categories";
import TablesListe from "../components/tables/TablesListe";

function ProtectedRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/authentification" />;
}


function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
  }, [isDark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authentification" element={
          <Layout showHeaderAndSidebar={false}>
            <Authentification onAuth={(data) => {
              setIsAuthenticated(true)
              console.log(data);
              
            }} />
          </Layout>
        } />
        <Route path="/" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<Home />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/ingredients" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<Ingredients />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
         <Route path="/menuList" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<MenuList />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/categoriesListe" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<CategoriesList />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
         <Route path="/tableList" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<TablesListe/>} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/bonDeCommandes" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<BonDeCommandes />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/calendar" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<TheCalendar />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/commandes" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<Commande />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/reservations" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<ReservationList />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
         <Route path="/reservations/create" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<CreateReservation />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/stocks" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<Stocks />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<Settings />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/*" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <NotFound />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;