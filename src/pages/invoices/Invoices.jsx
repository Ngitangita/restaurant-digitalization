import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api.js";
import { jsPDF } from "jspdf";
import dayjs from "dayjs";
import { formatToFourDigits } from "../../services/formatToFourDigits.js";
import { convertMethodToPayment } from "../../services/convertMethodToPayment.js";
import { convertStatusToPayment } from "../../services/convertStatus.js";

const Invoices = ({ paymentId }) => {
  const [invoices, setInvoices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setIsLoading(true);
      try {
        setInvoices(await fetchJson(apiUrl(`/invoices/${paymentId}`)));
      } catch (err) {
        console.error(err);
        setError("Erreur récupération factures.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoiceData();
  }, [paymentId]);

  const currentDate = dayjs().format("DD/MM/YYYY HH:mm:ss");

  const groupOrders = () => {
    if (!invoices?.orders) return [];

    const map = {};
    invoices.orders.forEach(o => {
      const key = `${o.type}_${o.table?.number ?? o.room?.roomNumber}`;
      (map[key] ||= []).push(o);
    });

    return Object.values(map).map(group => {
      const paid = group.filter(o => o.payment?.status?.toUpperCase() === "PAID");
      const unpaid = group.filter(o => o.payment?.status?.toUpperCase() !== "PAID");

      if (paid.length === 0) {
        return unpaid;
      } else if (unpaid.length > 0) {
        const lastMinuteTS = dayjs(group.sort((a,b) => new Date(b.orderDate)-new Date(a.orderDate))[0].orderDate)
                                .format("YYYY-MM-DD HH:mm");
        return unpaid.filter(o => dayjs(o.orderDate).format("YYYY-MM-DD HH:mm") === lastMinuteTS);
      } else {
        const sorted = [...paid].sort((a, b) =>
          new Date(b.payment.updatedAt || b.payment.createdAt) - new Date(a.payment.updatedAt || a.payment.createdAt)
        );
        const latestTS = dayjs(sorted[0].payment.updatedAt || sorted[0].payment.createdAt)
                           .format("YYYY-MM-DD HH:mm");
        return sorted.filter(o =>
          dayjs(o.payment.updatedAt || o.payment.createdAt).format("YYYY-MM-DD HH:mm") === latestTS
        );
      }
    });
  };

  const grouped = groupOrders();
  const lastGroup = grouped[grouped.length - 1] || [];
  const lastOrder = lastGroup[lastGroup.length - 1] || null;

  const totalAmount = lastGroup.reduce(
    (sum, o) => sum + (o.payment?.amount || (o.cost ?? o.quantity * o.menu.price)),
    0
  );

  const roomNumbersString = Array.from(new Set(invoices?.orders?.map(o => o.room?.roomNumber).filter(Boolean))).join("-");
  const tableNumbersString = Array.from(new Set(invoices?.orders?.map(o => o.table?.number).filter(Boolean))).join("-");

  const generatePDF = () => {
    if (!lastOrder) return;
    const doc = new jsPDF({ unit: "mm", format: [80, 140] });
    let y = 10, m = 5;

    doc.setFontSize(6);
    ["UTOPIA", "By Sooatel", "Ankasina Antananarivo", "Tel: 038 42 779 74"].forEach(line => {
      doc.text(line, m, y);
      y += 4;
    });

    doc.setFontSize(8);
    doc.text("FACTURE", 40, y += 6, { align: "center" });
    doc.setFontSize(6);
    [
      `Date: ${currentDate}`,
      `Facture: ${formatToFourDigits(invoices?.payment?.id || 0)}`,
      `Méthode: ${convertMethodToPayment(invoices?.payment.paymentMethod) || "Non spécifié"}`,
      `Statut: ${convertStatusToPayment(invoices?.payment.status) || "Non spécifié"}`,
      `Table: ${tableNumbersString || "___"}`,
      `Chambre: ${roomNumbersString || "___"}`
    ].forEach(line => {
      doc.text(line, m, y += 4);
    });

    doc.line(m, y += 4, 75, y);
    lastGroup.forEach(o => {
      doc.text(`Item: ${o.menu.name}`, m, y += 5);
      doc.text(`Qté: x${o.quantity}`, m, y += 5);
      doc.text(`Prix: ${o.cost.toFixed(2)} MGA`, m, y += 5);
      doc.line(m, y += 4, 75, y);
    });

    doc.setFontSize(7);
    doc.text(`Montant total: ${totalAmount.toFixed(2)} MGA`, m, y += 6);
    doc.setFontSize(6);
    doc.text("Merci et à bientôt!", m, y += 8);

    doc.save("facture.pdf");
  };

  const printInvoice = () => {
    if (!lastOrder) return;
    const html = `
      <html><head><title>Facture</title><style>
        body {font-family:Arial;font-size:10px;padding:10px;}
        table {width:100%;border-collapse:collapse;margin-top:10px;}
        th,td {border:1px solid #ccc;padding:4px;}
      </style></head><body>
        <h2>UTOPIA</h2><p>By Sooatel, Antananarivo, Tel:0384277974</p><hr/>
        <h3>FACTURE</h3>
        <p>Date: ${currentDate}</p>
        <p>Facture: ${formatToFourDigits(invoices?.payment?.id || 0)}</p>
        <p>Derniére commande: ${dayjs(lastOrder.orderDate).format("DD/MM/YYYY HH:mm:ss")}</p>
        <p>Méthode: ${convertMethodToPayment(invoices?.payment.paymentMethod) || "Non spécifié"}</p>
        <p>Statut: ${convertStatusToPayment(invoices?.payment.status)}</p>
        <p>Table: ${tableNumbersString || "___"}</p>
        <p>Chambre: ${roomNumbersString || "___"}</p>
        <table><thead>
          <tr><th>Article</th><th>Qté</th><th>Prix U</th><th>Total</th></tr>
        </thead><tbody>
          ${lastGroup.map(o => `
            <tr>
              <td>${o.menu.name}</td>
              <td>${o.quantity}</td>
              <td>${o.menu.price}</td>
              <td>${o.cost.toFixed(2)}</td>
            </tr>`).join("")}
        </tbody></table>
        <h4>Montant total: ${totalAmount.toFixed(2)} MGA</h4>
        <p>Merci et à bientôt!</p>
        <script>
          window.onload = ()=> { window.print(); window.onafterprint = ()=> window.close(); };
        </script>
      </body></html>
    `;
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full bg-white rounded p-5 flex flex-col gap-5 h-[550px] overflow-y-auto">
        {isLoading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {lastOrder && !isLoading && !error && (
          <>
            {/* Header entreprise */}
            <div className="flex items-center gap-3 mb-4">
              <img src="/UTOPIA-B.png" alt="UTOPIA" className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold">By Sooatel</h2>
                <p className="text-xs">Ankasina Antananarivo<br/>Tel: 038 42 779 74</p>
              </div>
            </div>
            <h1 className="text-center text-2xl font-bold underline">Facture</h1>

            <ul className="my-4 space-y-1">
              <li>Date: {currentDate}</li>
              <li>Dernière commande: {dayjs(lastOrder.orderDate).format("DD/MM/YYYY HH:mm:ss")}</li>
              <li>Facture: {formatToFourDigits(invoices?.payment?.id || 0)}</li>
              <li>Méthode paiement: {convertMethodToPayment(invoices?.payment.paymentMethod)}</li>
              <li>Statut: {convertStatusToPayment(invoices?.payment.status)}</li>
              <li>Table: {tableNumbersString || "___"}</li>
              <li>Chambre: {roomNumbersString || "___"}</li>
            </ul>

            <table className="w-full text-sm border border-gray-200 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Article</th>
                  <th className="border px-2 py-1">Qté</th>
                  <th className="border px-2 py-1">Prix U</th>
                  <th className="border px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {lastGroup.map((o,i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{o.menu.name}</td>
                    <td className="border px-2 py-1">{o.quantity}</td>
                    <td className="border px-2 py-1">{o.menu.price}</td>
                    <td className="border px-2 py-1">{o.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-semibold mb-4">
              Montant total: {totalAmount.toFixed(2)} MGA
            </div>

            <div className="flex justify-between gap-4">
              <button onClick={generatePDF} className="bg-blue-500 text-white px-4 py-2 rounded">
                Télécharger PDF
              </button>
              <button onClick={printInvoice} className="bg-green-500 text-white px-4 py-2 rounded">
                Imprimer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoices;
