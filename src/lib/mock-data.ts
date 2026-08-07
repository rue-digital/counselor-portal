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

export type HistoryStatus = RequestStatus | "note_added";
export const HISTORY_STATUSES: HistoryStatus[] = [...STATUSES, "note_added"];
export const HISTORY_STATUS_LABELS: Record<HistoryStatus, string> = {
  ...STATUS_LABELS,
  note_added: "Note Added",
};
export const HISTORY_STATUS_STYLES: Record<HistoryStatus, string> = {
  ...STATUS_STYLES,
  note_added: "bg-white-200 text-neutral-800 border-neutral-300",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
