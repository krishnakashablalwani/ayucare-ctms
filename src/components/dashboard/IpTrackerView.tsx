"use client";

import React, { useState, useEffect } from "react";
import { PackageOpen, AlertTriangle, CheckCircle2, ArrowRightLeft, Pill, Package } from "lucide-react";
import { RoleType } from "../layout/Header";

interface IpTrackerViewProps {
  currentRole: RoleType;
  selectedTrialId: string | null;
  subjects: any[]; // Used for dispensation dropdown
}

export const IpTrackerView: React.FC<IpTrackerViewProps> = ({ currentRole, selectedTrialId, subjects }) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showDispense, setShowDispense] = useState(false);
  
  // Form states
  const [batchForm, setBatchForm] = useState({ batchNumber: "", productName: "", manufacturingDate: "", expiryDate: "", totalQuantityReceived: "", status: "Quarantined" });
  const [dispenseForm, setDispenseForm] = useState({ ipId: "", subjectId: "", visitName: "", quantityDispensed: "", dispensedDate: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    if (selectedTrialId) fetchBatches();
  }, [selectedTrialId]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ip?trialId=${selectedTrialId}`);
      if (res.ok) setBatches(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/ip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...batchForm, trialId: selectedTrialId }),
    });
    setShowAddBatch(false);
    fetchBatches();
  };

  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/ip/dispense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dispenseForm, dispensedBy: currentRole }),
    });
    setShowDispense(false);
    fetchBatches();
  };

  const totalStock = batches.reduce((acc, b) => acc + b.quantityAvailable, 0);
  const totalDispensed = batches.reduce((acc, b) => acc + b.quantityDispensed, 0);
  const lowStockBatches = batches.filter(b => b.quantityAvailable > 0 && b.quantityAvailable < 20).length;

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-signifier text-text-primary tracking-tight">Investigational Product Tracker</h1>
          <p className="text-body-lg text-text-secondary font-sohne mt-4 max-w-2xl">
            GCP-compliant inventory management. Track manufacturing batches, manage dispensations, and monitor expiry for all Ayurvedic study drugs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowDispense(true)} className="steep-pill-ghost border-sienna text-sienna flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Dispense IP</span>
          </button>
          <button onClick={() => setShowAddBatch(true)} className="steep-pill-filled flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Receive New Batch</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="steep-card bg-surface-card border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted text-sm font-medium uppercase font-sohne tracking-wider">
            <span>Available Stock</span>
            <PackageOpen className="w-5 h-5 text-text-primary" />
          </div>
          <div className="text-4xl font-signifier mt-6">{totalStock} <span className="text-lg text-text-secondary font-sohne">units</span></div>
        </div>
        <div className="steep-card bg-surface-card border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted text-sm font-medium uppercase font-sohne tracking-wider">
            <span>Total Dispensed</span>
            <Pill className="w-5 h-5 text-text-primary" />
          </div>
          <div className="text-4xl font-signifier mt-6">{totalDispensed} <span className="text-lg text-text-secondary font-sohne">units</span></div>
        </div>
        <div className={`steep-card ${lowStockBatches > 0 ? "steep-card-accent" : "bg-surface-card border-border-subtle"} flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-text-muted text-sm font-medium uppercase font-sohne tracking-wider">
            <span>Low Stock Alerts</span>
            <AlertTriangle className={`w-5 h-5 ${lowStockBatches > 0 ? "text-sienna animate-pulse" : "text-text-primary"}`} />
          </div>
          <div className="text-4xl font-signifier mt-6">{lowStockBatches} <span className="text-lg text-text-secondary font-sohne">batches</span></div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="steep-card p-0 overflow-hidden border-border-subtle bg-surface-card">
        <div className="p-6 border-b border-border-subtle">
          <h2 className="text-lg font-signifier font-medium">Inventory Batches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sohne whitespace-nowrap">
            <thead className="bg-background/50 text-text-muted uppercase tracking-wider text-xs border-b border-border-subtle">
              <tr>
                <th className="p-4 font-medium">Batch No.</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Expiry</th>
                <th className="p-4 font-medium">Stock (Avail/Total)</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-primary">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-surface-accent/20 transition-colors">
                  <td className="p-4 font-medium">{b.batchNumber}</td>
                  <td className="p-4">{b.productName}</td>
                  <td className="p-4">{b.expiryDate}</td>
                  <td className="p-4">{b.quantityAvailable} / {b.totalQuantityReceived}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      b.status === "Released" ? "bg-green-100/10 text-green-700 border-green-700/20" :
                      b.status === "Quarantined" ? "bg-yellow-100/10 text-yellow-700 border-yellow-700/20" :
                      "bg-sienna/10 text-sienna border-sienna/20"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-text-muted">No inventory records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Dispensation Logs */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-signifier font-medium text-text-primary">Recent Dispensations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.flatMap(b => b.dispensations).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(d => (
             <div key={d.id} className="p-4 border border-border-subtle rounded-xl bg-surface-card shadow-sm">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-xs text-text-muted font-sohne">{d.dispensedDate}</span>
                   <span className="text-xs bg-surface-accent px-2 py-1 rounded-full text-text-primary border border-border-subtle">-{d.quantityDispensed} Units</span>
                </div>
                <div className="font-signifier text-text-primary">{d.subject?.subjectInitials || "Unknown"} ({d.subject?.screeningId})</div>
                <div className="text-xs text-text-secondary mt-1">Visit: {d.visitName} • By {d.dispensedBy}</div>
             </div>
          ))}
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-card border border-border-subtle shadow-steep-subtle w-full max-w-lg rounded-cards p-6">
            <h2 className="text-2xl font-signifier text-text-primary mb-6">Receive IP Batch</h2>
            <form onSubmit={handleAddBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Batch Number</label>
                  <input required className="steep-input w-full" value={batchForm.batchNumber} onChange={e => setBatchForm({...batchForm, batchNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Product Name</label>
                  <input required className="steep-input w-full" value={batchForm.productName} onChange={e => setBatchForm({...batchForm, productName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Mfg Date</label>
                  <input required type="date" className="steep-input w-full" value={batchForm.manufacturingDate} onChange={e => setBatchForm({...batchForm, manufacturingDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Expiry Date</label>
                  <input required type="date" className="steep-input w-full" value={batchForm.expiryDate} onChange={e => setBatchForm({...batchForm, expiryDate: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Quantity Received</label>
                  <input required type="number" className="steep-input w-full" value={batchForm.totalQuantityReceived} onChange={e => setBatchForm({...batchForm, totalQuantityReceived: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Status</label>
                  <select className="steep-input w-full" value={batchForm.status} onChange={e => setBatchForm({...batchForm, status: e.target.value})}>
                    <option>Quarantined</option>
                    <option>Released</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-subtle">
                <button type="button" onClick={() => setShowAddBatch(false)} className="steep-text-link">Cancel</button>
                <button type="submit" className="steep-pill-filled">Save Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {showDispense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-card border border-sienna/20 shadow-steep-subtle-2 w-full max-w-lg rounded-cards p-6">
            <h2 className="text-2xl font-signifier text-sienna mb-6">Dispense to Subject</h2>
            <form onSubmit={handleDispense} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Select Subject</label>
                <select required className="steep-input w-full" value={dispenseForm.subjectId} onChange={e => setDispenseForm({...dispenseForm, subjectId: e.target.value})}>
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.screeningId} ({s.subjectInitials})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Select Batch (Must be Released)</label>
                <select required className="steep-input w-full" value={dispenseForm.ipId} onChange={e => setDispenseForm({...dispenseForm, ipId: e.target.value})}>
                  <option value="">-- Choose Batch --</option>
                  {batches.filter(b => b.status === "Released" && b.quantityAvailable > 0).map(b => <option key={b.id} value={b.id}>{b.batchNumber} - {b.productName} ({b.quantityAvailable} avail)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Visit Name</label>
                  <input required className="steep-input w-full" placeholder="e.g. Visit 2" value={dispenseForm.visitName} onChange={e => setDispenseForm({...dispenseForm, visitName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Quantity</label>
                  <input required type="number" className="steep-input w-full" value={dispenseForm.quantityDispensed} onChange={e => setDispenseForm({...dispenseForm, quantityDispensed: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-sienna/10">
                <button type="button" onClick={() => setShowDispense(false)} className="steep-text-link">Cancel</button>
                <button type="submit" className="steep-pill-ghost border-sienna text-sienna hover:bg-sienna hover:text-white">Confirm Dispensation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
