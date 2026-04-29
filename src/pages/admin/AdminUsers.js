import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAllUsers, toggleBlockUser, deleteUser } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiShield, FiShieldOff, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);

  const load = () => {
    fetchAllUsers().then(r => { setUsers(r.data.users); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggleBlock = async (id, name, isBlocked) => {
    setProcessing(id);
    try {
      await toggleBlockUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'}`);
    } catch (e) { toast.error(e.message); }
    finally { setProcessing(null); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setProcessing(id);
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (e) { toast.error(e.message); }
    finally { setProcessing(null); }
  };

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <div className="animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Users', value: users.length, color: 'text-aqua-400' },
            { label: 'Active', value: users.filter(u => !u.isBlocked).length, color: 'text-green-400' },
            { label: 'Blocked', value: users.filter(u => u.isBlocked).length, color: 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-white/30 focus:outline-none focus:border-aqua-400 text-sm" />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['User', 'Contact', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(5)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-white/10 rounded animate-pulse" /></td>)}
                  </tr>
                )) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-white/30">No users found</td></tr>
                ) : filtered.map(user => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
                          style={{ background: user.isBlocked ? '#ef444433' : '#06b6d433', color: user.isBlocked ? '#f87171' : '#67e8f9' }}>
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{user.name}</p>
                          <p className="text-white/40 text-xs font-mono">#{user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1"><FiMail className="w-3 h-3" />{user.email}</div>
                      {user.phone && <div className="flex items-center gap-1.5 text-white/40 text-xs"><FiPhone className="w-3 h-3" />{user.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${user.isBlocked ? 'bg-red-400/20 text-red-400' : 'bg-green-400/20 text-green-400'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleToggleBlock(user._id, user.name, user.isBlocked)} disabled={processing === user._id}
                          className={`p-1.5 rounded-lg transition-colors ${user.isBlocked ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}`}
                          title={user.isBlocked ? 'Unblock' : 'Block'}>
                          {user.isBlocked ? <FiShield className="w-3.5 h-3.5" /> : <FiShieldOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleDelete(user._id, user.name)} disabled={processing === user._id}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" title="Delete">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
