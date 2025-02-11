import React, { Fragment, useEffect, useState } from "react";
import { BiSolidShow } from "react-icons/bi";
import { apiUrl, fetchJson } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MdAddBox, MdInfoOutline, MdPayment } from "react-icons/md";
import CreateMenuOrder from "../../components/menus/menu-orders/CreateMenuOrder";
import { convertType } from "../../services/convertType";
import { convertStatusToPayment } from "../../services/convertStatus.js";
import { convertMethodToPayment } from "../../services/convertMethodToPayment.js";
import { formatPriceInAriary } from "../../services/formatePrice.js";
import CreatePaymentAfterOrder from "../../components/menus/menu-orders/CreatePaymentAfterOrder.jsx";
import Invoices from "../invoices/Invoices.jsx";

function OrderSummary() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [isGenerateInvoice, setIsGenerateInvoice] = useState(false)
  const [paymentId, setPaymentId] = useState(null)
  const [t, setT] = useState(null)
  const [n, setN] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    void fetchApi();
  }, []);

  const fetchApi = async () => {
    const url = apiUrl("/menu-orders/grouped");
    try {
      const data = await fetchJson(url);
      const orderData = groupByPaymentId(data);    
      setOrders(orderData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (order) => {
    navigate(
      `/orders/by-${order.type.toLowerCase() === "table" ? "table" : "room"}/${order.number
      }`
    );
  };

  const handlePayment = () => {
    navigate("/payments");
  };

  const handleCreatePayment = (type, number) => {
    setIsPayment(true)
    setT(type)
    setN(number)
  }

  function groupByPaymentId(data) {
    const nullPayments = data.filter(item => item.payment === null);
    const nonNullPayments = data.filter(item => item.payment !== null);

    const grouped = nonNullPayments.reduce((acc, item) => {
      const key = `${item.type}_${item.number}`;

      if (!acc[key]) {
        acc[key] = {
          type: item.type,
          number: item.number,
          totalAmount: 0,
          menus: [],
          orderStatus: item.orderStatus,
          payment: item.payment
        };
      }

      acc[key].totalAmount += item.payment.amount;
      acc[key].menus = [...new Set([...acc[key].menus, ...item.menus])];

      return acc;
    }, {});

    const groupedArray = Object.values(grouped);

    return [...nullPayments, ...groupedArray];
  }

  return (
    <div className="container bg-white darkBody mx-auto pl-10 pb-14 pr-10">
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
            <th className="py-2 px-4"></th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Numero</th>
            <th className="py-2 px-4">Menus</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders
              .toSorted((a, b) => a.id - b.id)
              .map((order, i) => (
                <Fragment key={i}>
                  {order.payment === null ? (
                    <tr>
                      <td colSpan="6" className="py-1 text-gray-500">
                        <div className="flex justify-between gap-64 mx-4 mr-[calc(5rem+2px)] items-center">
                          <p className="text-sm font-semibold text-yellow-600">
                            Pas de facture
                          </p>

                          <p className="text-sm text-center font-semibold text-yellow-600 mr-auto">
                            <span className="ml-2 text-sm text-yellow-600">
                              Non définie
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr className="border-gray-200">
                      <td colSpan="6" className="py-2 text-gray-500">
                        <div className="flex justify-between items-center mx-4 mr-[calc(5rem+2px)]">
                          <p className="text-sm font-semibold text-green-600 mr-auto">
                            <span>{convertStatusToPayment(order.payment.status)}</span>
                          </p>

                          <p className="text-sm font-semibold text-green-600 mr-auto">
                            <span className="ml-2 text-sm text-gray-600">
                              {convertMethodToPayment(order.payment.paymentMethod)}
                            </span>
                          </p>

                          <p className="text-sm font-semibold text-green-600 mr-auto">
                            <span className="ml-2 text-sm text-gray-600">
                              {formatPriceInAriary(order.payment.amount)}
                            </span>
                          </p>

                        </div>
                      </td>
                    </tr>

                  )}

                  <tr className="border-gray-200 border-b">
                    <td className="py-2 px-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          className="w-3 h-3 accent-blue-500"
                        />
                      </label>
                    </td>

                    <td className="py-2 px-4">
                      {convertType(order.type)}
                    </td>
                    <td className="py-2 px-4">{order.number}</td>
                    <td className="py-2 px-2">
                      {order.menus.map((m) => m.toLowerCase()).join(", ")}
                    </td>
                    <td className="py-2 px-4 flex flex-row justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                        onClick={() => handleClick(order)}
                      >
                        <BiSolidShow />
                      </button>

                      {order.payment === null ? (
                        <button
                          className="bg-yellow-500 text-white px-2 py-2 rounded-lg hover:bg-yellow-600"
                          onClick={() => handleCreatePayment(order.type, order.number)}
                        >
                          <MdPayment color="white" />
                        </button>
                      ) : <>
                        {String(order.payment.status).toLowerCase() === 'unpaid' && (
                          <button
                            className="bg-yellow-500  text-white px-2 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                            onClick={() => handleCreatePayment(order.type, order.number)}
                          >
                            <MdPayment color="white" className="text-lg" />
                          </button>
                        )}

                      </>}
                    </td>
                  </tr>
                </Fragment>

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


      {isGenerateInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl EditModal relative">
            <span className='hover:bg-red-500 px-5  flex text-center justify-between items-center
                                  absolute top-0  right-0 rounded text-[30px] hover:text-white cursor-pointer'
              onClick={() => setIsGenerateInvoice(false)}>
              x
            </span>
            <Invoices
              paymentId={paymentId}
            />
          </div>
        </div>
      )}

      {isPayment && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="relative top-6 bg-white rounded-lg shadow-lg w-full max-w-md EditModal">
            <span
              className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[408px] text-[30px] hover:text-white cursor-pointer"
              onClick={() => setIsPayment(false)}
            >
              x
            </span>
            <CreatePaymentAfterOrder
              number={n}
              type={t}
              onCancel={() => {
                setIsPayment(false);
                setT(null)
                setN(null)
              }}
              onSuccess={(id) => {
                setPaymentId(id)
                setIsGenerateInvoice(true)
                void fetchApi()
                setIsPayment(false);
                setT(null)
                setN(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummary;
