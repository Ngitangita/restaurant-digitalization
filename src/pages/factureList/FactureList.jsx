import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../services/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const FactureList = () => {
    const [tables, setTables] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [menuOrders, setMenuOrders] = useState([]);
    const [factures, setFactures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [roomsResponse, tablesResponse, menuOrdersResponse] = await Promise.all([
                fetch(apiUrl('/rooms')),
                fetch(apiUrl('/tables/all')),
                fetch(apiUrl('/menu-orders/search'))
            ]);

            if (!roomsResponse.ok || !tablesResponse.ok || !menuOrdersResponse.ok) {
                throw new Error('Erreur lors de la récupération des rooms, tables ou menu-orders');
            }

            const roomsData = await roomsResponse.json();
            const tablesData = await tablesResponse.json();
            const menuOrdersData = await menuOrdersResponse.json();

            setRooms(roomsData);
            setTables(tablesData);

            const ordersArray = Array.isArray(menuOrdersData) ? menuOrdersData : menuOrdersData.data || [];
            setMenuOrders(ordersArray);

            const generatedFactures = ordersArray.map(order => {
                const room = roomsData.find(r => r.id === order.roomId) || {};
                const table = tablesData.find(t => t.id === order.tableId) || {};

                return {
                    id: order.id,
                    commandId: order.commandId,
                    date: order.date,
                    roomNumber: room.roomNumber || "-",
                    tableNumber: table.number || "-",
                    menuName: order.menu?.name || "-",
                    quantity: order.quantity,
                    price: order.menu?.price || 0,
                    cost: order.quantity * (order.menu?.price || 0)
                };
            });

            setFactures(generatedFactures);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
    
        // Header section
        doc.setFontSize(16);
        doc.text("UTOPIA", 14, 10);
        doc.setFontSize(12);
        doc.text("By Sooatel", 14, 20);
        doc.text("Ankasina Antananarivo", 14, 26);
        doc.text("Tel: 038 96 373 43", 14, 32);
    
        // Invoice title
        doc.setFontSize(14);
        doc.text("FACTURE", 105, 40, { align: "center" });
        
        // Additional details
        doc.setFontSize(10);
        const currentDate = new Date().toLocaleDateString();  // Use today's date or fetch dynamically
        doc.text(`Date: ${currentDate}`, 14, 50);
        doc.text("N° de table: ...........", 14, 56);
        doc.text("Chambre: ...........", 14, 62);
    
        // Table headers
        const tableColumnHeaders = ["Qtés", "Désignation", "P.U.", "Montant"];
        const tableData = factures.map(facture => [
            facture.quantity,
            facture.menuName,
            `${facture.price} €`,
            `${facture.cost} €`
        ]);
    
        // Add table to the PDF
        doc.autoTable({
            head: [tableColumnHeaders],
            body: tableData,
            startY: 70,
            theme: 'grid',
            headStyles: { fillColor: [147, 197, 253] },
        });
    
        // Footer section
        const totalAmount = factures.reduce((sum, facture) => sum + facture.cost, 0).toFixed(2);
        const finalY = doc.lastAutoTable.finalY + 10;
    
        doc.text(`Montant total: ${totalAmount} €`, 14, finalY);
        doc.text("Somme arrêtée à la présente liste de .............", 14, finalY + 10);
    
        // Signatures
        doc.text("Le responsable", 14, finalY + 30);
        doc.text("Le client", 150, finalY + 30);
    
        // Save the PDF
        doc.save("facture.pdf");
    };
    
    return (
        <div className="container flex justify-center items-center">
            <div className="w-full bg-white rounded p-5 flex flex-col gap-5">
                <div>
                    <div className="flex flex-row gap-36 items-center">
                        <div className="flex flex-row gap-3 items-center">
                            <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">By Sooatel</span>
                                <span className="text-xs">Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <h1 className="text-2xl font-bold underline">Facture</h1>
                            <div>
                                <p className="py-2 px-4">N° de la chambre: {rooms[0]?.roomNumber || '-'}</p>
                                <p className="py-2 px-4">N° de la table: {tables[0]?.number || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <p>Chargement des factures...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <table className="w-full border border-gray-200 text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border">Date</th>
                                    <th className="py-2 px-4 border">Numéro de Commande</th>
                                    <th className="py-2 px-4 border">Désignation</th>
                                    <th className="py-2 px-4 border">Quantité</th>
                                    <th className="py-2 px-4 border">Prix U</th>
                                    <th className="py-2 px-4 border">Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {factures.map((facture) => (
                                    <tr key={facture.id}>
                                        <td className="py-2 px-4 border">{new Date(facture.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border">{facture.commandId}</td>
                                        <td className="py-2 px-4 border">{facture.menuName}</td>
                                        <td className="py-2 px-4 border">{facture.quantity}</td>
                                        <td className="py-2 px-4 border">{facture.price} €</td>
                                        <td className="py-2 px-4 border">{facture.cost} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <span>Montant total: {factures.reduce((sum, facture) => sum + facture.cost, 0).toFixed(2)} €</span>
                        <p>Somme arrêtée à la présente liste de {factures.reduce((sum, facture) => sum + facture.cost, 0).toFixed(2)} €</p>
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
                    >
                        Télécharger la Facture PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FactureList;  