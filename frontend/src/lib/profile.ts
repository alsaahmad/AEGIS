export type Profile = Record<string, any>;

const PREFIX = "aegis-profile:";

function migrateLocalStorage() {
  if (typeof window === "undefined" || !window.localStorage) return;

  const migrations: Record<string, string> = {
    "lifeline-user": "aegis-user",
    "lifeline-profile": "aegis-profile",
    "lifeline-auth": "aegis-auth",
    "auth": "aegis-auth",
  };

  // Migrate explicit keys
  Object.entries(migrations).forEach(([oldKey, newKey]) => {
    const val = localStorage.getItem(oldKey);
    if (val !== null) {
      localStorage.setItem(newKey, val);
      localStorage.removeItem(oldKey);
    }
  });

  // Migrate prefix keys (ll_profile:role -> aegis-profile:role)
  const OLD_PREFIX = "ll_profile:";
  const NEW_PREFIX = "aegis-profile:";
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(OLD_PREFIX)) {
        const val = localStorage.getItem(key);
        if (val !== null) {
          const role = key.slice(OLD_PREFIX.length);
          localStorage.setItem(NEW_PREFIX + role, val);
          localStorage.removeItem(key);
        }
      }
    });
  } catch (e) {
    // ignore
  }
}

// Run migration immediately
migrateLocalStorage();

export function getProfile(role: string): Profile {
  try {
    const raw = localStorage.getItem(PREFIX + role);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveProfile(role: string, data: Profile) {
  try {
    localStorage.setItem(PREFIX + role, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

export function clearSession() {
  try {
    // clear auth keys and profile keys
    Object.keys(localStorage).forEach((k) => {
      if (
        k.startsWith(PREFIX) ||
        k.startsWith("ll_profile:") ||
        k === "aegis-auth" ||
        k === "auth" ||
        k === "lifeline-auth"
      ) {
        localStorage.removeItem(k);
      }
    });
  } catch (e) {
    // ignore
  }
}
