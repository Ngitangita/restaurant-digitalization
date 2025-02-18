import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { formatToFourDigits } from "../../services/formatToFourDigits.js";
import { convertStatusToPayment } from "../../services/convertStatus.js";

const Invoices = ({ paymentId }) => {
  const [invoices, setInvoices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchJson(apiUrl(`/invoices/${paymentId}`));
        setInvoices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des factures:", error);
        setError("Erreur lors de la récupération des factures.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [paymentId]);

  const currentDate = dayjs().format("DD/MM/YYYY HH:mm:ss");
  const roomNumbersString = [
    ...new Set(
      invoices?.orders
        ?.filter((o) => o.room != null)
        .map((o) => o.room.roomNumber)
    ),
  ].join("-");

  const tableNumbersString = [
    ...new Set(
      invoices?.orders
        ?.filter((o) => o.table != null)
        .map((o) => o.table.number)
    ),
  ].join("-");

  const generatePDF = () => {
    if (!invoices || !invoices.orders) return;

    const doc = new jsPDF({
      unit: "mm",
      format: [80, 120],
    });

    const marginLeft = 5;
    let startY = 10;

    doc.setFontSize(5);
    doc.text("UTOPIA", marginLeft, startY);
    doc.setFontSize(5);
    doc.text("By Sooatel", marginLeft, (startY += 4));
    doc.text("Ankasina Antananarivo", marginLeft, (startY += 4));
    doc.text("Tel: 038 42 779 74", marginLeft, (startY += 4));

    doc.setFontSize(5);
    doc.text("FACTURE", 40, (startY += 6), { align: "center" });

    doc.setFontSize(5);
    doc.text(`Date: ${currentDate}`, marginLeft, (startY += 6));
    doc.text(
      `Facture: ${formatToFourDigits(invoices?.payment?.id || 0)}`,
      marginLeft,
      (startY += 4)
    );
    doc.text(
      `Paiement: ${invoices?.payment.paymentMethod || "Non spécifié"}`,
      marginLeft,
      (startY += 4)
    );

    doc.line(marginLeft, (startY += 4), 75, startY);

    invoices.orders.forEach((order) => {
      doc.text(`Article: ${order.menu.name}`, marginLeft, (startY += 5));
      doc.text(`Qté: x${order.quantity}`, marginLeft, (startY += 5));
      doc.text(`Prix:${order.cost.toFixed(2)} MGA`, marginLeft, (startY += 5));
    });

    doc.line(marginLeft, (startY += 6), 75, startY);

    const totalAmount = invoices.orders
      .reduce((sum, order) => sum + order.cost, 0)
      .toFixed(2);
    doc.text(`Montant total: ${totalAmount} MGA`, marginLeft, (startY += 6));

    doc.save("facture.pdf");
  };

  const printInvoice = () => {
    if (!invoices || !invoices.orders) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; text-align: left; padding-left: 10px;}
            h2 { margin: 0px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
           span{padding: 5px; text-align: left; }
          
          </style>
        </head>
        <body>
          <h2>UTOPIA</h2>
          <p>By Sooatel<br/>Ankasina Antananarivo<br/>Tel: 038 42 779 74</p>
          <hr/>
          <h3>FACTURE</h3>
          <p>Date: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}</p>
          <p>Facture: ${formatToFourDigits(invoices?.payment?.id || 0)}</p>
          <p> N° de la table: ${tableNumbersString || "___"}</p>
          <p> N° de la chambre: ${roomNumbersString || "___"}</p>
          <p>Paiement méthod: ${invoices?.payment.paymentMethod || "Non spécifié"}</p>
          <p>Paiement status: ${invoices?.payment.status || "Non spécifié"}</p>
          <hr/>
          <table>
            ${invoices.orders
              .map(
                (order) =>
                  `<p>${order.menu.name} - x${
                    order.quantity
                  } - ${order.cost.toFixed(2)} MGA`
              )
              .join("")}
          </table>
          <hr/>
          <h4>Montant total: ${invoices.orders
            .reduce((sum, order) => sum + order.cost, 0)
            .toFixed(2)} MGA</h4>
            <p>Utopia vous remercie et à très bientôt! </p>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="w-full bg-white rounded p-5 flex flex-col gap-5 
      h-[550px] overflow-y-auto scrollbar-custom"
      >
        {isLoading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && invoices && (
          <div>
            <div>
              <div>
                <div className="flex flex-col gap-2 ">
                  <div className="flex flex-row gap-3 items-center">
                    <img
                      src="/UTOPIA-B.png"
                      alt="UTOPIA-B"
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">By Sooatel</span>
                      <span className="text-xs">
                        Ankasina Antananarivo <br /> Tel: 038 42 779 74
                      </span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold underline text-center">
                    Facture
                  </h1>
                </div>
                <div className="flex flex-col mb-6">
                  <div className="flex flex-row mt-6 justify-between">
                    <div>
                      <ul className="list-inside">
                        <li className="py-1 px-4">Date: {currentDate}</li>
                        <li className="py-1 px-4">
                          Numéro de facture:{" "}
                          {formatToFourDigits(invoices?.payment?.id || 0)}
                        </li>
                        <li className="py-1 px-4">
                          Mode de paiement:{" "}
                          {invoices?.payment?.paymentMethod || "Non spécifié"}
                        </li>
                        <li className="py-1 px-4">
                          Status paiement:{" "}
                          {convertStatusToPayment(
                            invoices?.payment?.status
                          )}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul>
                        <li className="py-1 px-4">
                          N° de la table: {tableNumbersString || "___"}
                        </li>
                        <li className="py-1 px-4">
                          N° de la chambre: {roomNumbersString || "___"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <p>Chargement des factures...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : invoices?.orders?.length > 0 ? (
                <table className="w-full border border-gray-200 text-left text-sm ">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Date de commande</th>
                      <th className="py-2 px-4 border">Numéro de Commande</th>
                      <th className="py-2 px-4 border">Désignation</th>
                      <th className="py-2 px-4 border">Quantité</th>
                      <th className="py-2 px-4 border">Prix U</th>
                      <th className="py-2 px-4 border">Montant</th>
                    </tr>
                  </thead>
                  <tbody className=" overflow-y-scroll">
                    {invoices.orders.map((invoice, i) => (
                      <tr key={i}>
                        <td className="py-2 px-4 border">
                          {dayjs(invoice?.orderDate).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </td>
                        <td className="py-2 px-4 border">
                          {formatToFourDigits(invoice?.id ?? 0)}
                        </td>
                        <td className="py-2 px-4 border">
                          {invoice.menu.name}
                        </td>
                        <td className="py-2 px-4 border">{invoice.quantity}</td>
                        <td className="py-2 px-4 border">
                          {invoice.menu.price} MGA
                        </td>
                        <td className="py-2 px-4 border">{invoice.cost} MGA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucune facture disponible.</p>
              )}
            </div>
            <div className="flex flex-col gap-6 pt-5">
              <div className="flex flex-col gap-2">
                <span>
                  Montant total:{" "}
                  {invoices?.orders
                    ?.reduce((sum, invoice) => sum + invoice.cost, 0)
                    .toFixed(2) || "0.00"}{" "}
                  MGA
                </span>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-6 pt-5">
              <button
                onClick={generatePDF}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={!invoices || !invoices.orders}
              >
                Télécharger la Facture PDF
              </button>
              <button
                onClick={printInvoice}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                disabled={!invoices || !invoices.orders}
              >
                Imprimer la Facture
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
