import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { signUp, login } from "@/lib/analytics";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400)); // simulate async

    if (mode === "signup") {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        setLoading(false);
        return;
      }
      const res = signUp(name.trim(), email.trim(), password);
      if (!res.ok) {
        setError(res.error!);
        setLoading(false);
        return;
      }
      // auto-login after signup
      const loginRes = login(email.trim(), password);
      if (loginRes.ok && loginRes.user) {
        setUser(loginRes.user);
        navigate("/");
      }
    } else {
      const res = login(email.trim(), password);
      if (!res.ok) {
        setError(res.error!);
        setLoading(false);
        return;
      }
      setUser(res.user!);
      navigate("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pet-lavender/30 via-background to-pet-mint/20 px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4 shadow-lg">
            <PawPrint className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">PetSitter</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create an account to get started."}
          </p>
        </div>

        {/* Toggle tabs */}
        <div className="flex rounded-xl bg-muted p-1 mb-6 shadow-inner">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
              mode === "login"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
              mode === "signup"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-4 w-4" /> Create Account
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border bg-card shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : mode === "login" ? (
                <><LogIn className="h-4 w-4" /> Sign In</>
              ) : (
                <><UserPlus className="h-4 w-4" /> Create Account</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-primary font-semibold hover:underline">
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
