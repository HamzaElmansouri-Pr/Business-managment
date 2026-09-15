import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/lib/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-1 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-[1200px]">{children}</main>
      </div>
    </AuthProvider>
  );
}
