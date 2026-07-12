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
  return "developforgood";
  return password;
}
