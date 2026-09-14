import { Sidebar } from "@/components/Sidebar";
import { AuthGuard } from "@/components/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-1 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 max-w-[1200px]">{children}</main>
      </div>
    </AuthGuard>
  );
}
