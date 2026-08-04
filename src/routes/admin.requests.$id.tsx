import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { STATUSES, STATUS_LABELS, type RequestStatus } from "@/lib/mock-data";
import { RequestDetail } from "@/components/request-detail";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Request, getRequest, adminChangeStatus, adminAddNote } from "@/lib/auth";
import { requireRole } from "@/lib/route-auth";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/requests/$id")({
  beforeLoad: async () => {
    const profile = await requireRole("admin");
    return { profile };
  },
  head: () => ({ meta: [{ title: "Request — Admin" }] }),
  component: AdminRequestDetailPage,
  notFoundComponent: () => (
    <PortalShell role="admin" title="Request not found">
      <p className="text-muted-foreground">
        We couldn't find that request.{" "}
        <Link to="/admin" className="underline">
          Back to board
        </Link>
      </p>
    </PortalShell>
  ),
});

function AdminRequestDetailPage() {
  const { profile } = Route.useRouteContext();
  const { id } = Route.useParams();
  const [ticket, setTicket] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<RequestStatus | null>(null);

  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState("");
  const reset = () => {
    setNote("");
  };

  useEffect(() => {
    async function getTicket() {
      const request = await getRequest({ data: { id } });
      if (!request) {
        toast.error("Failed to load request. Contact site administrator.");
        setLoading(false);
        return;
      }
      setTicket(request);
      setCurrentStatus(request.status);
      setLoading(false);
    }

    void getTicket();
  }, [id]);

  const handleCreateNote = async () => {
    try {
      await adminAddNote({ data: { ticket_id: id, note: note } });
      toast.success("Note added to request.");
    } catch (e) {
      toast.error("Failed to add note.");
    }
  };

  if (loading || !ticket || !currentStatus) {
    return (
      <PortalShell role={profile.role} title="Request detail">
        <div className="text-sm text-muted-foreground">Loading request...</div>
      </PortalShell>
    );
  }

  const { status, ...react } = ticket;
  const request = { ...react, status: currentStatus };

  return (
    <PortalShell
      role={profile.role}
      title="Request detail"
      subtitle="Review and update the status of this request."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4" />
            Back to board
          </Link>
        </Button>
      }
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Admin actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Update status
            </label>
            <Select
              value={currentStatus}
              onValueChange={(v) => {
                setCurrentStatus(v as RequestStatus);
                adminChangeStatus({ data: { ticket_id: id, new_status: v.toLocaleLowerCase() } });
                toast.success(`Status updated to ${STATUS_LABELS[v as RequestStatus]}`);
              }}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog
            open={openNote}
            onOpenChange={(o) => {
              setOpenNote(o);
              if (!o) reset();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add internal note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleCreateNote();
                  reset();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Add note</DialogTitle>
                  <DialogDescription>
                    Notes are viewable to the requesting counselor and all admins.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Textarea
                      id="note"
                      rows={3}
                      name="note"
                      placeholder="Include any additional details or inquiries."
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpenNote(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add note</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <RequestDetail {...request} />
    </PortalShell>
  );
}
