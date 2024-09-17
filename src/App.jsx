import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import TheCalendar from "./pages/calendar/Calendar";
import Reservation from "./pages/reservations/Reservation";
import Authentification from "./pages/Authentification/Authentification";
import DrinkStock from "./pages/Stocks/DrinkStock";
import IngredientStock from "./pages/Stocks/IngredientStock";
import FoodStock from "./pages/Stocks/FoodStock";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";
import Commande from "./pages/commandes/ListDesCommandes";
import BonDeCommandes from "./pages/commandes/BonDeCommandes";

function ProtectedRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/authentification" />;
}

function Layout({ children, showHeaderAndSidebar }) {
  return (
    <div className="flex">
      {showHeaderAndSidebar && (
        <>
          <Header />
          <Sidebar />
        </>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authentification" element={
          <Layout showHeaderAndSidebar={false}>
            <Authentification onAuth={() => setIsAuthenticated(true)} />
          </Layout>
        } />
        <Route path="/" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<Home />} isAuthenticated={isAuthenticated} />
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
            <ProtectedRoute element={<Reservation />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/drinkStocks" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<DrinkStock />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/ingredientStocks" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<IngredientStock />} isAuthenticated={isAuthenticated} />
          </Layout>
        } />
        <Route path="/foodStocks" element={
          <Layout showHeaderAndSidebar={isAuthenticated}>
            <ProtectedRoute element={<FoodStock />} isAuthenticated={isAuthenticated} />
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
