import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit2, Trash2, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import { User, adminApi } from '@/lib/api';
import UserEditModal from './UserEditModal';
import ConfirmationModal from './ConfirmationModal';

interface UserListProps {
    users: User[];
    onUserDetailsChange: () => void; // Callback to refresh list
}

export default function UserList({ users, onUserDetailsChange }: UserListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'danger' | 'warning' | 'info';
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        type: 'danger',
        title: '',
        message: '',
        onConfirm: () => { },
    });
    const [loadingAction, setLoadingAction] = useState<number | null>(null);

    useEffect(() => {
        setFilteredUsers(
            users.filter(
                (user) =>
                    (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleBan = (user: User) => {
        const isBanning = user.role !== 'banned';
        setConfirmModal({
            isOpen: true,
            type: isBanning ? 'danger' : 'warning',
            title: isBanning ? 'Blocca Utente' : 'Sblocca Utente',
            message: `Sei sicuro di voler ${isBanning ? 'bloccare' : 'sbloccare'} l'utente ${user.firstName || user.email}? ${isBanning ? 'L\'utente non potrà più accedere.' : 'L\'utente potrà nuovamente accedere.'}`,
            onConfirm: async () => {
                setLoadingAction(user.id);
                try {
                    await adminApi.banUser(user.id, isBanning);
                    onUserDetailsChange();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (error: any) {
                    console.error('Error banning user:', error);
                    alert(`Errore: ${error.message || 'Errore sconosciuto'}`);
                } finally {
                    setLoadingAction(null);
                }
            }
        });
    };

    const handleDelete = (user: User) => {
        setConfirmModal({
            isOpen: true,
            type: 'danger',
            title: 'Elimina Utente',
            message: `Sei sicuro di voler eliminare definitivamente l'utente ${user.firstName || user.email}? Questa azione è irreversibile.`,
            onConfirm: async () => {
                setLoadingAction(user.id);
                try {
                    await adminApi.deleteUser(user.id);
                    onUserDetailsChange();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Errore durante l\'eliminazione');
                } finally {
                    setLoadingAction(null);
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h3 className="text-xl font-medium text-purple-100">Gestione Utenti</h3>

                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Cerca utente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 bg-black/20 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-stone-400 text-sm">
                        <tr>
                            <th className="p-4 font-medium">Utente</th>
                            <th className="p-4 font-medium hidden sm:table-cell">Email</th>
                            <th className="p-4 font-medium hidden md:table-cell">Telefono</th>
                            <th className="p-4 font-medium">Ruolo</th>
                            <th className="p-4 font-medium text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="font-medium text-purple-100">
                                        {user.firstName || user.lastName ? (
                                            `${user.firstName || ''} ${user.lastName || ''}`
                                        ) : (
                                            <span className="text-stone-500 italic">Nessun nome</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-stone-500 sm:hidden">{user.email}</div>
                                </td>
                                <td className="p-4 text-stone-300 hidden sm:table-cell">{user.email}</td>
                                <td className="p-4 text-stone-300 hidden md:table-cell">{user.phone || '-'}</td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-purple-500/20 text-purple-200'
                                            : user.role === 'banned'
                                                ? 'bg-red-500/20 text-red-200'
                                                : 'bg-emerald-500/20 text-emerald-200'
                                            }`}
                                    >
                                        {user.role === 'admin' && <CheckCircle size={12} />}
                                        {user.role === 'banned' && <Ban size={12} />}
                                        {user.role === 'user' && <CheckCircle size={12} />}
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-2 text-stone-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                                            title="Modifica"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        {user.role !== 'admin' && (
                                            <>
                                                <button
                                                    onClick={() => handleBan(user)}
                                                    disabled={loadingAction === user.id}
                                                    className={`p-2 rounded-lg transition-colors ${user.role === 'banned'
                                                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                                                        : 'text-amber-400 hover:bg-amber-500/10'
                                                        }`}
                                                    title={user.role === 'banned' ? 'Sblocca' : 'Blocca'}
                                                >
                                                    <Ban size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    disabled={loadingAction === user.id}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Elimina"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-stone-500">
                        Nessun utente trovato.
                    </div>
                )}
            </div>

            <UserEditModal
                user={selectedUser}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUserUpdated={() => {
                    setIsEditModalOpen(false);
                    onUserDetailsChange();
                }}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                loading={loadingAction !== null}
            />
        </div>
    );
}
