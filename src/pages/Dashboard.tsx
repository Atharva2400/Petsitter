import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStats, SiteStats } from "@/lib/analytics";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  Globe,
  FileText,
  TrendingUp,
  ShieldAlert,
  Calendar,
  Mail,
  PawPrint,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Bar-chart data: plans per user (top 8)
function buildChartData(stats: SiteStats) {
  return [...stats.users]
    .sort((a, b) => b.plansGenerated - a.plansGenerated)
    .slice(0, 8)
    .map((u) => ({ name: u.name.split(" ")[0], plans: u.plansGenerated }));
}

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className={`rounded-2xl border bg-card p-6 shadow-card flex items-start gap-4 hover:shadow-lg transition-shadow duration-300`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-3xl font-extrabold mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SiteStats>({ totalVisits: 0, totalPlansGenerated: 0, users: [] });
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Only admin (first registered user) can access
    setStats(getStats());
  }, []);

  // Refresh every 5 s so stats update if another tab generates a plan
  useEffect(() => {
    const t = setInterval(() => setStats(getStats()), 5000);
    return () => clearInterval(t);
  }, []);

  // 🔒 Secondary guard: must be admin (AdminRoute is the primary guard)
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-extrabold">Access Denied</h2>
        <p className="text-muted-foreground">This page is restricted to administrators only.</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  const filtered = stats.users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = buildChartData(stats);
  const conversionRate =
    stats.totalVisits > 0
      ? ((stats.totalPlansGenerated / stats.totalVisits) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <BarChart2 className="h-7 w-7 text-primary" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Real-time analytics for PetSitter Instructions
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={Globe}
            label="Total Site Visits"
            value={stats.totalVisits.toLocaleString()}
            sub="All-time page loads"
            accent="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={FileText}
            label="Plans Generated"
            value={stats.totalPlansGenerated.toLocaleString()}
            sub="Pet care reports created"
            accent="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
          <StatCard
            icon={Users}
            label="Registered Users"
            value={stats.users.length.toLocaleString()}
            sub="Signed-up accounts"
            accent="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Conversion Rate"
            value={`${conversionRate}%`}
            sub="Visitors who made a plan"
            accent="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Bar chart */}
        {chartData.length > 0 && (
          <div className="rounded-2xl border bg-card shadow-card p-6 mb-10">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-primary" /> Plans Generated per User
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="plans" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* User table */}
        <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
          {/* Table header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Registered Users
              <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {stats.users.length}
              </span>
            </h2>
            <input
              type="search"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border bg-background px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No users found</p>
              <p className="text-xs mt-1">{search ? "Try a different search term." : "Users will appear here once they register."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-muted-foreground text-left">
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Plans</th>
                    <th className="px-6 py-3 font-semibold">Joined</th>
                    <th className="px-6 py-3 font-semibold">Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr
                      key={u.id}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" /> {u.email}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          u.plansGenerated > 0
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <FileText className="h-3 w-3" />
                          {u.plansGenerated}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {new Date(u.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
