import { ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldAlert, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * Wraps a route so only admins can access it.
 * - Not logged in  → redirect to /auth
 * - Logged in but NOT admin → show Access Denied UI
 * - Admin → render children
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Not authenticated at all → send to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated but not an admin
  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4">
        {/* Icon */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>

        {/* Message */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-destructive">
            Access Denied
          </h1>
          <p className="mt-2 text-muted-foreground max-w-sm">
            You don't have permission to view this page. This area is restricted
            to administrators only.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-xl border px-6 py-2.5 text-sm font-semibold hover:bg-muted transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition"
          >
            <LogIn className="h-4 w-4" />
            Sign in as Admin
          </button>
        </div>
      </div>
    );
  }

  // Admin — allow access
  return <>{children}</>;
}
