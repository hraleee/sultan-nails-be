"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addHours, setHours, setMinutes, isToday, parseISO, addDays, subDays, addWeeks, subWeeks, isWeekend, addMinutes } from "date-fns";
import { it } from "date-fns/locale";
import { bookingsApi, Booking } from "@/lib/api";

interface BookingCalendarProps {
    onTimeSlotClick: (date: Date) => void;
    refreshTrigger: number;
}

export default function BookingCalendar({
    onTimeSlotClick,
    refreshTrigger
}: BookingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<"month" | "day">("month");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [busySlots, setBusySlots] = useState<{ date: Date; duration: number }[]>([]);
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    // Delete Confirmation State
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editInfoModalOpen, setEditInfoModalOpen] = useState(false);
    const [closedModalOpen, setClosedModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
    const [pranzoModalOpen, setPranzoModalOpen] = useState(false);


    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Slots dalle 9 alle 19 (ogni 30 minuti)
    // 09:00, 09:30, ... 18:30 (Last slot starts at 18:30, ends at 19:00)
    // 19:00 is closing time, so no slot starts at 19:00 unless we want to allow 0 duration? No.
    const timeSlots: Date[] = [];
    const baseDate = new Date();
    baseDate.setHours(9, 0, 0, 0);
    // Until 18:30 inclusive
    for (let i = 0; i < 20; i++) { // 10 hours * 2 = 20 slots
        timeSlots.push(addMinutes(baseDate, i * 30));
    }

    useEffect(() => {
        loadData();
    }, [currentDate, refreshTrigger]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load Availability
            const from = format(subMonths(currentDate, 1), 'yyyy-MM-dd');
            const to = format(addMonths(currentDate, 2), 'yyyy-MM-dd');

            const [paramsRes, myBookingsRes] = await Promise.all([
                bookingsApi.getAvailability(from, to),
                bookingsApi.getAll()
            ]);

            // busySlots needs to store duration now to calculate overlap
            // We'll store objects or just raw data
            const slots = paramsRes.slots.map(s => ({
                date: parseISO(s.booking_date),
                duration: s.duration_minutes || 60
            }));
            setBusySlots(slots);
            setMyBookings(myBookingsRes.bookings);
        } catch (error) {
            console.error("Error loading calendar data", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setBookingToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!bookingToDelete) return;
        try {
            await bookingsApi.delete(bookingToDelete);
            setMessage({ text: "Prenotazione cancellata con successo", type: 'success' });
            setDeleteModalOpen(false);
            setBookingToDelete(null);
            loadData(); // Refresh
        } catch (error) {
            setMessage({ text: "Errore durante la cancellazione", type: 'error' });
        }
    };

    // Helper: Find if a slot belongs to the current user
    const getMyBooking = (slotDate: Date) => {
        // Check if any of my bookings COVERS this slot
        return myBookings.find(b => {
            const bookingStart = parseISO(b.bookingDate);
            const duration = b.durationMinutes || 60;
            const bookingEnd = addMinutes(bookingStart, duration);

            // Slot is occupied if: SlotTime >= BookingStart AND SlotTime < BookingEnd
            // WE compare timestamps
            return slotDate.getTime() >= bookingStart.getTime() && slotDate.getTime() < bookingEnd.getTime();
        });
    };

    const isSlotBusy = (slotDate: Date) => {
        // Check if any busy slot COVERS this slot
        return busySlots.some((booking: any) => {
            const bookingStart = booking.date;
            const duration = booking.duration;
            const bookingEnd = addMinutes(bookingStart, duration);

            return slotDate.getTime() >= bookingStart.getTime() && slotDate.getTime() < bookingEnd.getTime();
        });
    };

    const handleDateClick = (date: Date) => {
        if (isWeekend(date)) {
            setClosedModalOpen(true);
            return;
        }
        setSelectedDate(date);
        setCurrentDate(date);
        setView("day");
    };

    // Navigation Handlers (Same as before)
    const handlePrev = () => {
        if (view === "day") {
            const newDate = subDays(selectedDate || currentDate, 1);
            setCurrentDate(newDate);
            setSelectedDate(newDate);
        } else {
            setCurrentDate(subMonths(currentDate, 1));
        }
    };

    const handleNext = () => {
        if (view === "day") {
            const newDate = addDays(selectedDate || currentDate, 1);
            setCurrentDate(newDate);
            setSelectedDate(newDate);
        } else {
            setCurrentDate(addMonths(currentDate, 1));
        }
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const getDisplayText = () => {
        if (view === "day") {
            return format(selectedDate || currentDate, "EEEE d MMMM yyyy", { locale: it });
        } else {
            return format(currentDate, "MMMM yyyy", { locale: it });
        }
    };

    // Render Slot Logic
    const renderSlot = (date: Date) => {
        const myBooking = getMyBooking(date);
        const busy = isSlotBusy(date);
        const isPast = date < new Date();
        const isClosed = isWeekend(date);

        if (myBooking) {
            // Only show details on the START slot to avoid repetition? 
            // Or show simplified view. Let's show full for now or condensed.
            // If it's the exact start time, show title.
            const bookingStart = parseISO(myBooking.bookingDate);
            const isStart = isSameDay(bookingStart, date) && bookingStart.getHours() === date.getHours() && bookingStart.getMinutes() === date.getMinutes();

            return (
                <div className={`rounded-xl border border-purple-500/30 bg-purple-500/10 p-2 relative group h-full flex flex-col justify-center ${!isStart ? 'opacity-80 border-t-0 rounded-t-none' : ''}`}>
                    {isStart && (
                        <>
                            <div className="text-purple-300 font-medium text-sm mb-1 leading-tight">La tua prenotazione</div>
                            <div className="text-white/80 text-xs font-light truncate">{myBooking.serviceName}</div>
                            <div className="absolute right-2 top-2 hidden group-hover:flex gap-2 z-10">
                                <button
                                    onClick={() => {
                                        setEditInfoModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition text-xs"
                                    title="Modifica"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => confirmDelete(myBooking.id)}
                                    className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition text-xs"
                                    title="Elimina"
                                >
                                    🗑️
                                </button>
                            </div>
                        </>
                    )}
                </div>
            );
        }

        if (isClosed) {
            return (
                <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-2 text-red-400/30 text-sm italic cursor-not-allowed font-light h-full flex items-center">
                    Chiuso
                </div>
            );
        }

        if (busy) {
            return (
                <div className="rounded-xl bg-white/5 border border-white/5 p-2 text-white/30 text-sm italic cursor-not-allowed font-light h-full flex items-center">
                    Occupato
                </div>
            );
        }

        if (isPast) {
            return (
                <div className="rounded-xl bg-white/5 border border-white/5 p-2 text-white/20 text-sm italic cursor-not-allowed font-light h-full flex items-center">
                    Non disponibile
                </div>
            );
        }

        return (
            <button
                onClick={() => onTimeSlotClick(date)}
                className="w-full h-full rounded-xl border border-purple-500/30 bg-purple-500/10 p-2 text-purple-300 font-medium hover:bg-purple-500/20 transition text-left flex items-center"
            >
                + Prenota
            </button>
        );
    };

    const renderCompactSlot = (date: Date) => {
        const myBooking = getMyBooking(date);
        const busy = isSlotBusy(date);
        const isPast = date < new Date();
        const isClosed = isWeekend(date);

        if (myBooking) {
            return (
                <div className="h-full rounded-md bg-fuchsia-500/30 border border-fuchsia-500/50 cursor-pointer relative group" title="La tua prenotazione">
                    {/* Mini actions on hover for week view */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1 bg-black/90 p-1 rounded-lg z-10">
                        <button
                            onClick={(e) => { e.stopPropagation(); confirmDelete(myBooking.id); }}
                            className="text-red-400 text-xs px-2"
                        >
                            Elimina
                        </button>
                    </div>
                </div>
            );
        }
        if (isClosed) return <div className="h-full rounded-md bg-red-500/10 border border-red-500/5 cursor-not-allowed" title="Chiuso"></div>;
        if (busy) return <div className="h-full rounded-md bg-white/10 border border-white/5 cursor-not-allowed" title="Occupato"></div>;
        if (isPast) return <div className="h-full rounded-md bg-white/5 border border-white/5 opacity-50 cursor-not-allowed" title="Non disponibile"></div>;

        return (
            <button
                onClick={() => onTimeSlotClick(date)}
                className="h-full w-full rounded-md border border-fuchsia-500/20 bg-fuchsia-500/5 hover:bg-fuchsia-500/20 transition"
                title="Prenota"
            />
        );
    };


    return (
        <div className="space-y-6 relative">
            {/* Alert Message */}
            {message && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                    {message.text}
                    {setTimeout(() => setMessage(null), 3000) && ""}
                </div>
            )}

            {/* Controls (Keep existing controls) */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={handlePrev} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10">←</button>
                    <h2 className="text-2xl font-light text-white min-w-[250px] text-center capitalize tracking-wide">{getDisplayText()}</h2>
                    <button onClick={handleNext} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10">→</button>
                    {/* <button onClick={handleToday} className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 transition hover:bg-purple-500/20">Oggi</button> */}
                </div>
                <div className="flex gap-2">
                    {["month", "day"].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v as any)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition capitalize ${view === v ? "bg-purple-500/20 text-purple-300 border border-purple-500/20" : "bg-white/5 text-white/60 hover:bg-white/10 border border-transparent"}`}
                        >
                            {v === 'month' ? 'Mese' : 'Giorno'}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <div className="text-center text-white/50 text-sm h-1">Caricamento disponibilità...</div>}

            {/* Calendar View */}
            {view === "month" && (
                <div className="rounded-3xl border border-purple-200/10 bg-purple-500/5 p-6 backdrop-blur-sm">
                    <div className="mb-4 grid grid-cols-7 gap-2">
                        {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
                            <div key={day} className="py-2 text-center text-sm font-medium text-white/60 uppercase tracking-widest text-[10px]">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, idx) => {
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const isCurrentDay = isToday(day);
                            const isWeekendDay = isWeekend(day);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleDateClick(day)}
                                    className={`min-h-[80px] sm:min-h-[100px] cursor-pointer rounded-xl border p-2 transition hover:border-purple-400/50 flex flex-col justify-between ${isCurrentMonth ? "border-white/5 bg-black/20" : "border-transparent bg-transparent opacity-30"
                                        } ${isCurrentDay ? "ring-1 ring-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : ""}`}
                                >
                                    <div className={`mb-1 text-sm font-medium ${isCurrentDay ? "text-purple-300" : "text-white/60"}`}>
                                        {format(day, "d")}
                                    </div>

                                    {/* Open/Closed logic - Mobile Optimized */}
                                    {isCurrentMonth && (
                                        <div className="mt-auto">
                                            {isWeekendDay ? (
                                                <div className="h-1.5 w-full rounded-full bg-red-500/20"></div>
                                            ) : (
                                                <div className="h-1.5 w-full rounded-full bg-emerald-500/20"></div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {(view === "day") && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 max-h-[600px] overflow-y-auto overflow-x-auto">
                    {view === "day" ? (
                        <div className="space-y-4">
                            {timeSlots.map((slotBase, idx) => {
                                // slotBase is a Date object with correct HOURS and MINUTES (e.g. 09:30)
                                // We need to apply these hours/minutes to the 'selectedDate'
                                const slotDate = new Date(selectedDate || currentDate);
                                slotDate.setHours(slotBase.getHours(), slotBase.getMinutes(), 0, 0);

                                return (
                                    <div key={idx} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 h-24">
                                        <div className="w-16 text-right font-mono text-white/70">{format(slotDate, 'HH:mm')}</div>
                                        <div className="flex-1 h-full">
                                            {renderSlot(slotDate)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-8 gap-2">
                                {/* Empty corner cell */}
                                <div className="pt-12 space-y-2 border-r border-white/10 pr-2 flex flex-col items-center justify-center">
                                    <span className="text-xs text-white/30 rotate-180 text-vertical" style={{ writingMode: 'vertical-rl' }}>ORARI</span>
                                </div>

                                {eachDayOfInterval({
                                    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
                                    end: endOfWeek(currentDate, { weekStartsOn: 1 })
                                }).map(day => (
                                    <div key={day.toString()} className="space-y-2 min-w-[100px]">
                                        <div className={`text-center mb-2 p-2 rounded-lg ${isToday(day) ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-white/70'}`}>
                                            <div className="text-xs uppercase tracking-wider">{format(day, 'EEE', { locale: it })}</div>
                                            <div className="text-lg">{format(day, 'd')}</div>
                                        </div>
                                        <div className="space-y-2">
                                            {timeSlots.map((slotBase, idx) => {
                                                const slotDate = new Date(day);
                                                slotDate.setHours(slotBase.getHours(), slotBase.getMinutes(), 0, 0);

                                                return (
                                                    <div key={idx} className="h-10">
                                                        {renderCompactSlot(slotDate)}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-xl w-full max-w-sm m-4">
                        <h3 className="text-lg font-bold text-white mb-2">Elimina prenotazione</h3>
                        <p className="text-white/60 text-sm mb-6">Sei sicuro di voler eliminare questa prenotazione? L'operazione non è reversibile.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/5 transition text-sm"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20 transition text-sm font-semibold"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Info Modal */}
            {editInfoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-xl w-full max-w-sm m-4">
                        <h3 className="text-lg font-bold text-white mb-2">Modifica prenotazione</h3>
                        <p className="text-white/60 text-sm mb-6">Per modificare un appuntamento, contatta l'amministrazione o cancella la prenotazione attuale e creane una nuova.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setEditInfoModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30 border border-fuchsia-500/20 transition text-sm font-semibold"
                            >
                                Ho capito
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Closed Info Modal */}
            {closedModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-xl w-full max-w-sm m-4">
                        <h3 className="text-lg font-bold text-white mb-2">Centro Chiuso</h3>
                        <p className="text-white/60 text-sm mb-6">Il centro è chiuso nel weekend. Seleziona un giorno dal Lunedì al Venerdì.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setClosedModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30 border border-fuchsia-500/20 transition text-sm font-semibold"
                            >
                                Ho capito
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
