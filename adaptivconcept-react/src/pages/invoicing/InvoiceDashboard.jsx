import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, AlertTriangle, CheckCircle2, FileText,
  Plus, LogOut, ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useInvoiceAuth } from "../../context/InvoiceAuthContext";
import { getStatsSummary, getInvoices } from "../../utils/invoiceApi";
import { formatCents } from "../../utils/money";

const STATUS_STYLES = {
  draft:   "bg-white/5 text-gray-400",
  sent:    "bg-blue-500/10 text-blue-400",
  viewed:  "bg-blue-500/10 text-blue-300",
  paid:    "bg-green-500/10 text-green-400",
  overdue: "bg-red-500/10 text-red-400",
  void:    "bg-white/5 text-gray-500 line-through",
};

function KpiCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-theme p-6 rounded-[24px] border border-white/10 flex items-start gap-4"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border"
        style={{ background: `${accent}18`, borderColor: `${accent}33` }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-white font-comfortaa">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function InvoiceDashboard() {
  const { user, logout } = useInvoiceAuth();
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, inv] = await Promise.all([
        getStatsSummary(),
        getInvoices({ page_size: 10 }),
      ]);
      setStats(s);
      setInvoices(inv);
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-comfortaa font-bold text-white">
            Invoice <span style={{ color: "var(--theme-color)" }}>Dashboard</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/invoicing/clients"
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-all"
          >
            Clients
          </Link>
          <Link
            to="/invoicing/new"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}
          >
            <Plus size={16} /> New Invoice
          </Link>
          <button
            onClick={() => { logout(); navigate("/invoicing/login"); }}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <KpiCard
            label="Outstanding"
            value={formatCents(stats.outstanding_cents, "ZAR")}
            sub={`${stats.sent_count} sent/viewed`}
            icon={TrendingUp}
            accent="#fd3b12"
          />
          <KpiCard
            label="Overdue"
            value={stats.overdue_count}
            sub="Invoices past due date"
            icon={AlertTriangle}
            accent="#ef4444"
          />
          <KpiCard
            label="Paid This Month"
            value={formatCents(stats.paid_this_month_cents, "ZAR")}
            sub={`${stats.paid_count} invoices paid`}
            icon={CheckCircle2}
            accent="#22c55e"
          />
          <KpiCard
            label="Total Invoices"
            value={stats.total_invoices}
            sub={`${stats.draft_count} drafts`}
            icon={FileText}
            accent="#60a5fa"
          />
        </div>
      )}

      {/* Recent invoices */}
      <div className="glass-theme rounded-[32px] border border-white/10 overflow-hidden">
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-lg font-bold text-white">Recent Invoices</h2>
          <Link
            to="/invoicing"
            onClick={() => {}}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 mb-4">No invoices yet.</p>
            <Link
              to="/invoicing/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}
            >
              <Plus size={16} /> Create First Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Invoice #", "Client", "Amount", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-widest font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-mono text-sm font-semibold">
                      {inv.invoice_number}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{inv.client_id}</td>
                    <td className="px-6 py-4 text-white text-sm font-semibold">
                      {formatCents(inv.total_cents, inv.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[inv.status] || ""}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(inv.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/invoicing/${inv.id}`}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
