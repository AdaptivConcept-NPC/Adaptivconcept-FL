import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClients, createInvoice, getInvoice, updateInvoice,
} from "../../utils/invoiceApi";
import { toCents, formatCents, computeTotals, fromCents } from "../../utils/money";

const CURRENCIES = ["ZAR", "USD", "EUR", "GBP", "NAD", "BWP"];

const EMPTY_ITEM = { description: "", quantity: 1, unit_price_cents: 0 };

function LineItemRow({ item, index, onChange, onRemove }) {
  function update(field, val) {
    onChange(index, { ...item, [field]: val });
  }
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-6">
        <input
          type="text"
          value={item.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Description"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.quantity}
          min="0.01"
          step="0.01"
          onChange={(e) => update("quantity", parseFloat(e.target.value) || 1)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
        />
      </div>
      <div className="col-span-3">
        <input
          type="number"
          value={fromCents(item.unit_price_cents)}
          min="0"
          step="0.01"
          onChange={(e) => update("unit_price_cents", toCents(e.target.value))}
          placeholder="Unit price"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function InvoiceEditor() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [clients, setClients] = useState([]);
  const [form, setForm]       = useState({
    client_id: "",
    currency: "ZAR",
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: "",
    tax_rate_bp: 0,    // stored as whole percent in UI, converted on submit
    discount: "0.00",  // display value
    notes: "",
    items: [{ ...EMPTY_ITEM }],
  });
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(isEdit);

  const load = useCallback(async () => {
    const clientList = await getClients();
    setClients(clientList);
    if (isEdit) {
      const inv = await getInvoice(id);
      setForm({
        client_id:   inv.client_id,
        currency:    inv.currency,
        issue_date:  inv.issue_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        due_date:    inv.due_date?.slice(0, 10) || "",
        tax_rate_bp: inv.tax_rate_bp / 100,   // bp → percent for display
        discount:    fromCents(inv.discount_cents).toFixed(2),
        notes:       inv.notes || "",
        items:       inv.items?.length
          ? inv.items.map((i) => ({ ...i }))
          : [{ ...EMPTY_ITEM }],
      });
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => { load(); }, [load]);

  function setField(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  function updateItem(idx, updated) {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = updated;
      return { ...f, items };
    });
  }

  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
  }

  function removeItem(idx) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  const discountCents = toCents(form.discount);
  const taxBp = Math.round((parseFloat(form.tax_rate_bp) || 0) * 100);
  const totals = computeTotals(form.items, taxBp, discountCents);

  async function handleSave(asDraft = true) {
    if (!form.client_id) { setError("Please select a client."); return; }
    if (form.items.length === 0 || form.items.every((i) => !i.description.trim())) {
      setError("Add at least one line item with a description.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const payload = {
        client_id:     parseInt(form.client_id),
        currency:      form.currency,
        issue_date:    form.issue_date ? `${form.issue_date}T00:00:00` : undefined,
        due_date:      form.due_date ? `${form.due_date}T00:00:00` : null,
        tax_rate_bp:   taxBp,
        discount_cents: discountCents,
        notes:         form.notes || null,
        items:         form.items
          .filter((i) => i.description.trim())
          .map((i, idx) => ({
            description:      i.description,
            quantity:         parseFloat(i.quantity) || 1,
            unit_price_cents: i.unit_price_cents,
            sort_order:       idx,
          })),
      };
      const saved = isEdit
        ? await updateInvoice(id, payload)
        : await createInvoice(payload);
      navigate(`/invoicing/${saved.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-4xl font-comfortaa font-bold text-white mb-8">
        {isEdit ? "Edit" : "New"}{" "}
        <span style={{ color: "var(--theme-color)" }}>Invoice</span>
      </h1>

      <div className="space-y-6">
        {/* Client + currency */}
        <div className="glass-theme p-6 rounded-[28px] border border-white/10">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Client *</label>
              <select
                value={form.client_id}
                onChange={(e) => setField("client_id", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
              >
                <option value="">— Select client —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` (${c.company})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setField("currency", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Issue Date</label>
              <input
                type="date"
                value={form.issue_date}
                onChange={(e) => setField("issue_date", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setField("due_date", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="glass-theme p-6 rounded-[28px] border border-white/10">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Line Items</h2>

          {/* Header */}
          <div className="grid grid-cols-12 gap-2 mb-2 px-1">
            {[["col-span-6","Description"],["col-span-2","Qty"],["col-span-3","Unit Price"],["col-span-1",""]].map(([cls,lbl])=>(
              <div key={lbl} className={`${cls} text-xs text-gray-500 uppercase tracking-widest`}>{lbl}</div>
            ))}
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {form.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LineItemRow
                    item={item}
                    index={idx}
                    onChange={updateItem}
                    onRemove={removeItem}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Plus size={15} /> Add line item
          </button>
        </div>

        {/* Tax, discount, notes */}
        <div className="glass-theme p-6 rounded-[28px] border border-white/10">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Adjustments & Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={form.tax_rate_bp}
                min="0"
                max="100"
                step="0.01"
                onChange={(e) => setField("tax_rate_bp", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Discount ({form.currency})</label>
              <input
                type="number"
                value={form.discount}
                min="0"
                step="0.01"
                onChange={(e) => setField("discount", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              maxLength={4000}
              placeholder="Payment terms, banking details, thank you note…"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--theme-color)]/50 transition-all resize-none"
            />
          </div>
        </div>

        {/* Live totals */}
        <div className="glass-theme p-6 rounded-[28px] border border-white/10">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Totals Preview</h2>
          <div className="space-y-2 max-w-xs ml-auto">
            {[
              ["Subtotal", totals.subtotal],
              ["Tax", totals.tax],
              ["Discount", -discountCents],
            ].map(([lbl, cents]) => (
              <div key={lbl} className="flex justify-between text-sm">
                <span className="text-gray-500">{lbl}</span>
                <span className={`text-white ${lbl === "Discount" && cents < 0 ? "text-green-400" : ""}`}>
                  {lbl === "Discount" && discountCents > 0 ? "−" : ""}
                  {formatCents(Math.abs(cents), form.currency)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold border-t border-white/10 pt-3">
              <span className="text-white">Total Due</span>
              <span style={{ color: "var(--theme-color)" }}>{formatCents(totals.total, form.currency)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 text-sm hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={busy}
            className="px-8 py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-50 transition-all"
            style={{ background: "var(--theme-color)", color: "var(--on-theme-text, #ffffff)" }}
          >
            {busy ? "Saving…" : isEdit ? "Save Changes" : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}
