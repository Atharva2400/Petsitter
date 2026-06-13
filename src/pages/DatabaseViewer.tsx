import { useEffect, useState } from "react";
import { getStats, SiteStats, UserRecord } from "@/lib/analytics";

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function getAllLocalStorage(): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    try {
      result[key] = JSON.parse(localStorage.getItem(key)!);
    } catch {
      result[key] = localStorage.getItem(key);
    }
  }
  return result;
}

// ── sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="db-stat-card">
      <span className="db-stat-icon">{icon}</span>
      <div>
        <p className="db-stat-value">{value}</p>
        <p className="db-stat-label">{label}</p>
      </div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return <span className={`db-badge db-badge-${color}`}>{text}</span>;
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function DatabaseViewer() {
  const [stats, setStats] = useState<SiteStats>({ totalVisits: 0, totalPlansGenerated: 0, users: [] });
  const [rawStorage, setRawStorage] = useState<Record<string, unknown>>({});
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "raw">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refresh = () => {
    setStats(getStats());
    setRawStorage(getAllLocalStorage());
    setLastRefresh(new Date());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = stats.users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearData = () => {
    if (window.confirm("⚠️ This will delete ALL stored data. Are you sure?")) {
      localStorage.clear();
      refresh();
    }
  };

  return (
    <>
      {/* ── inline styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%);
          font-family: 'Inter', sans-serif;
          color: #e2e8f0;
          padding: 2rem;
        }

        /* Header */
        .db-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .db-header-left { display: flex; align-items: center; gap: 1rem; }
        .db-logo {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 0 20px rgba(139,92,246,0.4);
        }
        .db-title { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; }
        .db-title span { background: linear-gradient(90deg,#a78bfa,#818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .db-subtitle { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
        .db-actions { display: flex; gap: 0.75rem; align-items: center; }
        .db-btn {
          padding: 0.5rem 1.1rem;
          border-radius: 8px;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .db-btn-refresh {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          border: 1px solid rgba(99,102,241,0.3);
        }
        .db-btn-refresh:hover { background: rgba(99,102,241,0.25); transform: translateY(-1px); }
        .db-btn-danger {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.25);
        }
        .db-btn-danger:hover { background: rgba(239,68,68,0.2); transform: translateY(-1px); }
        .db-live-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.7rem; color: #10b981; font-weight: 600;
        }
        .db-live-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

        /* Stats row */
        .db-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .db-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .db-stat-card:hover { border-color: rgba(139,92,246,0.3); box-shadow: 0 0 20px rgba(139,92,246,0.1); }
        .db-stat-icon { font-size: 1.75rem; }
        .db-stat-value { font-size: 1.6rem; font-weight: 800; color: #a78bfa; line-height: 1; }
        .db-stat-label { font-size: 0.7rem; color: #64748b; font-weight: 500; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Tabs */
        .db-tabs {
          display: flex; gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          width: fit-content;
        }
        .db-tab {
          padding: 0.4rem 1.2rem;
          border-radius: 7px;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
          background: transparent;
        }
        .db-tab.active { background: linear-gradient(135deg,#7c3aed,#6366f1); color: #fff; box-shadow: 0 2px 12px rgba(99,102,241,0.35); }
        .db-tab:not(.active):hover { color: #a78bfa; }

        /* Panel */
        .db-panel {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }
        .db-panel-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
        }
        .db-panel-title { font-size: 0.9rem; font-weight: 700; color: #cbd5e1; }

        /* Search */
        .db-search {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.4rem 0.9rem;
          color: #e2e8f0;
          font-size: 0.8rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          width: 220px;
          transition: border-color 0.2s;
        }
        .db-search:focus { border-color: rgba(139,92,246,0.5); }
        .db-search::placeholder { color: #475569; }

        /* Table */
        .db-table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: rgba(255,255,255,0.03); }
        th { padding: 0.75rem 1.25rem; text-align: left; font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
        td { padding: 0.85rem 1.25rem; font-size: 0.82rem; border-top: 1px solid rgba(255,255,255,0.04); white-space: nowrap; }
        tbody tr { transition: background 0.15s; cursor: pointer; }
        tbody tr:hover { background: rgba(139,92,246,0.05); }
        tbody tr.selected { background: rgba(139,92,246,0.1); }

        /* badges */
        .db-badge { padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; }
        .db-badge-green { background: rgba(16,185,129,0.15); color: #10b981; }
        .db-badge-purple { background: rgba(139,92,246,0.15); color: #a78bfa; }
        .db-badge-blue { background: rgba(59,130,246,0.15); color: #60a5fa; }

        /* User detail */
        .db-detail {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .db-detail-field label { font-size: 0.65rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; }
        .db-detail-field p { font-size: 0.88rem; color: #e2e8f0; margin-top: 3px; word-break: break-all; }

        /* Raw JSON */
        .db-json {
          padding: 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          line-height: 1.6;
          color: #94a3b8;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .db-key { color: #a78bfa; }
        .db-str { color: #34d399; }
        .db-num { color: #fb923c; }
        .db-bool { color: #60a5fa; }

        /* Empty state */
        .db-empty {
          padding: 4rem;
          text-align: center;
          color: #475569;
          font-size: 0.9rem;
        }
        .db-empty-icon { font-size: 3rem; margin-bottom: 1rem; }

        /* Refresh time */
        .db-refresh-time { font-size: 0.7rem; color: #475569; text-align: right; margin-top: 0.75rem; }

        /* Key-value section in overview */
        .db-kv-list { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .db-kv-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .db-kv-key { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #a78bfa; }
        .db-kv-val { font-size: 0.8rem; color: #94a3b8; max-width: 50%; text-align: right; word-break: break-all; }

        @media (max-width: 600px) {
          .db-root { padding: 1rem; }
          .db-title { font-size: 1.3rem; }
        }
      `}</style>

      <div className="db-root">
        {/* Header */}
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-logo">🗄️</div>
            <div>
              <h1 className="db-title">Local<span>DB</span> Viewer</h1>
              <p className="db-subtitle">Snuggle Steward · Browser localStorage</p>
            </div>
          </div>
          <div className="db-actions">
            <div className="db-live-badge">
              <div className="db-live-dot" />
              LIVE
            </div>
            <button className="db-btn db-btn-refresh" onClick={refresh}>↺ Refresh</button>
            <button className="db-btn db-btn-danger" onClick={clearData}>🗑 Clear All</button>
          </div>
        </header>

        {/* Stats */}
        <div className="db-stats-row">
          <StatCard icon="👥" label="Total Users" value={stats.users.length} />
          <StatCard icon="👁️" label="Total Visits" value={stats.totalVisits} />
          <StatCard icon="📋" label="Plans Generated" value={stats.totalPlansGenerated} />
          <StatCard icon="🔑" label="Storage Keys" value={Object.keys(rawStorage).length} />
        </div>

        {/* Tabs */}
        <div className="db-tabs">
          {(["overview", "users", "raw"] as const).map((t) => (
            <button
              key={t}
              className={`db-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t === "overview" && "📊 Overview"}
              {t === "users" && `👤 Users (${stats.users.length})`}
              {t === "raw" && "{ } Raw JSON"}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="db-panel">
            <div className="db-panel-header">
              <span className="db-panel-title">📦 All Storage Keys</span>
            </div>
            {Object.keys(rawStorage).length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon">📭</div>
                <p>No data stored yet. Sign up or generate a plan first.</p>
              </div>
            ) : (
              <div className="db-kv-list">
                {Object.entries(rawStorage).map(([key, val]) => (
                  <div className="db-kv-row" key={key}>
                    <span className="db-kv-key">{key}</span>
                    <span className="db-kv-val">
                      {typeof val === "object"
                        ? <Badge text="object" color="purple" />
                        : String(val).slice(0, 60) + (String(val).length > 60 ? "…" : "")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <div className="db-panel">
            <div className="db-panel-header">
              <span className="db-panel-title">👤 User Records</span>
              <input
                className="db-search"
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filteredUsers.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon">👤</div>
                <p>{stats.users.length === 0 ? "No users registered yet." : "No users match your search."}</p>
              </div>
            ) : (
              <div className="db-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Plans</th>
                      <th>Joined</th>
                      <th>Last Visit</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr
                        key={u.id}
                        className={selectedUser?.id === u.id ? "selected" : ""}
                        onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                      >
                        <td style={{ color: "#475569" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600, color: "#e2e8f0" }}>{u.name}</td>
                        <td style={{ color: "#94a3b8" }}>{u.email}</td>
                        <td><Badge text={String(u.plansGenerated)} color="purple" /></td>
                        <td style={{ color: "#64748b", fontSize: "0.75rem" }}>{formatDate(u.createdAt)}</td>
                        <td style={{ color: "#64748b", fontSize: "0.75rem" }}>{formatDate(u.lastVisit)}</td>
                        <td><Badge text="active" color="green" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* User detail drawer */}
            {selectedUser && (
              <div className="db-detail">
                {[
                  { label: "User ID", value: selectedUser.id },
                  { label: "Full Name", value: selectedUser.name },
                  { label: "Email", value: selectedUser.email },
                  { label: "Password Hash", value: selectedUser.passwordHash },
                  { label: "Plans Generated", value: String(selectedUser.plansGenerated) },
                  { label: "Created At", value: formatDate(selectedUser.createdAt) },
                  { label: "Last Visit", value: formatDate(selectedUser.lastVisit) },
                ].map((f) => (
                  <div className="db-detail-field" key={f.label}>
                    <label>{f.label}</label>
                    <p>{f.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Raw JSON tab */}
        {activeTab === "raw" && (
          <div className="db-panel">
            <div className="db-panel-header">
              <span className="db-panel-title">{ } Raw localStorage JSON</span>
            </div>
            {Object.keys(rawStorage).length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon">📭</div>
                <p>localStorage is empty.</p>
              </div>
            ) : (
              <div className="db-json">
                {JSON.stringify(rawStorage, null, 2)
                  .split("\n")
                  .map((line, i) => {
                    // simple syntax highlighting
                    const highlighted = line
                      .replace(/"([^"]+)":/g, (_, k) => `<span class="db-key">"${k}":</span>`)
                      .replace(/: "([^"]*)"/g, (_, v) => `: <span class="db-str">"${v}"</span>`)
                      .replace(/: (\d+)/g, (_, n) => `: <span class="db-num">${n}</span>`)
                      .replace(/: (true|false)/g, (_, b) => `: <span class="db-bool">${b}</span>`);
                    return (
                      <div key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />
                    );
                  })}
              </div>
            )}
          </div>
        )}

        <p className="db-refresh-time">Auto-refreshes every 3 seconds · Last updated: {lastRefresh.toLocaleTimeString()}</p>
      </div>
    </>
  );
}
