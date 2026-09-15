"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import { AppNotification } from "@/lib/types";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get<AppNotification[]>("/notifications");
        setNotifications(res || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
    
    // Fetch once on mount
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = async (id: string, orderId: number) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.filter(n => n.id !== id));
      setIsOpen(false);
      router.push(`/orders/${orderId}`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] rounded-[var(--radius)] transition-colors"
      >
        <Bell size={20} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--danger-fg)] rounded-full border-2 border-[var(--surface-1)]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-[400px]">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
            <h3 className="font-medium text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-[var(--accent)] text-white px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
                No new notifications
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id, notification.data.order_id)}
                    className="text-left px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Order #{notification.data.order_id}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                      {notification.data.message}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1.5">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
