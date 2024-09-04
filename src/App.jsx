
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import TheCalendar from "./pages/calendar/Calendar";
import Reservation from "./pages/reservations/Reservation";
import Categories from "./pages/categories/Categories";
import Commande from "./pages/commandes/commande";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/calendar" element={<TheCalendar />} />
            <Route path="/commandes" element={<Commande />} />
            <Route path="/reservations" element={<Reservation />} />
            {/* <Route path="/login" element={<CheckoutForm />} /> */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

