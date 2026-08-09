import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Download, Share2, CheckCircle2,
  AlertCircle, X, Banknote
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getInvoice, sendInvoice, voidInvoice, recordPayment, downloadInvoicePdf,
} from "../../utils/invoiceApi";
import { formatCents, toCents } from "../../utils/money";

const STATUS_STYLES = {
  draft:   "bg-white/5 text-gray-400",
  sent:    "bg-blue-500/10 text-blue-400",
  viewed:  "bg-blue-500/10 text-blue-300",
  paid:    "bg-green-500/10 text-green-400",
  overdue: "bg-red-500/10 text-red-400",
  void:    "bg-white/5 text-gray-500",
};

function PaymentModal({ invoice, onClose, onPaid }) {
  const [amount, setAmount]     = useState((invoice.total_cents / 100).toFixed(2));
  const [method, setMethod]     = useState("eft");
  const [reference, setReference] = useState("");
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const cents = toCents(amount);
    if (cents <= 0) { setError("Amount must be greater than 0."); return; }
    setError("");
    setBusy(true);
    try {
      await recordPayment(invoice.id, {
        amount_cents: cents,
        method,
        reference: reference || null,
      });
      onPaid();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="glass-theme w-full max-w-md rounded-[32px] p-8 border border-white/10 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-comfortaa font-bold text-white mb-6">Record Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Amount ({invoice.currency})</label>
            <input
              type="number"
              value={amount}
              min="0.01"
              step="0.01"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
            >
              {["manual", "eft", "card", "other"].map((m) => (
                <option key={m} value={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Reference (optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Bank ref, proof of payment…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 text-sm hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="flex-1 py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-50 transition-all" style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}>
              {busy ? "Recording…" : "Record Payment"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showPayModal, setPayModal] = useState(false);
  const [busy, setBusy]           = useState(false);
  const [copied, setCopied]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setInvoice(await getInvoice(id)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleSend() {
    if (!window.confirm("Mark this invoice as sent?")) return;
    setBusy(true);
    try { setInvoice(await sendInvoice(id)); }
    catch (e) { alert(e.message); }
    finally { setBusy(false); }
  }

  async function handleVoid() {
    if (!window.confirm("Void this invoice? This action cannot be undone.")) return;
    setBusy(true);
    try { setInvoice(await voidInvoice(id)); }
    catch (e) { alert(e.message); }
    finally { setBusy(false); }
  }

  async function handleDownloadPdf() {
    try {
      const url = await downloadInvoicePdf(id);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) { alert(e.message); }
  }

  async function handleCopyShareLink() {
    const shareUrl = `${window.location.origin}/invoicing/share/${invoice.share_token}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const shareUrl = invoice
    ? `${window.location.origin}/invoicing/share/${invoice.share_token}`
    : "";

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Invoice not found.{" "}
        <Link to="/invoicing" className="ml-2 underline">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/invoicing")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Dashboard
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-comfortaa font-bold text-white">
            {invoice.invoice_number}
          </h1>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[invoice.status] || ""}`}>
            {invoice.status}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {invoice.status === "draft" && (
            <>
              <Link
                to={`/invoicing/${id}/edit`}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-all"
              >
                Edit
              </Link>
              <button
                onClick={handleSend}
                disabled={busy}
                className="px-4 py-2 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50"
                style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}
              >
                Mark Sent
              </button>
            </>
          )}
          {["sent", "viewed", "overdue"].includes(invoice.status) && (
            <button
              onClick={() => setPayModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}
            >
              <Banknote size={16} /> Record Payment
            </button>
          )}
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-all"
          >
            {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Share2 size={16} />}
            {copied ? "Copied!" : "Share Link"}
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-all"
          >
            <Download size={16} /> PDF
          </button>
          {!["paid", "void"].includes(invoice.status) && (
            <button
              onClick={handleVoid}
              disabled={busy}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              Void
            </button>
          )}
        </div>
      </div>

      {/* Share URL */}
      <div className="glass-theme p-4 rounded-[20px] border border-white/10 mb-6 flex items-center gap-3">
        <Share2 size={14} className="text-gray-500 flex-shrink-0" />
        <span className="text-xs text-gray-500 truncate flex-1">{shareUrl}</span>
      </div>

      {/* Line items */}
      <div className="glass-theme rounded-[28px] border border-white/10 overflow-hidden mb-6">
        <div className="p-6 pb-2">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Line Items</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-widest">Description</th>
              <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-widest">Qty</th>
              <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-widest">Unit Price</th>
              <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-widest">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item) => (
              <tr key={item.id} className="border-b border-white/5">
                <td className="px-6 py-4 text-white text-sm">{item.description}</td>
                <td className="px-6 py-4 text-gray-300 text-sm text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-gray-300 text-sm text-right">
                  {formatCents(item.unit_price_cents, invoice.currency)}
                </td>
                <td className="px-6 py-4 text-white text-sm text-right font-semibold">
                  {formatCents(Math.round(item.quantity * item.unit_price_cents), invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="p-6 border-t border-white/5">
          <div className="max-w-xs ml-auto space-y-2">
            {[
              ["Subtotal", invoice.subtotal_cents],
              ...(invoice.tax_rate_bp > 0 ? [[`Tax (${(invoice.tax_rate_bp / 100).toFixed(2)}%)`, invoice.tax_cents]] : []),
              ...(invoice.discount_cents > 0 ? [["Discount", -invoice.discount_cents]] : []),
            ].map(([lbl, cents]) => (
              <div key={lbl} className="flex justify-between text-sm">
                <span className="text-gray-500">{lbl}</span>
                <span className={`text-white ${lbl === "Discount" ? "text-green-400" : ""}`}>
                  {lbl === "Discount" ? "−" : ""}{formatCents(Math.abs(cents), invoice.currency)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold border-t border-white/10 pt-3">
              <span className="text-white">Total Due</span>
              <span style={{ color: "var(--theme-color)" }}>
                {formatCents(invoice.total_cents, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="glass-theme p-6 rounded-[28px] border border-white/10 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3">Notes</h2>
          <p className="text-gray-400 text-sm whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      <AnimatePresence>
        {showPayModal && (
          <PaymentModal
            invoice={invoice}
            onClose={() => setPayModal(false)}
            onPaid={load}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
