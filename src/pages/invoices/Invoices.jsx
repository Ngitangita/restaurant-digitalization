import {useEffect, useState} from "react";
import {apiUrl, fetchJson} from "../../services/api.js";
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import dayjs from "dayjs";
import {formatToFourDigits} from "../../services/formatToFourDigits.js";

const Invoices = ({ paymentId }) => {
    const [invoices, setInvoices] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        void (async () => {
            setIsLoading(true);
            try {
                const data = await fetchJson(apiUrl(`/invoices/${paymentId}`));
                setInvoices(data);
            } catch (error) {
                console.log('Erreur lors de la récupération des unités: ' + error.message);
                setError('Erreur lors de la récupération des unités: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [paymentId]);

    const currentDate = dayjs().format("DD/MM/YYYY HH:mm:ss");


    const roomNumbersString = [
        ...new Set(
            invoices?.orders
                ?.filter(o => o.room != null)
                .map(o => o.room.roomNumber)
        ),
    ].join('-');

    const tableNumbersString = [
        ...new Set(
            invoices?.orders
                ?.filter(o => o.table != null)
                .map(o => o.table.number)
        ),
    ].join('-');

    const generatePDF = () => {
        if (!invoices || !invoices.orders) return;

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("UTOPIA", 14, 10);
        doc.setFontSize(12);
        doc.text("By Sooatel", 14, 20);
        doc.text("Ankasina Antananarivo", 14, 26);
        doc.text("Tel: 038 96 373 43", 14, 32);

        doc.setFontSize(14);
        doc.text("FACTURE", 105, 40, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, 14, 50);

        doc.text(`Numéro de facture: ${formatToFourDigits(invoices?.payment?.id || 0)}`, 14, 56);
        doc.text(`Mode de paiement: ${invoices?.payment.paymentMethod || 'Non spécifié'}`, 14, 62);

        const rightTextX = doc.internal.pageSize.width - 14;

        doc.text("N° de table: " + (tableNumbersString || '___'), rightTextX,  56, {align: 'right'});
        doc.text("N° chambre: " + (roomNumbersString || '___'), rightTextX, 62, { align: "right" });


        const tableColumnHeaders = ["Qtés", "Désignation", "P.U.", "Montant"];
        const tableData = invoices.orders.map(invoice => [
            invoice.quantity,
            invoice.menu.name,
            `${invoice.menu.price} MGA`,
            `${invoice.cost} MGA`
        ]);

        doc.autoTable({
            head: [tableColumnHeaders],
            body: tableData,
            startY: 80,
            theme: "grid",
            headStyles: { fillColor: [147, 197, 253] },
        });

        const totalAmount = invoices.orders.reduce((sum, invoice) => sum + invoice.cost, 0).toFixed(2);
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.text(`Montant total: ${totalAmount} MGA`, 14, finalY);
        doc.text("Somme arrêtée à la présente liste de .............", 14, finalY + 10);

        doc.text("Le responsable", 14, finalY + 30);
        doc.text("Le client", 150, finalY + 30);

        doc.save("facture.pdf");
    };


    return (
        <div className="container flex justify-center items-center">
            <div className="w-full bg-white rounded p-5 flex flex-col gap-5">
                <div>
                    <div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-3 items-center">
                                <img src="/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full"/>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold">By Sooatel</span>
                                    <span className="text-xs">Ankasina Antananarivo <br/> Tel: 038 96 373 43</span>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold underline text-center">Facture</h1>
                        </div>
                        <div className="flex flex-col mb-6">

                            <div className="flex flex-row mt-6 justify-between">
                                <div>
                                    <ul className="list-inside">
                                        <li className="py-1 px-4">Date: {currentDate}</li>
                                        <li className="py-1 px-4">Numéro de
                                            facture: {formatToFourDigits(invoices?.payment?.id || 0)}</li>
                                        <li className="py-1 px-4">Mode de
                                            paiement: {invoices?.payment?.paymentMethod || 'Non spécifié'}</li>
                                    </ul>
                                </div>
                                <div>
                                    <ul>
                                        <li className="py-1 px-4">N° de la table: {tableNumbersString || '___'}</li>
                                        <li className="py-1 px-4">N° de la chambre: {roomNumbersString || '___'}</li>
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
                        <table className="w-full border border-gray-200 text-left text-sm">
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
                            <tbody>
                            {invoices.orders.map((invoice, i) => (
                                <tr key={i}>
                                    <td className="py-2 px-4 border">{dayjs(invoice?.orderDate).format('DD/MM/YYYY HH:mm:ss')}</td>
                                    <td className="py-2 px-4 border">{formatToFourDigits(invoice?.id ?? 0)}</td>
                                    <td className="py-2 px-4 border">{invoice.menu.name}</td>
                                    <td className="py-2 px-4 border">{invoice.quantity}</td>
                                    <td className="py-2 px-4 border">{invoice.menu.price} MGA</td>
                                    <td className="py-2 px-4 border">{invoice.cost} MGA</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Aucune facture disponible.</p>
                    )}
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <span>
                            Montant total: {invoices?.orders?.reduce((sum, invoice) => sum + invoice.cost, 0).toFixed(2) || '0.00'} MGA
                        </span>
                        <p>
                            Somme arrêtée à la présente liste de {invoices?.orders?.reduce((sum, invoice) => sum + invoice.cost, 0).toFixed(2) || '0.00'} MGA
                        </p>
                    </div>
                    <div className="flex flex-row gap-40">
                        <span className="underline">Responsable</span>
                        <span className="underline">Client</span>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <button
                        onClick={generatePDF}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        disabled={!invoices || !invoices.orders}
                    >
                        Télécharger la Facture PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Invoices;
