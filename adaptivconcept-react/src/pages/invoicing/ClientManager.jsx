import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, AlertCircle } from "lucide-react";
import { getClients, createClient, updateClient, deleteClient } from "../../utils/invoiceApi";

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  billing_address: "",
  vat_number: "",
};

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm]   = useState(client ? { ...client } : { ...EMPTY_FORM });
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setError("");
    setBusy(true);
    try {
      const saved = client?.id
        ? await updateClient(client.id, form)
        : await createClient(form);
      onSave(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const fields = [
    { name: "name",            label: "Full Name *",        type: "text",     placeholder: "Jane Doe" },
    { name: "company",         label: "Company",            type: "text",     placeholder: "Acme Corp" },
    { name: "email",           label: "Email",              type: "email",    placeholder: "jane@acme.com" },
    { name: "phone",           label: "Phone",              type: "tel",      placeholder: "+27 82 000 0000" },
    { name: "billing_address", label: "Billing Address",    type: "textarea", placeholder: "123 Main St, Johannesburg" },
    { name: "vat_number",      label: "VAT Number",         type: "text",     placeholder: "4500000000" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="glass-theme w-full max-w-lg rounded-[32px] p-8 border border-white/10 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-comfortaa font-bold text-white mb-6">
          {client?.id ? "Edit Client" : "New Client"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={form[name] || ""}
                  onChange={handleChange}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all resize-none"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name] || ""}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
                />
              )}
            </div>
          ))}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 text-sm hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-50 transition-all"
              style={{ background: "var(--theme-color)" }}
            >
              {busy ? "Saving…" : "Save Client"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | "new" | client object
  const [error, setError]     = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setClients(await getClients());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleSaved(saved) {
    setClients((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModal(null);
  }

  async function handleDelete(client) {
    if (!window.confirm(`Remove client "${client.name}"? This only works if they have no invoices.`)) return;
    try {
      await deleteClient(client.id);
      setClients((prev) => prev.filter((c) => c.id !== client.id));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-comfortaa font-bold text-white">
            <span style={{ color: "var(--theme-color)" }}>Client</span> Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
          style={{ background: "var(--theme-color)" }}
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading clients…</div>
      ) : clients.length === 0 ? (
        <div className="py-20 text-center glass-theme rounded-[32px] border border-dashed border-white/10">
          <p className="text-gray-500 mb-4">No clients yet.</p>
          <button
            onClick={() => setModal("new")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm"
            style={{ background: "var(--theme-color)" }}
          >
            <Plus size={16} /> Add First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-theme p-6 rounded-[24px] border border-white/10 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{client.name}</p>
                  {client.company && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{client.company}</p>
                  )}
                  {client.email && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{client.email}</p>
                  )}
                  {client.phone && (
                    <p className="text-xs text-gray-500 truncate">{client.phone}</p>
                  )}
                  {client.vat_number && (
                    <p className="text-xs text-gray-600 mt-1">VAT: {client.vat_number}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal(client)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 rounded-xl text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal !== null && (
          <ClientModal
            client={modal === "new" ? null : modal}
            onSave={handleSaved}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
