"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, bookingsApi, servicesApi, type Booking, type Service, type User, userApi } from "@/lib/api";
import Header from "../components/Header";
import UserBookingCalendar from "./components/UserBookingCalendar";
import UserProfile from "./components/UserProfile";
import ServiceSelector from "./components/ServiceSelector";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

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
  const [isBooking, setIsBooking] = useState(false);

  // New Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    serviceId: "",
    bookingDate: "",
    notes: "",
  });

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
    const currentUser = authApi.getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    loadData();
  }, [router]);

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

    setIsBooking(true);

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
    } finally {
      setIsBooking(false);
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setBookingToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return;

    setIsDeleting(true);
    try {
      await bookingsApi.delete(bookingToDelete);
      loadBookings();
      setDeleteModalOpen(false);
      setBookingToDelete(null);
      setRefreshCalendar(prev => prev + 1);
    } catch (error: any) {
      alert(error.message || "Errore nella cancellazione");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user && loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-zinc-300"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-purple-900 selection:text-zinc-100">
      {/* Background Metallic Elements */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#030303] to-[#030303]" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-b from-zinc-100 via-zinc-400 to-zinc-800 bg-clip-text text-transparent uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                Sultan Nails
              </span>

              {/* Desktop Tabs */}
              <div className="hidden md:flex items-center gap-2 p-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'dashboard'
                    ? 'text-zinc-100 border-b-2 border-purple-500 bg-white/5 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'calendar'
                    ? 'text-zinc-100 border-b-2 border-purple-500 bg-white/5 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                  Prenota
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'profile'
                    ? 'text-zinc-100 border-b-2 border-purple-500 bg-white/5 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                  Profilo
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  setViewMode('list');
                }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 transition-all bg-black/50 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                title="Le mie prenotazioni"
              >
                <span>[X]</span>
                <span>Prenotazioni</span>
              </button>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-300">{user.firstName} {user.lastName}</div>
                <div className="text-[10px] text-zinc-600 font-mono">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 border border-transparent hover:border-red-500/50 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Esci"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-md border-t border-zinc-800 pb-safe">
        <div className="flex justify-around p-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${activeTab === 'dashboard' ? 'text-zinc-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-zinc-600'
              }`}
          >
            <span className="text-xl">⬡</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${activeTab === 'calendar' ? 'text-zinc-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-zinc-600'
              }`}
          >
            <span className="text-xl">⬢</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">Prenota</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${activeTab === 'profile' ? 'text-zinc-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-zinc-600'
              }`}
          >
            <span className="text-xl">⎔</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">Profilo</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in relative">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-[#0a0a0a] border border-zinc-800/80 p-8 sm:p-12 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(255,255,255,0.02)] isolate">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
              <div className="relative z-10">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-2 font-mono drop-shadow-md">
                  // Area Personale
                </p>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-white via-zinc-400 to-zinc-900 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]" style={{ WebkitTextStroke: '0.5px rgba(255,255,255,0.1)' }}>
                  Ciao,<br/>{user.firstName}
                </h1>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-[#0a0a0a] border border-zinc-800 p-6 sm:p-8 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden"
                onClick={() => setActiveTab('calendar')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">Prossimo App.to</h3>
                    <span className="text-purple-400/50 group-hover:text-purple-400 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">⬢</span>
                  </div>
                  {bookings.filter(b => b.status === 'confirmed').length > 0 ? (
                    <p className="text-zinc-100 text-3xl font-black tracking-tighter bg-gradient-to-r from-zinc-200 to-zinc-600 bg-clip-text text-transparent">{bookings.filter(b => b.status === 'confirmed').length} ATTIVI</p>
                  ) : (
                    <p className="text-zinc-500 text-sm font-mono uppercase">Nessun appuntamento in programma</p>
                  )}
                  <div className="mt-8 pt-4 border-t border-zinc-800/50 flex justify-between items-center group-hover:border-purple-500/30 transition-colors">
                    <span className="text-xs font-bold font-mono tracking-widest text-zinc-400 group-hover:text-purple-300 uppercase transition-colors">Nuova Prenotazione</span>
                    <span className="text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-purple-300">→</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-zinc-800 p-6 sm:p-8 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">Stato Account</h3>
                  <span className="text-emerald-500/50 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">●</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 border border-zinc-700 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-zinc-300 font-black text-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
                    {(user.firstName || '?').charAt(0)}{(user.lastName || '?').charAt(0)}
                  </div>
                  <div>
                    <div className="text-zinc-100 font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-emerald-100 to-emerald-600 bg-clip-text text-transparent">Membro Attivo</div>
                    <div className="text-zinc-500 text-xs font-mono tracking-widest mt-1">ID: {user.id} // DAL {new Date(user.createdAt || Date.now()).getFullYear()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="animate-fade-in relative z-10 w-full h-full min-h-[500px]">
             {/* View Toggle */}
             <div className="mb-6 flex gap-4 border-b border-zinc-800">
              <button
                onClick={() => setViewMode('calendar')}
                className={`pb-4 px-4 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'border-b-2 border-purple-500 text-zinc-100 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Calendario
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`pb-4 px-4 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'border-b-2 border-purple-500 text-zinc-100 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Lista Dettagli
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
                <div className="border border-zinc-800 bg-[#0a0a0a] p-8 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Archivio Prenotazioni</h2>

                {bookings.length === 0 ? (
                  <div className="text-center text-zinc-600 font-mono text-xs uppercase tracking-widest py-10">
                    // Nessun record trovato //
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-zinc-800/50 bg-[#080808] p-6 transition-all hover:border-zinc-600"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-200">{booking.serviceName}</h3>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${booking.status === 'confirmed'
                                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                                  : booking.status === 'completed'
                                    ? 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                                    : booking.status === 'cancelled'
                                      ? 'border-red-500/30 text-red-400 bg-red-500/5'
                                      : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5'
                                  }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs font-mono text-zinc-500 uppercase">
                              <div>
                                {new Date(booking.bookingDate).toLocaleString('it-IT')}
                              </div>
                              {booking.servicePrice && (
                                <div>€{booking.servicePrice} // {booking.durationMinutes} MIN</div>
                              )}
                              {booking.notes && <div className="text-zinc-600">[{booking.notes}]</div>}
                            </div>
                          </div>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleOpenDeleteModal(booking.id)}
                              className="border border-red-900 bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 transition hover:bg-red-900/20"
                            >
                              Annulla
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
        {activeTab === 'profile' && (
             <div className="border border-zinc-800 bg-[#0a0a0a] p-8 shadow-[0_0_20px_rgba(0,0,0,0.8)] text-zinc-300">
                <UserProfile userData={user} onUpdate={loadData} />
             </div>
        )}
      </main>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
