import { PortalShell, StatusBadge } from "@/components/portal-shell";
import { requireRole } from "@/lib/route-auth";
import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDate, RequestStatus, STATUS_LABELS } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getRequestsByStatus } from "@/lib/tickets.server";
import { Ticket } from "@/lib/types";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/$id")({
  beforeLoad: async () => {
    const profile = await requireRole("admin");
    return { profile };
  },
  head: () => ({ meta: [{ title: "Requests — Admin" }] }),
  component: CategoryPage,
  notFoundComponent: () => (
    <PortalShell role="admin" title="Requests not found">
      <p className="text-muted-foreground">
        We couldn't find these requests.{" "}
        <Link to="/admin" className="underline">
          Back to board
        </Link>
      </p>
    </PortalShell>
  ),
});

function CategoryPage() {
  const { profile } = Route.useRouteContext();
  const { id } = Route.useParams();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const requests = await getRequestsByStatus({ data: { status: id } });
      setTickets(requests);
    }

    void loadDashboard();
  }, []);

  return (
    <PortalShell
      role={profile.role}
      title={`${STATUS_LABELS[id as RequestStatus]} Requests`}
      subtitle={`Viewing all requests marked as ${STATUS_LABELS[id as RequestStatus].toLowerCase()}.`}
    >
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Counselor</TableHead>
              <TableHead>Family Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((r) => (
              <TableRow key={r.id} className="cursor-pointer" id={r.id}>
                <TableCell className="font-mono text-xs">
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {"REQ-" + r.id.slice(0, 8)}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.requested_item}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.counselor}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.family_reference_code}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.assistance_type}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.priority}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {formatDate(r.updated_at)}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Link to="/admin/requests/$id" params={{ id: r.id }} className="block w-full">
                    {formatDate(r.created_at)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {tickets?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
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
