import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Profile = Database["public"]["Tables"]["darn_portal_profiles"]["Row"];
export type Ticket = Database["public"]["Tables"]["darn_portal_tickets"]["Row"];
export type TicketUpdate = Database["public"]["Tables"]["darn_portal_ticket_history"]["Row"];

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

export const getAllRequests = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("./supabase/supabase.server");
  const supabase = createClient();

  const { data, error } = await supabase
    .from("darn_portal_tickets")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
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

export const getRequest = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const { data: requests, error } = await supabase
      .from("darn_portal_tickets")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error || !requests) return;
    return requests;
  });

export const deleteUser = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const { error } = await supabase.from("darn_portal_profiles").delete().eq("id", data.id);

    if (error) console.error(error);
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

async function getPreviousStatus(supabase: SupabaseClient, ticket_id: string) {
  const { data, error } = await supabase
    .from("darn_portal_ticket_history")
    .select()
    .eq("ticket_id", ticket_id)
    .order("updated_at", { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  return data[0].new_status;
}

async function insertRequestHistory(supabase: SupabaseClient, data: TicketUpdate) {
  const { error } = await supabase.from("darn_portal_ticket_history").insert(data);

  if (error) throw new Error(error.message);
}

async function updateTicketStatus(supabase: SupabaseClient, ticket_id: string, status: string) {
  const { data, error } = await supabase
    .from("darn_portal_tickets")
    .update({ status: status })
    .eq("id", ticket_id)
    .select();
  if (error) throw new Error(error.message);
  return data;
}

// returns all event types
async function getAllTicketHistory(supabase: SupabaseClient, ticket_id: string) {
  const { data, error } = await supabase
    .from("darn_portal_ticket_history")
    .select()
    .eq("ticket_id", ticket_id)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

async function getNameFromID(supabase: SupabaseClient, profile_id: string) {
  const { data: profile, error } = await supabase
    .from("darn_portal_profiles")
    .select("*")
    .eq("id", profile_id)
    .single();

  if (error || !profile) throw new Error(error?.message);
  return profile.full_name;
}

export const getTicketStatusHistory = createServerFn()
  .validator((data: { ticket_id: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const history = await getAllTicketHistory(supabase, data.ticket_id);
    const status_changed_events = history.filter(
      (change) => change.event_type === "status_changed" || change.event_type === "created",
    );

    // keep only changed_by_profile_id, new_status, updated_at
    const statusHistory = await Promise.all(
      status_changed_events.map(async ({ changed_by_profile_id, new_status, updated_at }) => {
        const name = await getNameFromID(supabase, changed_by_profile_id);
        return {
          actor_name: name,
          status: new_status,
          updated_at: updated_at,
        };
      }),
    );

    return statusHistory;
  });

export const createRequest = createServerFn({ method: "POST" })
  .validator((data: Omit<Ticket, "created_by_profile_id">) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error(userError?.message);

    const { data: submitted, error } = await supabase
      .from("darn_portal_tickets")
      .insert({
        ...data,
        created_by_profile_id: user?.id,
      })
      .select()
      .single();
    if (error || !submitted) throw new Error(error?.message);

    await insertRequestHistory(supabase, {
      ticket_id: submitted.id,
      changed_by_profile_id: user.id,
      event_type: "created",
      previous_status: null,
      new_status: "submitted",
    });

    return submitted;
  });

export const adminChangeStatus = createServerFn({ method: "POST" })
  .validator((data: { ticket_id: string; new_status: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error(userError?.message);

    // create new row in darn_portal_ticket_history
    const previous_status = await getPreviousStatus(supabase, data.ticket_id);

    await insertRequestHistory(supabase, {
      ticket_id: data.ticket_id,
      changed_by_profile_id: user.id,
      event_type: "status_changed",
      previous_status: previous_status,
      new_status: data.new_status,
    });

    // update row in darn_portal_tickets
    await updateTicketStatus(supabase, data.ticket_id, data.new_status);
  });

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
