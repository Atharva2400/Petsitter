import { PawPrint, LogIn, LogOut, LayoutDashboard, UserCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
          <PawPrint className="h-6 w-6 text-primary" />
          PetSitter
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <a href="#pet-profile" className="hover:text-primary transition">Pet Profile</a>
          <a href="#instructions" className="hover:text-primary transition">Instructions</a>
          <Link to="/create-plan" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition">
            Create Plan
          </Link>

          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-2 hover:bg-muted transition text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground font-semibold">{user.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-destructive hover:bg-destructive/10 transition text-sm font-semibold"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 rounded-lg border px-3 py-2 hover:bg-muted transition text-foreground"
            >
              <LogIn className="h-4 w-4 text-primary" /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile – just the auth buttons */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/create-plan" className="rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground font-bold hover:opacity-90 transition">
            Create Plan
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/dashboard" className="p-1.5 rounded-lg border hover:bg-muted transition">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                </Link>
              )}
              <button onClick={handleLogout} className="p-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/10 transition">
                <LogOut className="h-4 w-4 text-destructive" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="p-1.5 rounded-lg border hover:bg-muted transition">
              <UserCircle2 className="h-5 w-5 text-primary" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
