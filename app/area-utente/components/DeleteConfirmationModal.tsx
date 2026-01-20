
"use client";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
            <div
                className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-sm transform transition-all scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-2xl">
                        🗑️
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Elimina Prenotazione</h3>
                    <p className="text-white/60 text-sm font-light leading-relaxed">
                        Sei sicuro di voler cancellare questa prenotazione? <br />
                        Questa azione non può essere annullata.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition text-sm font-medium disabled:opacity-50"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white transition text-sm font-medium shadow-lg shadow-red-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span>Eliminazione...</span>
                            </>
                        ) : (
                            "Elimina"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
