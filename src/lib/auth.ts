import type { Database } from "./supabase";
import { supabase } from "@/supabaseClient";

export type Profile = Database["public"]["Tables"]["darn_portal_profiles"]["Row"];
export type Ticket = Database["public"]["Tables"]["darn_portal_tickets"]["Row"];
export type CreatedUser = {
  email: string;
  name: string;
  role: string;
  password: string;
};
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data) return;
  return data;
}

export async function signOut() {}

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

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  return error;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return new Error("You must be signed in to change your password.");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return new Error("Current password is incorrect.");
  }

  return updatePassword(newPassword);
}

export async function getAllUsers() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase.from("darn_portal_profiles").select("*");
  if (error || !data) return;
  return data;
}

// works for counselors and admin. admin when calling see all, counselors only their own.

export async function getAllRequests() {
  const { data, error } = await supabase
    .from("darn_portal_tickets")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  console.log(data);
  return data;
}

export async function getLoggedInUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("darn_portal_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return;
  return data;
}

export async function getLoggedInUserName() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("darn_portal_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return;
  return data.full_name;
}

export async function getRequest(id: string) {
  const { data, error } = await supabase
    .from("darn_portal_tickets")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return;
  return data;
}

export async function deleteUser(id: string) {
  const { error } = await supabase.from("darn_portal_profiles").delete().eq("id", id);
  return error;
}

export async function createUser(user: CreatedUser) {
  const { data, error } = await supabase.functions.invoke("admin-create-user-no-verify", {
    body: { email: user.email, password: user.password, full_name: user.name, role: user.role },
  });
  if (error || !data) return;
  return data;
}

export function generatePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  // Create a cryptographically secure array of random bytes
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  // all passwords are developforgood for ease of testing
  return "developforgood";
  return password;
}
