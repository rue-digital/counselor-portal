import { SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { CreatedUser } from "./types";

export const getAllUsers = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("./supabase/supabase.server");
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase.from("darn_portal_profiles").select("*");

  if (error) throw new Error(error.message);
  return data;
});

export const deleteUser = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const { error } = await supabase.from("darn_portal_profiles").delete().eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const createUser = createServerFn({ method: "POST" })
  .validator((data: CreatedUser) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const { data: createUser, error } = await supabase.functions.invoke(
      "admin-create-user-no-verify",
      {
        body: { email: data.email, password: data.password, full_name: data.name, role: data.role },
      },
    );

    if (error || !createUser) return;
    return createUser;
  });

export async function getNameFromID(supabase: SupabaseClient, profile_id: string) {
  const { data: profile, error } = await supabase
    .from("darn_portal_profiles")
    .select("*")
    .eq("id", profile_id)
    .single();

  if (error || !profile) throw new Error(error?.message);
  return profile.full_name;
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
