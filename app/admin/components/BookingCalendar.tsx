"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addHours, setHours, setMinutes, isToday, parseISO, addDays, subDays, addWeeks, subWeeks } from "date-fns";
import { it } from "date-fns/locale";
import { adminApi, type Booking } from "@/lib/api";

interface BookingCalendarProps {
  bookings: any[];
  onBookingClick: (booking: any) => void;
  onTimeSlotClick: (date: Date) => void;
  onRefresh: () => void;
}

export default function BookingCalendar({
  bookings,
  onBookingClick,
  onTimeSlotClick,
  onRefresh,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Genera slot orari per la vista giornaliera
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = parseISO(booking.booking_date);
      return isSameDay(bookingDate, date);
    });
  };

  const getBookingsForTimeSlot = (date: Date, hour: number) => {
    return bookings.filter((booking) => {
      const bookingDate = parseISO(booking.booking_date);
      return isSameDay(bookingDate, date) && bookingDate.getHours() === hour;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setView("day");
  };

  const handlePrev = () => {
    if (view === "day") {
      const newDate = subDays(selectedDate || currentDate, 1);
      setCurrentDate(newDate);
      setSelectedDate(newDate);
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === "day") {
      const newDate = addDays(selectedDate || currentDate, 1);
      setCurrentDate(newDate);
      setSelectedDate(newDate);
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
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
    } else if (view === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, "d MMM", { locale: it })} - ${format(weekEnd, "d MMM yyyy", { locale: it })}`;
    } else {
      return format(currentDate, "MMMM yyyy", { locale: it });
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
            title={view === "day" ? "Giorno precedente" : view === "week" ? "Settimana precedente" : "Mese precedente"}
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-white min-w-[250px] text-center">
            {getDisplayText()}
          </h2>
          <button
            onClick={handleNext}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
            title={view === "day" ? "Giorno successivo" : view === "week" ? "Settimana successiva" : "Mese successivo"}
          >
            →
          </button>
          <button
            onClick={handleToday}
            className="rounded-xl border border-fuchsia-400/50 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-300 transition hover:bg-fuchsia-400/20"
          >
            Oggi
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("month")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${view === "month"
                ? "bg-fuchsia-500/20 text-fuchsia-300"
                : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
          >
            Mese
          </button>
          <button
            onClick={() => setView("week")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${view === "week"
                ? "bg-fuchsia-500/20 text-fuchsia-300"
                : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
          >
            Settimana
          </button>
          <button
            onClick={() => setView("day")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${view === "day"
                ? "bg-fuchsia-500/20 text-fuchsia-300"
                : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
          >
            Giorno
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {view === "month" && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          {/* Weekday headers */}
          <div className="mb-4 grid grid-cols-7 gap-2">
            {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
              <div key={day} className="py-2 text-center text-sm font-semibold text-white/70">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const dayBookings = getBookingsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[100px] cursor-pointer rounded-xl border p-2 transition hover:border-fuchsia-400/50 ${isCurrentMonth
                      ? "border-white/10 bg-white/5"
                      : "border-white/5 bg-white/[0.02] opacity-50"
                    } ${isCurrentDay ? "ring-2 ring-fuchsia-400/50" : ""}`}
                >
                  <div
                    className={`mb-1 text-sm font-semibold ${isCurrentDay
                        ? "text-fuchsia-300"
                        : isCurrentMonth
                          ? "text-white"
                          : "text-white/40"
                      }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookingClick(booking);
                        }}
                        className={`truncate rounded px-2 py-1 text-xs font-medium ${booking.status === "confirmed"
                            ? "bg-green-500/20 text-green-300"
                            : booking.status === "completed"
                              ? "bg-blue-500/20 text-blue-300"
                              : booking.status === "cancelled"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-yellow-500/20 text-yellow-300"
                          }`}
                      >
                        {format(parseISO(booking.booking_date), "HH:mm")} - {booking.service_name}
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-white/50">
                        +{dayBookings.length - 3} altre
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "day" && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-white">
              {format(selectedDate || currentDate, "EEEE d MMMM yyyy", { locale: it })}
            </h3>
            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  const newDate = subDays(selectedDate || currentDate, 1);
                  setSelectedDate(newDate);
                  setCurrentDate(newDate);
                }}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 text-sm text-white transition hover:bg-white/10"
              >
                ← Ieri
              </button>
              <button
                onClick={() => {
                  const newDate = addDays(selectedDate || currentDate, 1);
                  setSelectedDate(newDate);
                  setCurrentDate(newDate);
                }}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 text-sm text-white transition hover:bg-white/10"
              >
                Domani →
              </button>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              {timeSlots.map((hour) => {
                const slotDate = setHours(setMinutes(selectedDate || currentDate, 0), hour);
                const slotBookings = getBookingsForTimeSlot(selectedDate || currentDate, hour);

                return (
                  <div key={hour} className="flex gap-4 border-b border-white/5 pb-2">
                    <div className="w-20 flex-shrink-0 text-right text-sm font-semibold text-white/70">
                      {format(slotDate, "HH:mm")}
                    </div>
                    <div className="flex-1">
                      {slotBookings.length > 0 ? (
                        <div className="space-y-2">
                          {slotBookings.map((booking) => (
                            <div
                              key={booking.id}
                              onClick={() => onBookingClick(booking)}
                              className={`cursor-pointer rounded-xl border p-4 transition hover:scale-[1.02] ${booking.status === "confirmed"
                                  ? "border-green-500/30 bg-green-500/10"
                                  : booking.status === "completed"
                                    ? "border-blue-500/30 bg-blue-500/10"
                                    : booking.status === "cancelled"
                                      ? "border-red-500/30 bg-red-500/10"
                                      : "border-yellow-500/30 bg-yellow-500/10"
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-bold text-white">{booking.service_name}</h4>
                                  <p className="text-sm text-white/70">
                                    {booking.first_name} {booking.last_name}
                                  </p>
                                  <p className="text-xs text-white/50">{booking.email}</p>
                                </div>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "confirmed"
                                      ? "bg-green-500/20 text-green-300"
                                      : booking.status === "completed"
                                        ? "bg-blue-500/20 text-blue-300"
                                        : booking.status === "cancelled"
                                          ? "bg-red-500/20 text-red-300"
                                          : "bg-yellow-500/20 text-yellow-300"
                                    }`}
                                >
                                  {booking.status === "pending" && "In attesa"}
                                  {booking.status === "confirmed" && "Confermata"}
                                  {booking.status === "completed" && "Completata"}
                                  {booking.status === "cancelled" && "Cancellata"}
                                </span>
                              </div>
                              {booking.notes && (
                                <p className="mt-2 text-sm text-white/60">📝 {booking.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => onTimeSlotClick(slotDate)}
                          className="w-full rounded-xl border-2 border-dashed border-white/10 bg-white/5 py-3 text-sm text-white/50 transition hover:border-fuchsia-400/50 hover:bg-white/10 hover:text-white"
                        >
                          + Crea prenotazione
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === "week" && (() => {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {/* Weekday headers */}
            <div className="mb-4 grid grid-cols-8 gap-2">
              <div className="text-sm font-semibold text-white/70">Ora</div>
              {weekDays.map((day) => (
                <div
                  key={day.toString()}
                  className={`text-center ${isToday(day)
                      ? "text-fuchsia-300 font-bold"
                      : "text-white/70"
                    }`}
                >
                  <div className="text-xs uppercase">
                    {format(day, "EEE", { locale: it })}
                  </div>
                  <div className="text-lg font-semibold">
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="max-h-[600px] overflow-y-auto">
              <div className="space-y-1">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-2">
                    <div className="py-2 text-right text-sm font-semibold text-white/70">
                      {format(setHours(new Date(), hour), "HH:mm")}
                    </div>
                    {weekDays.map((day) => {
                      const slotBookings = bookings.filter((booking) => {
                        const bookingDate = parseISO(booking.booking_date);
                        return (
                          isSameDay(bookingDate, day) &&
                          bookingDate.getHours() === hour
                        );
                      });

                      return (
                        <div
                          key={day.toString()}
                          className="min-h-[60px] rounded-lg border border-white/5 bg-white/[0.02] p-1"
                        >
                          {slotBookings.length > 0 ? (
                            <div className="space-y-1">
                              {slotBookings.map((booking) => (
                                <div
                                  key={booking.id}
                                  onClick={() => onBookingClick(booking)}
                                  className={`cursor-pointer rounded px-2 py-1 text-xs font-medium transition hover:scale-105 ${booking.status === "confirmed"
                                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                      : booking.status === "completed"
                                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                        : booking.status === "cancelled"
                                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                    }`}
                                >
                                  <div className="truncate font-semibold">
                                    {format(setHours(new Date(), hour), "HH:mm")}
                                  </div>
                                  <div className="truncate">
                                    {booking.service_name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const slotDate = setHours(day, hour);
                                onTimeSlotClick(slotDate);
                              }}
                              className="h-full w-full rounded border-2 border-dashed border-white/10 bg-transparent text-xs text-white/30 transition hover:border-fuchsia-400/50 hover:bg-white/5 hover:text-white/50"
                            >
                              +
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

