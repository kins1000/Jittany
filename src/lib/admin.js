export const ADMIN_PASSWORD = "Jittany2026";

export function isAdmin() {
  return localStorage.getItem("admin") === "true";
}

export function login(password) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("admin", "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("admin");
}