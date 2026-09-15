import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/lib/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-1 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-[1200px] flex flex-col w-full">
          <div className="flex justify-end mb-4">
            <NotificationBell />
          </div>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
