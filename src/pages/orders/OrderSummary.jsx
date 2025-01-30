import { useEffect, useState } from "react";
import { BiSolidShow } from "react-icons/bi";
import { apiUrl, fetchJson } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MdAddBox, MdPayment, MdInfoOutline } from "react-icons/md";
import CreateMenuOrder from "../../components/menus/menu-orders/CreateMenuOrder";

function OrderSummary() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    void fetchApi();
  }, []);

  const fetchApi = async () => {
    const url = apiUrl("/menu-orders/grouped");
    try {
      const data = await fetchJson(url);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (order) => {
    navigate(
      `/orders/by-${order.type.toLowerCase() === "table" ? "table" : "room"}/${
        order.number
      }`
    );
  };

  const handlePayment = () => {
    navigate("/payments");
  };


  return (
    <div className="container bg-white darkBody mx-auto pl-10 pb-14">
      <div className="flex flex-row pt-4 w-full fixed bg-white z-50 gap-[550px]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
                        flex flex-row gap-2 items-center"
        >
          <MdAddBox /> Ajouter une commande
        </button>

        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600
                        flex flex-row gap-2 items-center"
          onClick={handlePayment}
        >
          <MdPayment color="white" /> Payer maintenant
        </button>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg text-center relative top-[60px]">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Numero</th>
            <th className="py-2 px-4">Menus</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders
              .toSorted((a, b) => b.id - a.id)
              .map((order, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-2 px-4 flex flex-row">
                  <label
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-500"
                      />
                      <span className="text-gray-800">{order.label}</span>
                    </label>
                  {order.type}</td>
                  <td className="py-2 px-4">{order.number}</td>
                  <td className="py-2 px-4">
                    {order.menus.map((m) => m.toLowerCase()).join(", ")}
                  </td>
                  <td className="py-2 px-4 space-x-4">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                      onClick={() => handleClick(order)}
                    >
                      <BiSolidShow />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr className="text-center">
              <td colSpan="6" className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  Aucune donnée disponible
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className=" mx-auto bg-white rounded CreateModal">
            <div className="flex flex-row justify-between items-center">
              <h2
                className="text-center font-serif font-bold
                                text-xl pl-8 pt-8 pb-4"
              >
                Formulaire de Commande
                <br />
                <span className="text-[10px]">
                  nb : choisir table ou chambre
                </span>
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                                relative bottom-8 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                x
              </span>
            </div>
            <CreateMenuOrder
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onOrderCreated={() => {
                void fetchApi();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummary;
