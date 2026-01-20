"use client";

import { useState, useRef, useEffect } from "react";
import { Service } from "@/lib/api";

interface ServiceSelectorProps {
    services: Service[];
    selectedId: string;
    onSelect: (serviceId: string) => void;
}

export default function ServiceSelector({ services, selectedId, onSelect }: ServiceSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedService = services.find((s) => s.id.toString() === selectedId);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <label className="mb-2 block text-sm font-medium text-purple-200/80">
                Servizio *
            </label>

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left rounded-xl border px-4 py-3 flex items-center justify-between transition-all ${isOpen
                        ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/50"
                    }`}
            >
                {selectedService ? (
                    <div className="flex flex-col">
                        <span className="text-white font-medium">{selectedService.name}</span>
                        <span className="text-xs text-white/50">
                            {selectedService.durationMinutes} min • €{Number(selectedService.price).toFixed(2)}
                        </span>
                    </div>
                ) : (
                    <span className="text-white/40 font-light">Seleziona un servizio...</span>
                )}

                <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#161616] p-1.5 shadow-2xl backdrop-blur-xl animate-fade-in-up">
                    {services.length === 0 ? (
                        <div className="p-4 text-center text-sm text-white/40">Nessun servizio disponibile</div>
                    ) : (
                        <div className="space-y-1">
                            {services.map((service) => {
                                const isSelected = service.id.toString() === selectedId.toString();
                                return (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => {
                                            onSelect(service.id.toString());
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 transition-all text-sm group ${isSelected
                                                ? "bg-purple-500/20 text-white"
                                                : "text-white/70 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className={`font-medium ${isSelected ? "text-purple-200" : "text-white/90"}`}>{service.name}</span>
                                            <span className={`${isSelected ? "text-purple-300/70" : "text-white/40"} text-xs`}>{service.durationMinutes} min</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`font-medium ${isSelected ? "text-purple-300" : "text-white/50 group-hover:text-white/70"}`}>
                                                €{Number(service.price).toFixed(2)}
                                            </span>
                                            {isSelected && (
                                                <span className="text-purple-400">✓</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
