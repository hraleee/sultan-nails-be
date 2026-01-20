import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, X, Check } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger',
    confirmText = 'Conferma',
    cancelText = 'Annulla',
    loading = false,
}: ConfirmationModalProps) {
    const colors = {
        danger: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            icon: 'text-red-400',
            button: 'from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500',
            iconComponent: AlertCircle,
        },
        warning: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            icon: 'text-amber-400',
            button: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
            iconComponent: AlertTriangle,
        },
        info: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            icon: 'text-blue-400',
            button: 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
            iconComponent: AlertCircle,
        },
    };

    const style = colors[type];
    const Icon = style.iconComponent;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-sm bg-stone-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className={`p-6 flex flex-col items-center text-center ${style.bg} border-b ${style.border}`}>
                            <div className={`p-3 rounded-full bg-stone-900/50 mb-4 ${style.icon}`}>
                                <Icon size={32} />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
                            <p className="text-stone-400 text-sm leading-relaxed">{message}</p>
                        </div>

                        <div className="p-4 flex gap-3 bg-stone-900">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl transition-colors font-medium disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${style.button} text-white rounded-xl transition-all font-medium shadow-lg shadow-black/20 disabled:opacity-50 flex items-center justify-center gap-2`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {confirmText}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
