"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, bookingsApi, servicesApi, type Booking, type Service, type User, userApi } from "@/lib/api";
import Header from "../components/Header";
import UserBookingCalendar from "./components/UserBookingCalendar";
import UserProfile from "./components/UserProfile";

export default function AreaUtentePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'profile'>('dashboard');

  // Calendar/Booking State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [refreshCalendar, setRefreshCalendar] = useState(0);
  const [bookingForm, setBookingForm] = useState({
    serviceId: "",
    bookingDate: "",
    notes: "",
  });

  // Load User Data
  const loadData = async () => {
    try {
      const { user } = await userApi.getProfile();
      setUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    // Initial auth check
    const currentUser = authApi.getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser); // Set initial state from local storage/auth
    loadData(); // Fetch fresh profile
  }, [router]);

  // Load dependent data when user is ready
  useEffect(() => {
    if (user) {
      loadBookings();
      loadServices();
      setLoading(false);
    }
  }, [user]);

  const loadServices = async () => {
    try {
      const response = await servicesApi.getPublic();
      setServices(response.services);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await bookingsApi.getAll();
      setBookings(response.bookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    router.push("/");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedService = services.find(s => s.id === parseInt(bookingForm.serviceId));
    if (!selectedService) {
      alert("Seleziona un servizio");
      return;
    }

    try {
      await bookingsApi.create({
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        bookingDate: bookingForm.bookingDate,
        durationMinutes: selectedService.durationMinutes,
        notes: bookingForm.notes || undefined,
      });

      setShowBookingForm(false);
      setBookingForm({
        serviceId: "",
        bookingDate: "",
        notes: "",
      });
      loadBookings();
      setRefreshCalendar(prev => prev + 1);

    } catch (error: any) {
      alert(error.message || "Errore nella creazione della prenotazione");
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Sei sicuro di voler cancellare questa prenotazione?")) return;

    try {
      await bookingsApi.delete(id);
      loadBookings();
    } catch (error: any) {
      alert(error.message || "Errore nella cancellazione");
    }
  };

  if (!user && loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                Sultan Nails
              </span>

              {/* Desktop Tabs */}
              <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard'
                    ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'calendar'
                    ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Prenota
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile'
                    ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Profilo
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-white/40">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
                title="Esci"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex justify-around p-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-1 ${activeTab === 'dashboard' ? 'text-fuchsia-400' : 'text-white/40'
              }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-1 ${activeTab === 'calendar' ? 'text-fuchsia-400' : 'text-white/40'
              }`}
          >
            <span className="text-xl">📅</span>
            <span className="text-[10px] font-medium">Prenota</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-1 ${activeTab === 'profile' ? 'text-fuchsia-400' : 'text-white/40'
              }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-[10px] font-medium">Profilo</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-fuchsia-900/40 to-purple-900/40 border border-white/10 p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Ciao, {user.firstName}! 👋
                </h1>
                <p className="text-white/60 text-lg">
                  Benvenuto nella tua area personale.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:bg-white/[0.07] transition group cursor-pointer"
                onClick={() => setActiveTab('calendar')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Prossimo Appuntamento</h3>
                  <span className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 group-hover:scale-110 transition disable-group-hover">📅</span>
                </div>
                {bookings.filter(b => b.status === 'confirmed').length > 0 ? (
                  <p className="text-white text-sm">Hai {bookings.filter(b => b.status === 'confirmed').length} prenotazioni confermate.</p>
                ) : (
                  <p className="text-white/40 text-sm">Nessun appuntamento in programma</p>
                )}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-sm text-fuchsia-400 font-medium">+ Nuova Prenotazione</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Stato Account</h3>
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">✓</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {(user.firstName || '?').charAt(0)}{(user.lastName || '?').charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">Membro Attivo</div>
                    <div className="text-white/40 text-xs">Iscritto dal {new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="animate-fade-in">
            {/* Booking Form Overlay */}
            {showBookingForm && (
              <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">
                <h2 className="mb-6 text-2xl font-bold text-white">Nuova Prenotazione</h2>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/90">
                        Servizio *
                      </label>
                      <select
                        value={bookingForm.serviceId}
                        onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
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
                        {services.map((service) => (
                          <option key={service.id} value={service.id} className="bg-[#0f1018]">
                            {service.name} - €{Number(service.price).toFixed(2)} ({service.durationMinutes} min)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/90">
                        Data e Ora *
                      </label>
                      <input
                        type="datetime-local"
                        value={bookingForm.bookingDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">
                      Note
                    </label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                      placeholder="Note aggiuntive..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 font-bold text-white shadow-xl shadow-fuchsia-500/40 transition hover:-translate-y-0.5"
                  >
                    Crea Prenotazione
                  </button>
                </form>
              </div>
            )}

            {/* View Toggle */}
            <div className="mb-6 flex gap-4 border-b border-white/10">
              <button
                onClick={() => setViewMode('calendar')}
                className={`pb-4 px-4 font-semibold transition ${viewMode === 'calendar' ? 'border-b-2 border-fuchsia-400 text-fuchsia-300' : 'text-white/60 hover:text-white'}`}
              >
                📅 Calendario
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`pb-4 px-4 font-semibold transition ${viewMode === 'list' ? 'border-b-2 border-fuchsia-400 text-fuchsia-300' : 'text-white/60 hover:text-white'}`}
              >
                📋 Le mie prenotazioni
              </button>
              <button
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="ml-auto rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-2 font-bold text-white shadow-xl shadow-fuchsia-500/40 transition hover:-translate-y-0.5 text-sm"
              >
                {showBookingForm ? "Chiudi Form" : "+ Nuova"}
              </button>
            </div>

            {viewMode === 'calendar' ? (
              <UserBookingCalendar
                refreshTrigger={refreshCalendar}
                onTimeSlotClick={(date) => {
                  const dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                  setBookingForm(prev => ({ ...prev, bookingDate: dateStr }));
                  setShowBookingForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h2 className="mb-6 text-2xl font-bold text-white">Le tue prenotazioni</h2>

                {bookings.length === 0 ? (
                  <div className="text-center text-white/70">
                    Nessuna prenotazione attiva.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/8"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-3">
                              <h3 className="text-xl font-bold text-white">{booking.serviceName}</h3>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'confirmed'
                                  ? 'bg-green-500/20 text-green-300'
                                  : booking.status === 'completed'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : booking.status === 'cancelled'
                                      ? 'bg-red-500/20 text-red-300'
                                      : 'bg-yellow-500/20 text-yellow-300'
                                  }`}
                              >
                                {booking.status === 'pending' && 'In attesa'}
                                {booking.status === 'confirmed' && 'Confermata'}
                                {booking.status === 'completed' && 'Completata'}
                                {booking.status === 'cancelled' && 'Cancellata'}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-white/70">
                              <div>
                                📅 {new Date(booking.bookingDate).toLocaleString('it-IT')}
                              </div>
                              {booking.servicePrice && (
                                <div>💶 €{booking.servicePrice}</div>
                              )}
                              <div>⏱️ {booking.durationMinutes} minuti</div>
                              {booking.notes && <div>📝 {booking.notes}</div>}
                            </div>
                          </div>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                            >
                              Cancella
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <UserProfile userData={user} onUpdate={loadData} />
        )}

      </main>
    </div>
  );
}
