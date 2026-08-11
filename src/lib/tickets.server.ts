import { SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { RequestStatus, Ticket, TicketInsert, TicketUpdate } from "./types";
import { getNameFromID } from "./profiles.server";

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

async function insertRequestHistory(supabase: SupabaseClient, data: TicketUpdate) {
  const { error } = await supabase.from("darn_portal_ticket_history").insert(data);

  if (error) throw new Error(error.message);
}

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

export const getAllRequests = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("./supabase/supabase.server");
  const supabase = createClient();

  const { data, error } = await supabase
    .from("darn_portal_tickets")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  const requests = await Promise.all(
    data.map(async ({ created_by_profile_id, ...item }) => {
      const name = await getNameFromID(supabase, created_by_profile_id);
      return {
        ...item,
        created_by_profile_id,
        counselor: name,
      };
    }),
  );
  return requests;
});

export const getRequestsByStatus = createServerFn({ method: "GET" })
  .validator((data: { status: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const { data: tickets, error } = await supabase
      .from("darn_portal_tickets")
      .select()
      .eq("status", data.status);

    if (error) throw new Error(error.message);
    const requests = await Promise.all(
      tickets.map(async ({ created_by_profile_id, ...item }) => {
        const name = await getNameFromID(supabase, created_by_profile_id);
        return {
          ...item,
          created_by_profile_id,
          counselor: name,
        };
      }),
    );
    return requests;
  });

export const getRequest = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const { data: request, error } = await supabase
      .from("darn_portal_tickets")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error || !request) throw new Error(error?.message);
    const name = await getNameFromID(supabase, request.created_by_profile_id);
    return {
      ...request,
      counselor: name,
    };
  });

export const createRequest = createServerFn({ method: "POST" })
  .validator((data: Omit<TicketInsert, "created_by_profile_id">) => data)
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

export const getTicketStatusHistory = createServerFn()
  .validator((data: { ticket_id: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const history = await getAllTicketHistory(supabase, data.ticket_id);

    // keep only changed_by_profile_id, new_status, updated_at, note
    const statusHistory = await Promise.all(
      history.map(async ({ changed_by_profile_id, new_status, updated_at, note }) => {
        const name = await getNameFromID(supabase, changed_by_profile_id);
        return {
          actor_name: name,
          status: new_status,
          updated_at: updated_at,
          note,
        };
      }),
    );

    return statusHistory;
  });

export const adminAddNote = createServerFn({ method: "POST" })
  .validator((data: { ticket_id: string; note: string }) => data)
  .handler(async ({ data }) => {
    const { createClient } = await import("./supabase/supabase.server");
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error(userError?.message);

    await insertRequestHistory(supabase, {
      ticket_id: data.ticket_id,
      changed_by_profile_id: user.id,
      event_type: "note_added",
      previous_status: null,
      new_status: null,
      note: data.note,
    });
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
      new_status: data.new_status as RequestStatus,
    });

    // update row in darn_portal_tickets
    await updateTicketStatus(supabase, data.ticket_id, data.new_status);
  });
