import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell, StatusBadge } from "@/components/portal-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockRequests, formatDate } from "@/lib/mock-data";
import { FilePlus2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import type { Database } from "../lib/supabase";

const CURRENT_COUNSELOR = "Jordan Reyes";
type Ticket = Database["public"]["Tables"]["darn_portal_tickets"]["Row"];

export const Route = createFileRoute("/requests/")({
  head: () => ({ meta: [{ title: "My Requests — Counselor Portal" }] }),
  component: MyRequestsPage,
});

function MyRequestsPage() {
  const [q, setQ] = useState("");
  const mine = mockRequests
    .filter((r) => r.counselor === CURRENT_COUNSELOR)
    .filter((r) =>
      q ? `${r.title} ${r.client} ${r.id}`.toLowerCase().includes(q.toLowerCase()) : true,
    );

  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: darn_tickets, error: ticketserror } = await supabase
        .from("darn_portal_tickets")
        .select("*")
        .order("updated_at", { ascending: false });
      setTickets(darn_tickets);
      setLoading(false);
    }

    void loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PortalShell
      role="counselor"
      title="My Requests"
      subtitle="All assistance requests you've submitted."
      actions={
        <Button asChild>
          <Link to="/requests/new">
            <FilePlus2 className="h-4 w-4" />
            New request
          </Link>
        </Button>
      }
    >
      <Card className="p-4">
        <div className="mb-4 max-w-sm">
          <Input
            placeholder="Search by title, client, or ID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Family Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((r) => (
              <TableRow key={r.id} className="cursor-pointer">
                <TableCell className="font-mono text-xs">
                  <Link to="/requests/$id" params={{ id: r.id }}>
                    {"REQ-" + r.id.slice(0, 8)}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  <Link to="/requests/$id" params={{ id: r.id }}>
                    {r.title}
                  </Link>
                </TableCell>
                <TableCell>{r.family_reference_code}</TableCell>
                {/* <TableCell>{r.category}</TableCell> */}
                <TableCell>{r.priority}</TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(r.updated_at)}</TableCell>
              </TableRow>
            ))}
            {mine.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </PortalShell>
  );
}
