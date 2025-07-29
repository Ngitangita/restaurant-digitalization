import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { MdInfoOutline } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import { FaPrint } from "react-icons/fa";
import dayjs from "dayjs";
import jsPDF from "jspdf";

import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import {
  fetchInvoices,
  fetchInvoiceById,
  fetchPaymentMethods,
  fetchPaymentStatuses,
  updateInvoicePaymentStatus,
  fetchMenus,
} from "../../services/invoiceService";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";
import { convertStatusToPayment } from "../../services/convertStatus";

const fmtMoney = (value, currency = "MGA", locale = "fr-MG") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    Number(value || 0)
  );

const formatToFourDigits = (n) => String(n ?? 0).padStart(4, "0");

const generateInvoicePDF = (invoice, menus) => {
  const doc = new jsPDF({ unit: "mm", format: [80, 140] });
  let y = 10;
  const m = 5;

  const currentDate = dayjs().format("DD/MM/YYYY HH:mm:ss");

  const roomNumbersString = invoice?.room?.number
    ? String(invoice.room.number)
    : Array.from(
        new Set(
          (invoice?.orders || []).map((o) => o.room?.roomNumber).filter(Boolean)
        )
      ).join("-");

  const tableNumbersString = invoice?.table?.number
    ? String(invoice.table.number)
    : Array.from(
        new Set(
          (invoice?.orders || []).map((o) => o.table?.number).filter(Boolean)
        )
      ).join("-");

  doc.setFontSize(10);
  [
    "UTOPIA",
    "By Sooatel",
    "Ankasina Antananarivo",
    "Tel: 038 42 779 74",
  ].forEach((line) => {
    doc.text(line, m, y);
    y += 6;
  });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE", 40, (y += 8), { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  [
    `Date: ${currentDate}`,
    `Facture: ${formatToFourDigits(invoice?.id || 0)}`,
    `Méthode: ${
      convertMethodToPayment(invoice?.paymentMethod) || "Non spécifié"
    }`,
    `Statut: ${
      convertStatusToPayment(invoice?.paymentStatus) || "Non spécifié"
    }`,
  ].forEach((line) => {
    doc.text(line, m, (y += 6));
  });

  doc.setFont("helvetica", "bold");
  if (tableNumbersString) {
    doc.setFontSize(14);
    y += 10;
    doc.text(`TABLE : ${tableNumbersString}`, 40, y, { align: "center" });
  }

  if (roomNumbersString) {
    doc.setFontSize(14);
    y += 14;
    doc.text(`CHAMBRE : ${roomNumbersString}`, 40, y, { align: "center" });
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  y += 8;
  doc.line(m, y, 75, y);

  (invoice?.lines || []).forEach((line) => {
    const menu = menus.find((m) => m.id === line.menuId);
    const name = menu ? menu.name : `Menu #${line.menuId}`;

    doc.text(`Article : ${name}`, m, (y += 6));
    doc.text(`Qté : x ${line.quantity}`, m, (y += 6));
    doc.text(`Prix : ${line.totalPrice.toFixed(2)} MGA`, m, (y += 6));

    y += 4;
    doc.line(m, y, 75, y);
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Mt. Total: ${fmtMoney(invoice.totalAmount)}`, m, (y += 8));

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Merci et à bientôt !", m, (y += 10));

  window.open(doc.output("bloburl"), "_blank");
};

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);
  const [methodFilter, setMethodFilter] = useState("");

  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    dayjs().format("YYYY-MM-DDTHH:mm")
  );
  const [description, setDescription] = useState("");

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [inv, methods, statuses, menuList] = await Promise.all([
          fetchInvoices(),
          fetchPaymentMethods(),
          fetchPaymentStatuses(),
          fetchMenus(),
        ]);
        setInvoices(inv || []);
        setPaymentMethods(methods || []);
        setPaymentStatuses(statuses || []);
        setMenus(menuList || []);
      } catch {
        showError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDetails = async (invoiceId) => {
    try {
      setSelectedId(invoiceId);
      const data = await fetchInvoiceById(invoiceId);
      setSelectedInvoice(data);

      setPaymentStatus(data?.paymentStatus || "");
      setPaymentMethod(data?.paymentMethod || "");
      setAmountPaid(data?.amountPaid ?? "");
      setPaymentDate(
        data?.paymentDate
          ? dayjs(data.paymentDate).format("YYYY-MM-DDTHH:mm")
          : dayjs().format("YYYY-MM-DDTHH:mm")
      );
      setDescription(data?.description || "");
      setDetailOpen(true);
    } catch {
      showError("Impossible de charger les détails de la facture.");
    }
  };

  const closeDetails = () => {
    setDetailOpen(false);
    setSelectedId(null);
    setSelectedInvoice(null);
  };

  const onSavePayment = async () => {
    try {
      const payload = {
        paymentStatus,
        paymentMethod,
        amountPaid: amountPaid === "" ? null : Number(amountPaid),
        paymentDate: paymentDate ? new Date(paymentDate).toISOString() : null,
        description: description || null,
      };
      const updated = await updateInvoicePaymentStatus(selectedId, payload);
      setInvoices((prev) =>
        prev.map((f) => (f.id === updated.id ? updated : f))
      );
      showSuccess("Paiement mis à jour !");
      closeDetails();
    } catch {
      showError("Erreur lors de la mise à jour.");
    }
  };

  const filtered = useMemo(() => {
    const term = searchTerm.trim();
    return invoices.filter((inv) => {
      const num = inv.table?.number ?? inv.room?.number ?? "";
      const bySearch = term
        ? String(num).includes(term) || String(inv.id).includes(term)
        : true;
      const byStatus = statusFilters.length
        ? statusFilters.includes(inv.paymentStatus)
        : true;
      const byMethod = methodFilter ? inv.paymentMethod === methodFilter : true;
      return bySearch && byStatus && byMethod;
    });
  }, [invoices, searchTerm, statusFilters, methodFilter]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)),
    [filtered]
  );

  return (
    <div className="text-gray-700 p-4 rounded-lg">
      <div className="fixed z-50 w-[1000px] bg-white darkBody px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <TextField
            label="Rechercher facture / chambre / table"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 240 }}
          />
          <ToggleButtonGroup
            value={statusFilters}
            onChange={(_, v) => v && setStatusFilters(v)}
            size="small"
            color="primary"
          >
            {paymentStatuses.map((st) => (
              <ToggleButton key={st} value={st}>
                {convertStatusToPayment(st.toLowerCase())}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="methodFilterLabel">Mode de paiement</InputLabel>
            <Select
              labelId="methodFilterLabel"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <MenuItem value="">Tous</MenuItem>
              {paymentMethods.map((m) => (
                <MenuItem key={m} value={m}>
                  {convertMethodToPayment(m.toLowerCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <table className="w-[1000px] bg-white shadow-md rounded-lg text-center relative top-[80px] darkBody">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-2">N° Fact</th>
            <th className="p-2">Émis le</th>
            <th className="p-2">Type</th>
            <th className="p-2">Numéro</th>
            <th className="p-2">Total</th>
            <th className="p-2">Payé</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Méthode</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading && sorted.length > 0 ? (
            sorted.map((inv) => {
              const isTable = !!inv.table;
              const number = isTable ? inv.table.number : inv.room?.number;
              return (
                <tr key={inv.id} className="border-b">
                  <td className="p-2">{inv.id}</td>
                  <td className="p-2">{dayjs(inv.issuedAt).format("DD/MM/YYYY HH:mm")}</td>
                  <td className="p-2">{isTable ? "Table" : "Chambre"}</td>
                  <td className="p-2">{number ?? "-"}</td>
                  <td className="p-2">{fmtMoney(inv.totalAmount)}</td>
                  <td className="p-2">{fmtMoney(inv.amountPaid)}</td>
                  <td className="p-2">
                    <span
                      className={`flex text-sm flex-row  gap-1 items-center text-center ${
                        convertStatusToPayment(
                          inv.paymentStatus.toLowerCase()
                        ) === "Payé"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {convertStatusToPayment(
                        inv.paymentStatus.toLowerCase()
                      ) === "non Payé" && (
                        <span className="text-red-500 text-[10px]">⚠️</span>
                      )}
                      {convertStatusToPayment(inv.paymentStatus.toLowerCase())}
                    </span>
                  </td>
                  <td className="p-2">{convertMethodToPayment(inv.paymentMethod)}</td>
                  <td className="flex justify-center gap-2 p-2">
                    <button
                      onClick={() => openDetails(inv.id)}
                      className="bg-blue-500 text-white rounded p-2"
                      title="Voir détails"
                    >
                      <BiSolidShow />
                    </button>
                    <button
                      onClick={() => generateInvoicePDF(inv, menus)}
                      className="bg-green-600 text-white rounded p-2"
                      title="Imprimer PDF"
                    >
                      <FaPrint />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9}>
                {loading ? (
                  "Chargement..."
                ) : (
                  <div className="flex flex-col items-center">
                    <MdInfoOutline className="text-4xl text-gray-400 mb-2" />
                    Aucune facture disponible
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {detailOpen && selectedInvoice && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="relative top-6 bg-white rounded-lg shadow-lg w-full max-w-md 
          EditModal p-4 "
          >
            <button
              onClick={closeDetails}
              className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[370px] text-[30px] hover:text-white cursor-pointer"
              aria-label="Fermer modale"
            >
              &times;
            </button>
            <h3>Facture #{selectedInvoice.id}</h3>
            <p>Total : {fmtMoney(selectedInvoice.totalAmount)}</p>
            <p>Payé : {fmtMoney(selectedInvoice.amountPaid)}</p>

            <div>
              <div className="flex flex-row gap-4">
                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    label="Statut"
                  >
                    {paymentStatuses.map((st) => (
                      <MenuItem key={st} value={st}>
                        {convertStatusToPayment(st.toLowerCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel>Méthode</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Méthode"
                  >
                    {paymentMethods.map((m) => (
                      <MenuItem key={m} value={m}>
                        {convertMethodToPayment(m.toLowerCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <TextField
                fullWidth
                size="small"
                label="Montant payé"
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                size="small"
                label="Date du paiement"
                type="datetime-local"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                size="small"
                label="Description"
                multiline
                minRows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mt: 2 }}
              />
            </div>

            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
              onClick={onSavePayment}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
