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
  id: string;
  title: string;
  category: "Financial" | "Academic" | "Housing" | "Mental Health" | "Other";
  description: string;
  urgency: "Low" | "Medium" | "High";
  counselor: string;
  client: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: "counselor" | "admin";
  createdAt: string;
}

export const mockRequests: AssistanceRequest[] = [
  {
    id: "REQ-1001",
    title: "Emergency rent assistance",
    category: "Housing",
    description:
      "Client is at risk of eviction and needs emergency rent support for the current month.",
    urgency: "High",
    counselor: "Jordan Reyes",
    client: "M. Patel",
    status: "in_review",
    createdAt: "2026-06-22T10:14:00Z",
    updatedAt: "2026-06-24T09:00:00Z",
    timeline: [
      { status: "submitted", at: "2026-06-22T10:14:00Z", actor: "Jordan Reyes" },
      { status: "in_review", at: "2026-06-24T09:00:00Z", actor: "Admin", note: "Reviewing documentation." },
    ],
  },
  {
    id: "REQ-1002",
    title: "Textbook stipend request",
    category: "Academic",
    description: "Requesting stipend to cover required textbooks for the summer term.",
    urgency: "Medium",
    counselor: "Jordan Reyes",
    client: "A. Nguyen",
    status: "approved",
    createdAt: "2026-06-18T13:00:00Z",
    updatedAt: "2026-06-25T12:30:00Z",
    timeline: [
      { status: "submitted", at: "2026-06-18T13:00:00Z", actor: "Jordan Reyes" },
      { status: "in_review", at: "2026-06-20T10:00:00Z", actor: "Admin" },
      { status: "approved", at: "2026-06-25T12:30:00Z", actor: "Admin", note: "Approved for $250." },
    ],
  },
  {
    id: "REQ-1003",
    title: "Counseling referral follow-up",
    category: "Mental Health",
    description: "Need referral to in-network therapist for ongoing care.",
    urgency: "Medium",
    counselor: "Sam Chen",
    client: "R. Alvarez",
    status: "submitted",
    createdAt: "2026-06-28T08:45:00Z",
    updatedAt: "2026-06-28T08:45:00Z",
    timeline: [
      { status: "submitted", at: "2026-06-28T08:45:00Z", actor: "Sam Chen" },
    ],
  },
  {
    id: "REQ-1004",
    title: "Utility bill assistance",
    category: "Financial",
    description: "Past due utility bill; disconnection notice received.",
    urgency: "High",
    counselor: "Jordan Reyes",
    client: "T. Brooks",
    status: "fulfilled",
    createdAt: "2026-06-10T11:20:00Z",
    updatedAt: "2026-06-19T15:00:00Z",
    timeline: [
      { status: "submitted", at: "2026-06-10T11:20:00Z", actor: "Jordan Reyes" },
      { status: "in_review", at: "2026-06-11T09:00:00Z", actor: "Admin" },
      { status: "approved", at: "2026-06-13T10:00:00Z", actor: "Admin" },
      { status: "fulfilled", at: "2026-06-19T15:00:00Z", actor: "Admin", note: "Payment sent to utility provider." },
    ],
  },
  {
    id: "REQ-1005",
    title: "Transportation voucher",
    category: "Other",
    description: "Need bus pass to attend weekly appointments.",
    urgency: "Low",
    counselor: "Sam Chen",
    client: "K. Osei",
    status: "closed",
    createdAt: "2026-05-30T09:00:00Z",
    updatedAt: "2026-06-20T16:00:00Z",
    timeline: [
      { status: "submitted", at: "2026-05-30T09:00:00Z", actor: "Sam Chen" },
      { status: "approved", at: "2026-06-02T10:00:00Z", actor: "Admin" },
      { status: "fulfilled", at: "2026-06-12T11:00:00Z", actor: "Admin" },
      { status: "closed", at: "2026-06-20T16:00:00Z", actor: "Admin", note: "Case closed." },
    ],
  },
  {
    id: "REQ-1006",
    title: "Childcare support",
    category: "Financial",
    description: "Requesting subsidy for daycare during job training program.",
    urgency: "Medium",
    counselor: "Jordan Reyes",
    client: "L. Diallo",
    status: "rejected",
    createdAt: "2026-06-05T14:30:00Z",
    updatedAt: "2026-06-09T09:30:00Z",
    timeline: [
      { status: "submitted", at: "2026-06-05T14:30:00Z", actor: "Jordan Reyes" },
      { status: "in_review", at: "2026-06-06T09:00:00Z", actor: "Admin" },
      { status: "rejected", at: "2026-06-09T09:30:00Z", actor: "Admin", note: "Outside program scope; referred to partner agency." },
    ],
  },
];

export const mockUsers: PortalUser[] = [
  { id: "U-01", name: "Jordan Reyes", email: "jordan@portal.test", role: "counselor", createdAt: "2026-04-02T10:00:00Z" },
  { id: "U-02", name: "Sam Chen", email: "sam@portal.test", role: "counselor", createdAt: "2026-05-11T10:00:00Z" },
  { id: "U-03", name: "Alex Morgan", email: "alex@portal.test", role: "admin", createdAt: "2026-03-01T10:00:00Z" },
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