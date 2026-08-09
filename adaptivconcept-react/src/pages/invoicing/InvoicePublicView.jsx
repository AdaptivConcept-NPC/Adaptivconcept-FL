import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { getPublicInvoice, downloadPublicPdf } from "../../utils/invoiceApi";
import { formatCents } from "../../utils/money";

const STATUS_STYLES = {
  draft:   "bg-white/5 text-gray-400",
  sent:    "bg-blue-500/10 text-blue-400",
  viewed:  "bg-blue-500/10 text-blue-300",
  paid:    "bg-green-500/10 text-green-400",
  overdue: "bg-red-500/10 text-red-400",
  void:    "bg-white/5 text-gray-500",
};

export default function InvoicePublicView() {
  const { token } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getPublicInvoice(token)
      .then(setInvoice)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDownloadPdf() {
    try {
      const url = await downloadPublicPdf(token);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      alert("PDF download failed: " + e.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-dark)" }}>
        <div className="w-10 h-10 border-2 border-white/20 border-t-[var(--theme-color)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg-dark)" }}>
        <div className="max-w-md text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-comfortaa font-bold text-white mb-2">Invoice Unavailable</h1>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--bg-dark)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-comfortaa font-bold"
            style={{ color: "var(--theme-color)" }}
          >
            Adaptivconcept
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">FL · Professional Services</p>
        </div>

        {/* Card */}
        <div className="glass-theme rounded-[32px] border border-white/10 overflow-hidden">

          {/* Invoice header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-8 border-b border-white/5">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Invoice</p>
              <p className="text-2xl font-mono font-bold text-white">{invoice.invoice_number}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[invoice.status] || ""}`}>
                {invoice.status}
              </span>
            </div>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold transition-all hover:opacity-90 flex-shrink-0"
              style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}
            >
              <Download size={16} /> Download PDF
            </button>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-6 px-8 py-4 border-b border-white/5 bg-white/2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Issue Date</p>
              <p className="text-sm text-white font-semibold">
                {new Date(invoice.issue_date).toLocaleDateString("en-ZA", { dateStyle: "long" })}
              </p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Due Date</p>
                <p className="text-sm text-white font-semibold">
                  {new Date(invoice.due_date).toLocaleDateString("en-ZA", { dateStyle: "long" })}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Currency</p>
              <p className="text-sm text-white font-semibold">{invoice.currency}</p>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-3 text-left text-xs text-gray-500 uppercase tracking-widest">Description</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-widest">Qty</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-widest">Unit Price</th>
                <th className="px-8 py-3 text-right text-xs text-gray-500 uppercase tracking-widest">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="px-8 py-4 text-white text-sm">{item.description}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm text-right">{item.quantity}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm text-right">
                    {formatCents(item.unit_price_cents, invoice.currency)}
                  </td>
                  <td className="px-8 py-4 text-white text-sm text-right font-semibold">
                    {formatCents(Math.round(item.quantity * item.unit_price_cents), invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="p-8 border-t border-white/5">
            <div className="max-w-xs ml-auto space-y-2">
              {[
                ["Subtotal", invoice.subtotal_cents],
                ...(invoice.tax_rate_bp > 0
                  ? [[`Tax (${(invoice.tax_rate_bp / 100).toFixed(2)}%)`, invoice.tax_cents]]
                  : []),
                ...(invoice.discount_cents > 0
                  ? [["Discount", -invoice.discount_cents]]
                  : []),
              ].map(([lbl, cents]) => (
                <div key={lbl} className="flex justify-between text-sm">
                  <span className="text-gray-500">{lbl}</span>
                  <span className={lbl === "Discount" ? "text-green-400" : "text-white"}>
                    {lbl === "Discount" ? "−" : ""}
                    {formatCents(Math.abs(cents), invoice.currency)}
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

          {/* Notes */}
          {invoice.notes && (
            <div
              className="mx-8 mb-8 p-5 rounded-2xl border-l-4"
              style={{ background: "rgba(var(--theme-color-rgb),0.05)", borderColor: "var(--theme-color)" }}
            >
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          Issued by <span style={{ color: "var(--theme-color)" }}>Adaptivconcept FL</span> · Thank you for your business.
        </p>
      </motion.div>
    </div>
  );
}
