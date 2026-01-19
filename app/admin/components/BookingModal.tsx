"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { adminApi, servicesApi, type User, type Service } from "@/lib/api";

interface BookingModalProps {
  booking: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialDate?: Date;
  users?: User[];
  services?: Service[];
}

export default function BookingModal({
  booking,
  isOpen,
  onClose,
  onSave,
  initialDate,
  users = [],
  services = [],
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    serviceId: "",
    bookingDate: "",
    notes: "",
    status: "pending",
    userId: "",
    userEmail: "",
    userFirstName: "",
    userLastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await servicesApi.getAll();
        setAvailableServices(response.services);
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    if (services.length === 0) {
      loadServices();
    } else {
      setAvailableServices(services);
    }
  }, [services]);

  useEffect(() => {
    if (booking) {
      const bookingDate = parseISO(booking.booking_date);
      setFormData({
        serviceId: booking.service_id?.toString() || "",
        bookingDate: format(bookingDate, "yyyy-MM-dd'T'HH:mm"),
        notes: booking.notes || "",
        status: booking.status || "pending",
        userId: booking.user_id?.toString() || "",
        userEmail: booking.email || "",
        userFirstName: booking.first_name || "",
        userLastName: booking.last_name || "",
      });
    } else if (initialDate) {
      setFormData({
        serviceId: "",
        bookingDate: format(initialDate, "yyyy-MM-dd'T'HH:mm"),
        notes: "",
        status: "pending",
        userId: "",
        userEmail: "",
        userFirstName: "",
        userLastName: "",
      });
    }
  }, [booking, initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (booking) {
        // Update existing booking status
        await adminApi.updateBookingStatus(booking.id, formData.status as any);
      } else {
        // Create new booking - need userId and serviceId
        if (!formData.userId) {
          setError("Seleziona un utente per creare la prenotazione");
          setLoading(false);
          return;
        }
        if (!formData.serviceId) {
          setError("Seleziona un servizio");
          setLoading(false);
          return;
        }
        const selectedService = availableServices.find(s => s.id === parseInt(formData.serviceId));
        if (!selectedService) {
          setError("Servizio non trovato");
          setLoading(false);
          return;
        }
        await adminApi.createBooking({
          userId: parseInt(formData.userId),
          serviceName: selectedService.name,
          servicePrice: selectedService.price,
          bookingDate: formData.bookingDate,
          durationMinutes: selectedService.durationMinutes,
          notes: formData.notes || undefined,
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
          {booking ? "Modifica Prenotazione" : "Nuova Prenotazione"}
        </h2>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {!booking && (
              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">
                  Servizio *
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceId: e.target.value })
                  }
                  required
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '16px',
                  }}
                >
                  <option value="" className="bg-[#0f1018]">Seleziona un servizio</option>
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id} className="bg-[#0f1018]">
                      {service.name} - €{service.price.toFixed(2)} ({service.durationMinutes} min)
                    </option>
                  ))}
                </select>
                {formData.serviceId && (() => {
                  const selected = availableServices.find(s => s.id === parseInt(formData.serviceId));
                  return selected ? (
                    <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">{selected.name}</p>
                      {selected.description && (
                        <p className="mt-1 text-xs text-white/70">{selected.description}</p>
                      )}
                      <p className="mt-1 text-xs text-fuchsia-300">
                        €{selected.price.toFixed(2)} • {selected.durationMinutes} minuti
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {booking && (
              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">
                  Servizio
                </label>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                  {booking.service_name}
                  {booking.service_price && ` - €${booking.service_price}`}
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">
                Data e Ora *
              </label>
              <input
                type="datetime-local"
                value={formData.bookingDate}
                onChange={(e) =>
                  setFormData({ ...formData, bookingDate: e.target.value })
                }
                required
                disabled={!!booking}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20 disabled:opacity-50"
              />
            </div>

            {!booking && (
              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">
                  Cliente *
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  required
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                >
                  <option value="" className="bg-[#0f1018]">
                    Seleziona un cliente
                  </option>
                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                      className="bg-[#0f1018]"
                    >
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">
                Stato
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
              >
                <option value="pending" className="bg-[#0f1018]">
                  In attesa
                </option>
                <option value="confirmed" className="bg-[#0f1018]">
                  Confermata
                </option>
                <option value="completed" className="bg-[#0f1018]">
                  Completata
                </option>
                <option value="cancelled" className="bg-[#0f1018]">
                  Cancellata
                </option>
              </select>
            </div>
          </div>

          {booking && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-white/70">
                Cliente
              </h3>
              <p className="text-white">
                {formData.userFirstName} {formData.userLastName}
              </p>
              <p className="text-sm text-white/60">{formData.userEmail}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Note
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
              placeholder="Note aggiuntive..."
            />
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

