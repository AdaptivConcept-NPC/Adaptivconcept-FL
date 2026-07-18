/**
 * invoiceApi.js
 * Thin fetch wrapper for the invoicing API.
 * All requests auto-attach the Bearer token from localStorage.
 */

const BACKEND_BASE = import.meta.env.VITE_INVOICE_API_URL
  || import.meta.env.VITE_AICODEX_API_URL
  || "http://localhost:9000";

const BASE = `${BACKEND_BASE}/api/invoicing`;
const TOKEN_KEY = "invoice_token";

function authHeaders(extra = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ---- Clients ----
export const getClients = ()                        => apiFetch("/clients");
export const createClient = (body)                  => apiFetch("/clients", { method: "POST", body: JSON.stringify(body) });
export const getClient = (id)                       => apiFetch(`/clients/${id}`);
export const updateClient = (id, body)              => apiFetch(`/clients/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteClient = (id)                    => apiFetch(`/clients/${id}`, { method: "DELETE" });

// ---- Invoices ----
export const getInvoices = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/invoices${qs ? `?${qs}` : ""}`);
};
export const createInvoice = (body)                 => apiFetch("/invoices", { method: "POST", body: JSON.stringify(body) });
export const getInvoice = (id)                      => apiFetch(`/invoices/${id}`);
export const updateInvoice = (id, body)             => apiFetch(`/invoices/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteInvoice = (id)                   => apiFetch(`/invoices/${id}`, { method: "DELETE" });
export const sendInvoice = (id)                     => apiFetch(`/invoices/${id}/send`, { method: "POST" });
export const voidInvoice = (id)                     => apiFetch(`/invoices/${id}/void`, { method: "POST" });
export const recordPayment = (id, body)             => apiFetch(`/invoices/${id}/payments`, { method: "POST", body: JSON.stringify(body) });

// PDF — returns a blob URL for <a download> or window.open
export async function downloadInvoicePdf(id) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE}/invoices/${id}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("PDF download failed");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// ---- Stats ----
export const getStatsSummary = ()                   => apiFetch("/stats/summary");

// ---- Public (no auth) ----
export async function getPublicInvoice(shareToken) {
  const res = await fetch(`${BASE}/public/invoices/${shareToken}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

export async function downloadPublicPdf(shareToken) {
  const res = await fetch(`${BASE}/public/invoices/${shareToken}/pdf`);
  if (!res.ok) throw new Error("PDF download failed");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
