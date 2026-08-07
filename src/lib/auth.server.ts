import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signIn = createServerFn({ method: "POST" })
  .validator(signInSchema)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw new Error(error.message);
    return authData;
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const { createClient } = await import("./supabase/supabase.server");
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
  return { success: true };
});

export const getLoggedInUserProfile = createServerFn({
  method: "GET",
}).handler(async () => {
  const { createClient } = await import("./supabase/supabase.server");
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("darn_portal_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;
  return profile;
});

export const getLoggedInUserName = createServerFn({
  method: "GET",
}).handler(async () => {
  const { createClient } = await import("./supabase/supabase.server");
  const supabase = createClient();

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
});
