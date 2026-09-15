"use client";

import { Plus, Search, Trash2, Edit2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, PaginatedResponse } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { UserForm } from "@/components/UserForm";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && currentUser?.role !== "admin") {
      router.push("/");
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (authLoading || currentUser?.role !== "admin") return;

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PaginatedResponse<User>>(`/users${debouncedSearch ? `?search=${debouncedSearch}` : ''}`);
        setUsers(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [debouncedSearch, refreshTrigger, authLoading, currentUser]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete user");
    }
  }

  if (authLoading || currentUser?.role !== "admin") {
    return null; // Don't flash content while redirecting
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-medium">Settings: User Management</h1>
        <button 
          aria-label="New user"
          onClick={() => {
            setEditingUser(undefined);
            setTempPassword(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-[var(--radius)] border border-[var(--border-strong)] hover:bg-[var(--surface-1)] transition-colors"
        >
          <Plus size={14} />
          New user
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] max-w-xs focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-colors">
        <Search size={14} className="text-[var(--text-muted)]" />
        <input
          aria-label="Search users"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full text-[var(--text)] placeholder:text-[var(--text-muted)]"
        />
      </div>

      {tempPassword && (
        <div className="mb-6 p-4 rounded-[var(--radius)] border border-[#b3d4ff] bg-[#f2f7ff] text-[#004080] text-sm dark:bg-[#112233] dark:border-[#224466] dark:text-[#99ccff] flex items-start justify-between">
          <div>
            <p className="font-medium mb-1 flex items-center gap-2">
              <ShieldAlert size={16} /> User created successfully!
            </p>
            <p>Please securely share this temporary password with the user. It will not be shown again.</p>
            <p className="mt-2 font-mono bg-white dark:bg-black p-2 inline-block rounded border border-[#b3d4ff] dark:border-[#224466]">
              {tempPassword}
            </p>
          </div>
          <button onClick={() => setTempPassword(null)} className="text-[#004080] dark:text-[#99ccff] hover:opacity-70 text-xl leading-none">
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-[var(--radius)] border border-[#ffb3b3] bg-[#fff2f2] text-[#c00000] text-sm dark:bg-[#331111] dark:border-[#662222] dark:text-[#ff9999]">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm min-w-[600px] whitespace-nowrap">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-secondary)]">
              <th className="text-left font-normal px-4 py-2.5 w-1/3">Name</th>
              <th className="text-left font-normal px-4 py-2.5">Email</th>
              <th className="text-left font-normal px-4 py-2.5">Role</th>
              <th className="text-left font-normal px-4 py-2.5">Created At</th>
              <th className="text-right font-normal px-4 py-2.5 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-40 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-16 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-16 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">
                    {user.name}
                    {user.id === currentUser?.id && <span className="ml-2 text-[10px] bg-[var(--surface-2)] px-1.5 py-0.5 rounded text-[var(--text-muted)]">You</span>}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{user.email}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)] capitalize">{user.role}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        aria-label="Edit user"
                        onClick={() => {
                          setEditingUser(user);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-[var(--radius)] hover:bg-[var(--surface-2)]"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        aria-label="Delete user"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUser?.id}
                        title={user.id === currentUser?.id ? "You cannot delete your own account" : undefined}
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger-fg)] transition-colors rounded-[var(--radius)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:hover:text-[var(--text-muted)] disabled:hover:bg-transparent"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? "Edit User" : "New User"}
      >
        <UserForm 
          user={editingUser}
          onCancel={() => setIsModalOpen(false)}
          onSuccess={(tempPw) => {
            setIsModalOpen(false);
            if (tempPw) setTempPassword(tempPw);
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      </Modal>
    </div>
  );
}
