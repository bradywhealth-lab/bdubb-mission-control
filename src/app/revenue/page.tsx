"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Panel, SectionHeading } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueCard {
  id: string;
  title: string;
  value: string;
  color: string;
}

const initialCards: RevenueCard[] = [
  { id: "kingcrm", title: "KingCRM MRR", value: "0", color: "border-cyan-400/40 bg-cyan-400/10" },
  { id: "trading", title: "Trading Bot P&L", value: "0", color: "border-green-400/40 bg-green-400/10" },
  { id: "content", title: "Content Revenue", value: "0", color: "border-purple-400/40 bg-purple-400/10" },
  { id: "total", title: "Total Revenue", value: "0", color: "border-yellow-400/40 bg-yellow-400/10" },
];

const sampleData = [
  { month: "Jan", target: 5000, actual: 4200 },
  { month: "Feb", target: 5500, actual: 4800 },
  { month: "Mar", target: 6000, actual: 5800 },
  { month: "Apr", target: 6500, actual: 6100 },
  { month: "May", target: 7000, actual: 5200 },
  { month: "Jun", target: 7500, actual: 6800 },
];

export default function RevenuePage() {
  const [cards, setCards] = useState<RevenueCard[]>(initialCards);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("revenueCards");
    if (stored) {
      setCards(JSON.parse(stored));
    }
  }, []);

  const saveCards = (updatedCards: RevenueCard[]) => {
    setCards(updatedCards);
    localStorage.setItem("revenueCards", JSON.stringify(updatedCards));
  };

  const startEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingId) {
      const updated = cards.map((card) =>
        card.id === editingId ? { ...card, value: editValue } : card
      );

      // Recalculate total
      const total = updated
        .filter((c) => c.id !== "total")
        .reduce((sum, card) => sum + (parseFloat(card.value) || 0), 0);

      saveCards(updated.map((c) => (c.id === "total" ? { ...c, value: total.toString() } : c)));
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <>
      <SectionHeading
        eyebrow="Financial Dashboard"
        title="Revenue"
        description="Track revenue streams across all projects. Click any card to edit values (saved to browser storage)."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`cursor-pointer rounded-[28px] border p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition hover:scale-105 ${card.color}`}
            onClick={() => startEdit(card.id, card.value)}
          >
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-white/60" />
              <div className={`h-2 w-2 rounded-full ${
                parseFloat(card.value) > 0 ? "bg-green-400" : "bg-gray-400"
              }`} />
            </div>
            <p className="mt-3 font-display text-xs uppercase tracking-[0.28em] text-white/60">{card.title}</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">
              {editingId === card.id ? (
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="w-full bg-transparent text-white outline-none"
                />
              ) : (
                formatCurrency(card.value)
              )}
            </p>
            {card.id !== "total" && (
              <div className="mt-2 flex items-center gap-1">
                {parseFloat(card.value) > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <p className="font-body text-xs text-white/50">
                  {parseFloat(card.value) > 0 ? "Positive" : "No revenue"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Panel className="mt-6 p-5">
        <h3 className="mb-4 font-display text-lg uppercase tracking-[0.2em] text-white">Monthly Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 17, 25, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "white",
              }}
            />
            <Bar dataKey="target" fill="rgba(0, 212, 255, 0.3)" name="Target" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="rgba(0, 212, 255, 0.8)" name="Actual" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </>
  );
}
