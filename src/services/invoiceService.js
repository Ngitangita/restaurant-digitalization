
import { apiUrl, fetchJson } from "./api";

export async function fetchInvoices() {
  return await fetchJson(apiUrl("/invoices"));
}

export async function fetchInvoiceById(invoiceId) {
  return await fetchJson(apiUrl(`/invoices/${invoiceId}`));
}

export async function fetchPaymentMethods() {
  return await fetchJson(apiUrl("/payments/method"));
}

export async function fetchPaymentStatuses() {
  return await fetchJson(apiUrl("/payments/status"));
}

export async function fetchMenus() {
  return fetchJson(apiUrl("/menus/all"));
}

export async function updateInvoicePaymentStatus(id, payload) {
  const res = await fetch(apiUrl(`/invoices/${id}/payment-status`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Erreur lors de la mise à jour du paiement.");
  }
  return await res.json();
}

export async function generateInvoiceForOrder(orderId) {
  return await fetchJson(apiUrl(`/invoices/generate/${orderId}`));
}
