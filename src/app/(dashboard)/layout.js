import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/layout/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
