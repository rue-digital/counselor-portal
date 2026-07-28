import type { Database } from "./supabase";
import { supabase } from "@/supabaseClient";

export type Profile = Database["public"]["Tables"]["darn_portal_profiles"]["Row"];
export type Ticket = Database["public"]["Tables"]["darn_portal_tickets"]["Row"];

type schools = Database["public"]["Enums"]["school"];
type assistance_type = Database["public"]["Enums"]["darn_ticket_assistance_type"];
type assistance_reason = Database["public"]["Enums"]["darn_ticket_assistance_reason"];

export const SCHOOL_VALUES: schools[] = [
  "Bexley High School",
  "Bexley Middle School",
  "Cassingham Elementary",
  "Maryland Elementary",
  "Montrose Elementary",
  "Preschool",
  "Other",
] as const;

export const ASSISTANCE_TYPE_VALUES: assistance_type[] = [
  "Utility Bill",
  "Gift Card",
  "Bicycle",
  "Glasses",
  "Clothing",
  "Furniture",
  "Bus Pass",
  "Household Items",
  "Other",
];

export const ASSISTANCE_REASON_VALUES: assistance_reason[] = [
  "Financial Hardship",
  "Employment Change",
  "Medical or Health Issue",
  "Housing or Relocation",
  "Family Change",
  "Unexpected Expense",
  "Other",
];

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

export async function createRequest(request: Omit<Ticket, "created_by_profile_id">) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("darn_portal_tickets")
    .insert({
      ...request,
      created_by_profile_id: user.id,
    })
    .select()
    .single();

  if (error || !data) throw error;

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
