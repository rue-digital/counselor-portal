// src/lib/export-csv.ts

import { Ticket } from "./types";

export function exportTicketsToCSV(
  tickets: Record<string, Ticket>[],
  filename = "requests_export.csv",
) {
  if (!tickets || tickets.length === 0) return;

  // Define headers from keys or custom list
  const headers = [
    "Family Code",
    "Urgent",
    "School",
    "Assistance Types",
    "Assistance Reasons",
    "Context",
    "Youth in Family",
    "Status",
    "Created At",
  ];

  // Map each ticket object to a CSV formatted row
  const rows = tickets.map((t) => [
    `"${t.family_reference_code || ""}"`, // Wrap in quotes to avoid comma splitting
    String(t.urgent_need),
    `"${t.school_name || ""}"`,
    `"${(t.assistance_types || []).join(", ")}"`,
    `"${(t.assistance_reasons || []).join(", ")}"`,
    `"${t.assistance_context}"`,
    t.youth_in_family ?? 0,
    t.status ?? "",
    t.created_at ?? "",
  ]);

  // Combine headers and rows with newlines
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  // Create a Blob and trigger a download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
