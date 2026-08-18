const PASSWORD_RECOVERY_KEY = "passwordRecovery";

export function isPasswordRecovery(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(PASSWORD_RECOVERY_KEY) === "1";
}

export function setPasswordRecovery(active: boolean) {
  if (typeof sessionStorage === "undefined") return;
  if (active) sessionStorage.setItem(PASSWORD_RECOVERY_KEY, "1");
  else sessionStorage.removeItem(PASSWORD_RECOVERY_KEY);
}
