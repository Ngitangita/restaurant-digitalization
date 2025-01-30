import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { formatToFourDigits } from "../../services/formatToFourDigits.js";

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

  const generatePDF = () => {
    if (!invoices || !invoices.orders) return;

    const doc = new jsPDF({
      unit: "mm",
      format: [80, 120], // Format proche d'un ticket de caisse
    });

    const marginLeft = 5;
    let startY = 10;

    doc.setFontSize(10);
    doc.text("UTOPIA", marginLeft, startY);
    doc.setFontSize(8);
    doc.text("By Sooatel", marginLeft, (startY += 4));
    doc.text("Ankasina Antananarivo", marginLeft, (startY += 4));
    doc.text("Tel: 038 96 373 43", marginLeft, (startY += 4));

    doc.setFontSize(12);
    doc.text("FACTURE", 40, (startY += 6), { align: "center" });

    const currentDate = dayjs().format("DD/MM/YYYY HH:mm:ss");
    doc.setFontSize(8);
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

    // Ligne séparatrice
    doc.line(marginLeft, (startY += 4), 75, startY);

    // Affichage des commandes
    invoices.orders.forEach((order) => {
      doc.text(
        `Article: ${order.menu.name}`,
        marginLeft,
        (startY += 5)
      );
      doc.text(
        `Qté:${order.quantity}x`,
        marginLeft,
        (startY += 5)
      );
      doc.text(
        `Prix:${order.cost.toFixed(2)} MGA`,
        marginLeft,
        (startY += 5)
      );
    });

    doc.line(marginLeft, (startY += 6), 75, startY);

    const totalAmount = invoices.orders
      .reduce((sum, order) => sum + order.cost, 0)
      .toFixed(2);
    doc.text(`Montant total: ${totalAmount} MGA`, marginLeft, (startY += 6));

    doc.text("Le responsable", marginLeft, (startY += 10));
    doc.text("Le client", 60, startY);

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
            body { font-family: Arial, sans-serif; text-align: left; padding-left: 10px;}
            h2 { margin: 0px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
           span{padding: 5px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>UTOPIA</h2>
          <p>By Sooatel<br/>Ankasina Antananarivo<br/>Tel: 038 96 373 43</p>
          <hr/>
          <h3>FACTURE</h3>
          <p>Date: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}</p>
          <p>Facture: ${formatToFourDigits(invoices?.payment?.id || 0)}</p>
          <p>Paiement: ${invoices?.payment.paymentMethod || "Non spécifié"}</p>
          <hr/>
          <table>
            ${invoices.orders
              .map(
                (order) =>
                  `<p>Article: ${order.menu.name}</p>
                <p>Qté: ${order.quantity}</p><p>Prix: ${order.cost.toFixed(
                    2
                  )} MGA</p>`
              )
              .join("")}
          </table>
          <hr/>
          <h4>Montant total: ${invoices.orders
            .reduce((sum, order) => sum + order.cost, 0)
            .toFixed(2)} MGA</h4>
          <p>Le responsable --------- Le client</p>
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
      <div className="w-full bg-white rounded p-5 flex flex-col gap-5">
        <h3 className="text-lg font-semibold text-center">Facture</h3>

        {isLoading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && invoices && (
          <div className="flex flex-col gap-6">
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
        )}
      </div>
    </div>
  );
};

export default Invoices;
