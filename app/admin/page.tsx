"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, adminApi, servicesApi, type Booking, type User, type Service } from "@/lib/api";
import AdminHeader from "./components/AdminHeader";
import BookingCalendar from "./components/BookingCalendar";
import BookingModal from "./components/BookingModal";
import ServiceModal from "./components/ServiceModal";
import UserList from "./components/UserList";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "calendar" | "users" | "services" | "stats">("calendar");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = authApi.getUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check authentication on mount
    const currentUser = authApi.getUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      router.push("/area-utente");
      return;
    }

    setUser(currentUser);
  }, [mounted, router]);

  useEffect(() => {
    // Load data when user is set and tab changes
    if (user && user.role === "admin") {
      if (activeTab === "bookings" || activeTab === "calendar") {
        loadBookings();
        // Load users for calendar modal
        if (activeTab === "calendar" && users.length === 0) {
          loadUsers();
        }
      } else if (activeTab === "services") {
        loadServices();
      } else {
        loadData();
      }
    }
  }, [user, activeTab]);

  const loadUsers = async () => {
    try {
      const usersRes = await adminApi.getAllUsers();
      setUsers(usersRes.users);
    } catch (error: any) {
      console.error("Error loading users:", error);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      const servicesRes = await servicesApi.getAll();
      setServices(servicesRes.services);
    } catch (error: any) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const bookingsRes = await adminApi.getAllBookings();
      setBookings(bookingsRes.bookings);
    } catch (error: any) {
      console.error("Error loading bookings:", error);
      if (error.message?.includes("401") || error.message?.includes("non valido")) {
        authApi.logout();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (!user || user.role !== "admin") return;

    setLoading(true);
    try {
      if (activeTab === "users") {
        await loadUsers();
      } else if (activeTab === "stats") {
        const statsRes = await adminApi.getStats();
        setStats(statsRes);
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      // If unauthorized, redirect to login
      if (error.message?.includes("401") || error.message?.includes("non valido") || error.message?.includes("Token")) {
        authApi.logout();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, status: string) => {
    setUpdatingBookingId(bookingId);
    try {
      await adminApi.updateBookingStatus(bookingId, status as any);
      // Ricarica le prenotazioni
      await loadBookings();
    } catch (error: any) {
      alert(error.message || "Errore nell'aggiornamento");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    router.push("/");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0f1018] to-black pt-24 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center text-white/70">Caricamento...</div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">Area Admin</h1>
            <p className="mt-2 text-white/70">Pannello di controllo</p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`pb-4 px-4 font-semibold transition ${activeTab === "calendar"
                ? "border-b-2 border-fuchsia-400 text-fuchsia-300"
                : "text-white/60 hover:text-white/80"
                }`}
            >
              📅 Calendario
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-4 px-4 font-semibold transition ${activeTab === "bookings"
                ? "border-b-2 border-fuchsia-400 text-fuchsia-300"
                : "text-white/60 hover:text-white/80"
                }`}
            >
              Lista Prenotazioni
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-4 px-4 font-semibold transition ${activeTab === "users"
                ? "border-b-2 border-fuchsia-400 text-fuchsia-300"
                : "text-white/60 hover:text-white/80"
                }`}
            >
              Utenti
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-4 px-4 font-semibold transition ${activeTab === "services"
                ? "border-b-2 border-fuchsia-400 text-fuchsia-300"
                : "text-white/60 hover:text-white/80"
                }`}
            >
              Servizi
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`pb-4 px-4 font-semibold transition ${activeTab === "stats"
                ? "border-b-2 border-fuchsia-400 text-fuchsia-300"
                : "text-white/60 hover:text-white/80"
                }`}
            >
              Statistiche
            </button>
          </div>

          {/* Content */}
          {activeTab === "calendar" ? (
            <BookingCalendar
              bookings={bookings}
              onBookingClick={(booking) => {
                setSelectedBooking(booking);
                setIsModalOpen(true);
              }}
              onTimeSlotClick={(date) => {
                setSelectedTimeSlot(date);
                setSelectedBooking(null);
                setIsModalOpen(true);
              }}
              onRefresh={loadBookings}
            />
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              {loading ? (
                <div className="text-center text-white/70">Caricamento...</div>
              ) : activeTab === "bookings" ? (
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center text-white/70">Nessuna prenotazione</div>
                  ) : (
                    bookings.map((booking: any) => (
                      <div
                        key={booking.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6"
                      >
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white">{booking.service_name}</h3>
                            <p className="text-sm text-white/60">
                              {booking.first_name} {booking.last_name} ({booking.email})
                            </p>
                          </div>
                          <div className="relative min-w-[200px]">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70">
                              Stato
                            </label>
                            <div className="relative">
                              {updatingBookingId === booking.id ? (
                                <div className="flex items-center justify-center rounded-xl border-2 border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-6 py-3">
                                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-fuchsia-400 border-t-transparent"></div>
                                  <span className="ml-2 text-sm text-white/70">Aggiornamento...</span>
                                </div>
                              ) : (
                                <>
                                  <select
                                    value={booking.status}
                                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                    disabled={updatingBookingId !== null}
                                    className="w-full appearance-none rounded-xl border-2 border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-6 py-3 pr-12 text-base font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:border-fuchsia-400/50 hover:from-white/15 hover:to-white/10 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 1rem center',
                                      backgroundSize: '16px',
                                    }}
                                  >
                                    <option value="pending" className="bg-[#0f1018] text-yellow-300 font-semibold">⏳ In attesa</option>
                                    <option value="confirmed" className="bg-[#0f1018] text-green-300 font-semibold">✅ Confermata</option>
                                    <option value="completed" className="bg-[#0f1018] text-blue-300 font-semibold">✔️ Completata</option>
                                    <option value="cancelled" className="bg-[#0f1018] text-red-300 font-semibold">❌ Cancellata</option>
                                  </select>
                                  {/* Status badge indicator */}
                                  <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <span
                                      className={`inline-flex h-3 w-3 rounded-full ${booking.status === 'confirmed'
                                        ? 'bg-green-400 shadow-lg shadow-green-400/50'
                                        : booking.status === 'completed'
                                          ? 'bg-blue-400 shadow-lg shadow-blue-400/50'
                                          : booking.status === 'cancelled'
                                            ? 'bg-red-400 shadow-lg shadow-red-400/50'
                                            : 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                                        }`}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-white/70">
                          <div>📅 {new Date(booking.booking_date).toLocaleString('it-IT')}</div>
                          {booking.service_price && <div>💶 €{booking.service_price}</div>}
                          {booking.notes && <div>📝 {booking.notes}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === "users" ? (
                <UserList users={users} onUserDetailsChange={loadUsers} />
              ) : activeTab === "services" ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Gestione Servizi</h2>
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        setIsServiceModalOpen(true);
                      }}
                      className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 font-bold text-white shadow-xl shadow-fuchsia-500/40 transition hover:-translate-y-0.5"
                    >
                      + Nuovo Servizio
                    </button>
                  </div>

                  {services.length === 0 ? (
                    <div className="text-center text-white/70">Nessun servizio. Crea il primo servizio!</div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-6"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white">{service.name}</h3>
                              {service.description && (
                                <p className="mt-1 text-sm text-white/70">{service.description}</p>
                              )}
                              <div className="mt-3 flex items-center gap-4 text-sm">
                                <span className="font-semibold text-fuchsia-300">
                                  €{Number(service.price).toFixed(2)}
                                </span>
                                <span className="text-white/60">
                                  ⏱️ {service.durationMinutes} min
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${service.isVisible
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-gray-500/20 text-gray-300"
                                  }`}
                              >
                                {service.isVisible ? "Visibile" : "Nascosto"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await servicesApi.update(service.id, {
                                    isVisible: !service.isVisible,
                                  });
                                  loadServices();
                                } catch (error: any) {
                                  alert(error.message || "Errore nell'aggiornamento");
                                }
                              }}
                              className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              {service.isVisible ? "Nascondi" : "Mostra"}
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Sei sicuro di voler eliminare questo servizio?")) {
                                  try {
                                    await servicesApi.delete(service.id);
                                    loadServices();
                                  } catch (error: any) {
                                    alert(error.message || "Errore nella cancellazione");
                                  }
                                }
                              }}
                              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                            >
                              Elimina
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                stats && (
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h3 className="mb-2 text-sm text-white/70">Prenotazioni in attesa</h3>
                      <p className="text-3xl font-bold text-white">
                        {stats.bookings.byStatus.find((s: any) => s.status === "pending")?.count || 0}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h3 className="mb-2 text-sm text-white/70">Prenotazioni future</h3>
                      <p className="text-3xl font-bold text-white">{stats.bookings.upcoming}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h3 className="mb-2 text-sm text-white/70">Utenti totali</h3>
                      <p className="text-3xl font-bold text-white">{stats.users.total}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Booking Modal */}
          <BookingModal
            booking={selectedBooking}
            isOpen={isModalOpen}
            users={users}
            services={services}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedBooking(null);
              setSelectedTimeSlot(null);
            }}
            onSave={() => {
              loadBookings();
            }}
            initialDate={selectedTimeSlot || undefined}
          />

          {/* Service Modal */}
          <ServiceModal
            service={selectedService}
            isOpen={isServiceModalOpen}
            onClose={() => {
              setIsServiceModalOpen(false);
              setSelectedService(null);
            }}
            onSave={() => {
              loadServices();
            }}
          />
        </div>
      </main>
    </>
  );
}
