import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../services/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importation du plugin autoTable

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

            // Assurez-vous que `menuOrdersData` est bien un tableau
            const ordersArray = Array.isArray(menuOrdersData) ? menuOrdersData : menuOrdersData.data || [];

            setMenuOrders(ordersArray);

            // Générer les factures à partir des commandes de menu
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

    // Fonction pour générer et télécharger le PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Ajouter l'en-tête
        doc.text("Facture", 14, 10);
        doc.text("By Sooatel", 14, 20);
        doc.text("Ankasina Antananarivo", 14, 30);
        doc.text("Tel: 038 96 373 43", 14, 40);

        // Ajouter les informations de la chambre et de la table
        const room = rooms.find(r => r.roomNumber) || {};
        const table = tables.find(t => t.number) || {};

        doc.text(`N° de la chambre: ${room.roomNumber || '-'}`, 14, 50);
        doc.text(`N° de la table: ${table.number || '-'}`, 14, 60);

        // Préparer les données du tableau
        const tableData = factures.map((facture) => [
            new Date(facture.date).toLocaleDateString(),
            facture.commandId,
            facture.menuName,
            facture.quantity,
            `${facture.price} €`,
            `${facture.cost} €`
        ]);

        // Définir les colonnes pour le tableau
        const columns = [
            { header: 'Date', dataKey: 'date' },
            { header: 'Numéro de Commande', dataKey: 'commandId' },
            { header: 'Désignation', dataKey: 'menuName' },
            { header: 'Quantité', dataKey: 'quantity' },
            { header: 'Prix U', dataKey: 'price' },
            { header: 'Montant', dataKey: 'cost' }
        ];

        // Générer le tableau dans le PDF
        doc.autoTable(columns, tableData);

        // Ajouter la somme totale (à adapter selon votre logique)
        const totalAmount = factures.reduce((sum, facture) => sum + facture.cost, 0);
        doc.text(`Montant total: ${totalAmount.toFixed(2)} €`, 14, doc.lastAutoTable.finalY + 10);

        // Ajouter la signature
        doc.text('Lersponsable:', 14, doc.lastAutoTable.finalY + 30);
        doc.text('Client:', 14, doc.lastAutoTable.finalY + 40);

        // Sauvegarder le PDF
        doc.save('facture.pdf');
    };

    return (
        <div className="container flex justify-center items-center">
            <div className="w-full bg-white rounded p-5 flex flex-col gap-5">
                <div>
                    <div className="flex flex-row gap-36 items-center">
                        <div className="flex flex-row gap-3 items-center">
                            <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
                            <div className='flex flex-col'>
                                <span className='text-2xl font-bold'>By Sooatel</span>
                                <span className='text-xs'>Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <h1 className="text-2xl fontold underline">Facture</h1>
                            <div>
                                <p className="py-2 px-4">N° de la chambre: {rooms.roomNumber}</p>
                                <p className="py-2 px-4">N° du table: {tables.number}</p>
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
                        <span>Montant total: ................</span>
                        <p>Somme arrêtée à la présente liste de ................</p>
                    </div>
                    <div className="flex flex-row gap-40">
                        <span className="underline">Lersponsable</span>
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
