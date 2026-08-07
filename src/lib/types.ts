import type { Database } from "./supabase";

export type Profile = Database["public"]["Tables"]["darn_portal_profiles"]["Row"];
export type Ticket = Database["public"]["Tables"]["darn_portal_tickets"]["Row"];
export type TicketInsert = Database["public"]["Tables"]["darn_portal_tickets"]["Insert"];
export type TicketUpdate = Database["public"]["Tables"]["darn_portal_ticket_history"]["Insert"];
export type RequestStatus = Database["public"]["Enums"]["darn_ticket_status"];

export type Request = Ticket & {
  counselor: string;
};

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
