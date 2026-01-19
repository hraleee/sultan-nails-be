"use client";

import { useState, useEffect } from "react";
import { servicesApi, type Service } from "@/lib/api";

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ServiceModal({
  service,
  isOpen,
  onClose,
  onSave,
}: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "60",
    isVisible: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price?.toString() || "",
        durationMinutes: service.durationMinutes?.toString() || "60",
        isVisible: service.isVisible !== undefined ? service.isVisible : true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        durationMinutes: "60",
        isVisible: true,
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (service) {
        await servicesApi.update(service.id, {
          name: formData.name,
          description: formData.description || undefined,
          price: parseFloat(formData.price),
          durationMinutes: parseInt(formData.durationMinutes) || 60,
          isVisible: formData.isVisible,
        });
      } else {
        await servicesApi.create({
          name: formData.name,
          description: formData.description || undefined,
          price: parseFloat(formData.price),
          durationMinutes: parseInt(formData.durationMinutes) || 60,
          isVisible: formData.isVisible,
        });
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "Errore nel salvataggio");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f1018] to-black p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-xl bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        <h2 className="mb-6 text-3xl font-bold text-white">
          {service ? "Modifica Servizio" : "Nuovo Servizio"}
        </h2>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Nome Servizio *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
              placeholder="Es: Signature Gel"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Descrizione
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
              placeholder="Descrizione del servizio..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">
                Prezzo (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                placeholder="60.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">
                Durata (minuti) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: e.target.value })
                }
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
                className="h-5 w-5 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-400/30"
              />
              <span className="text-sm font-medium text-white/90">
                Visibile ai clienti
              </span>
            </label>
            <p className="mt-1 text-xs text-white/60">
              Se deselezionato, il servizio non sarà visibile nella lista per i clienti
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 font-bold text-white shadow-xl shadow-fuchsia-500/40 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? "Salvataggio..." : "Salva"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

