// ─── Analytics & Auth helpers (localStorage-based) ───────────────────────────

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  plansGenerated: number;
  lastVisit: string;
  isAdmin: boolean;
}

export interface SiteStats {
  totalVisits: number;
  totalPlansGenerated: number;
  users: UserRecord[];
}

const STATS_KEY = "petsitter_stats";

// ─── Static Admin Credentials ────────────────────────────────────────────────
const ADMIN_EMAIL = "atharvamashale@gmail.com";
const ADMIN_PASSWORD = "atharva@9011";

/** The static admin UserRecord – never stored in localStorage. */
const ADMIN_USER: UserRecord = {
  id: "admin-static-001",
  name: "Atharva Mashale",
  email: ADMIN_EMAIL,
  passwordHash: "", // not needed; password is checked in plain-text above
  createdAt: "2024-01-01T00:00:00.000Z",
  plansGenerated: 0,
  lastVisit: new Date().toISOString(),
  isAdmin: true,
};

function loadStats(): SiteStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as SiteStats;
  } catch {
    // corrupted – fall through
  }
  return { totalVisits: 0, totalPlansGenerated: 0, users: [] };
}

function saveStats(s: SiteStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

/** Increment global visit counter (call once per page load). */
export function recordVisit() {
  const s = loadStats();
  s.totalVisits += 1;
  saveStats(s);
}

/** Increment plan counter both globally and for the current user (if logged in). */
export function recordPlanGenerated(userId?: string) {
  const s = loadStats();
  s.totalPlansGenerated += 1;
  if (userId && userId !== ADMIN_USER.id) {
    const u = s.users.find((u) => u.id === userId);
    if (u) u.plansGenerated += 1;
  }
  saveStats(s);
}

export function getStats(): SiteStats {
  return loadStats();
}

// ─── Very lightweight password "hash" (XOR + base64) – NOT for production ───
function simpleHash(password: string): string {
  const salt = "petsitter_salt_42";
  let result = "";
  for (let i = 0; i < password.length; i++) {
    result += String.fromCharCode(
      password.charCodeAt(i) ^ salt.charCodeAt(i % salt.length)
    );
  }
  return btoa(result);
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export function signUp(name: string, email: string, password: string): { ok: boolean; error?: string } {
  // Prevent anyone from registering with the admin email
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return { ok: false, error: "This email address is not available for registration." };
  }

  const s = loadStats();
  if (s.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }

  // Regular users are never admins
  const newUser: UserRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
    plansGenerated: 0,
    lastVisit: new Date().toISOString(),
    isAdmin: false,
  };
  s.users.push(newUser);
  saveStats(s);
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; user?: UserRecord; error?: string } {
  // ── Check static admin credentials first ──────────────────────────────────
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    if (password !== ADMIN_PASSWORD) {
      return { ok: false, error: "Incorrect password." };
    }
    // Return a fresh copy so lastVisit is always current
    return { ok: true, user: { ...ADMIN_USER, lastVisit: new Date().toISOString() } };
  }

  // ── Regular user login ────────────────────────────────────────────────────
  const s = loadStats();
  const u = s.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!u) return { ok: false, error: "No account found with this email." };
  if (u.passwordHash !== simpleHash(password))
    return { ok: false, error: "Incorrect password." };

  // update lastVisit
  u.lastVisit = new Date().toISOString();
  saveStats(s);
  return { ok: true, user: u };
}
