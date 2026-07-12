export type RequestStatus =
  | "submitted"
  | "in_review"
  | "approved"
  | "fulfilled"
  | "closed"
  | "rejected";

export const STATUSES: RequestStatus[] = [
  "submitted",
  "in_review",
  "approved",
  "fulfilled",
  "closed",
  "rejected",
];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "Submitted",
  in_review: "In Review",
  approved: "Approved",
  fulfilled: "Fulfilled",
  closed: "Closed",
  rejected: "Rejected",
};

export const STATUS_STYLES: Record<RequestStatus, string> = {
  submitted: "bg-blue-100 text-blue-800 border-blue-200",
  in_review: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  fulfilled: "bg-violet-100 text-violet-800 border-violet-200",
  closed: "bg-slate-200 text-slate-800 border-slate-300",
  rejected: "bg-rose-100 text-rose-800 border-rose-200",
};

export interface TimelineEvent {
  status: RequestStatus;
  at: string;
  note?: string;
  actor: string;
}

export interface AssistanceRequest {
  // timeline: TimelineEvent[];
  created_at: string;
  created_by_profile_id: string;
  description: string;
  family_reference_code: string | null;
  id: string;
  needed_by: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  request_type: string;
  status: "submitted" | "in_review" | "approved" | "fulfilled" | "closed" | "rejected";
  title: string;
  updated_at: string;
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: "counselor" | "admin";
  createdAt: string;
}

export const mockUsers: PortalUser[] = [
  {
    id: "U-01",
    name: "Jordan Reyes",
    email: "jordan@portal.test",
    role: "counselor",
    createdAt: "2026-04-02T10:00:00Z",
  },
  {
    id: "U-02",
    name: "Sam Chen",
    email: "sam@portal.test",
    role: "counselor",
    createdAt: "2026-05-11T10:00:00Z",
  },
  {
    id: "U-03",
    name: "Alex Morgan",
    email: "alex@portal.test",
    role: "admin",
    createdAt: "2026-03-01T10:00:00Z",
  },
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
