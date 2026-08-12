import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/portal-shell";
import { STATUSES, STATUS_LABELS, formatDate, type RequestStatus } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { Request } from "@/lib/types";
import { adminAddNote, adminChangeStatus, getTicketStatusHistory } from "@/lib/tickets.server";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type History = { actor_name: string; status: string; updated_at: string; note: string };
type RequestDetailProps = {
  role: string;
  request: Request;
};
export function RequestDetail({ role, request }: RequestDetailProps) {
  const [statusHistory, setStatusHistory] = useState<History[]>([]);
  const [reachedStatuses, setReachedStatuses] = useState<Set<string> | null>(null);
  const [currentStatus, setCurrentStatus] = useState<RequestStatus | null>(request.status);

  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState("");
  const reset = () => {
    setNote("");
  };

  const handleCreateNote = async () => {
    try {
      await adminAddNote({ data: { ticket_id: request.id, note: note } });
      toast.success("Note added to request.");
    } catch (e) {
      toast.error("Failed to add note.");
    }
  };

  useEffect(() => {
    async function getHistory() {
      const history = await getTicketStatusHistory({ data: { ticket_id: request.id } });
      setStatusHistory(history);
      setReachedStatuses(new Set(history.map((e) => e.status)));
    }
    getHistory();
  }, [request.id, statusHistory, currentStatus]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground font-mono">
                  {"REQ-" + request.id.slice(0, 8)}
                </div>
                <CardTitle className="mt-1">
                  {request.request_details.length > 80
                    ? request.request_details.slice(0, 80) + "..."
                    : request.request_details}
                </CardTitle>
              </div>
              <StatusBadge status={currentStatus ?? "submitted"} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-foreground/90 whitespace-pre-line">
              Primary reason for request: {request.assistance_reasons.join(", ")}
            </p>
            <p className="text-foreground/90 whitespace-pre-line">
              Context & family background: {request.assistance_context}
            </p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t">
              <Field label="Category" value={request.assistance_types.join(", ")} />
              <Field label="Urgency" value={request.priority} />
              <Field label="Family Code" value={request.family_reference_code || ""} />
              <Field label="Counselor" value={request.counselor} />
              <Field label="Created" value={formatDate(request.created_at)} />
              <Field label="Updated" value={formatDate(request.updated_at)} />
              {request.needed_by ? (
                <Field label="Needed By" value={formatDate(request.needed_by)} />
              ) : null}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {statusHistory
                .sort((a, b) => a.updated_at.localeCompare(b.updated_at))
                .map((evt, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5" />
                      {idx < statusHistory.length - 1 ? (
                        <div className="flex-1 w-px bg-border my-1" />
                      ) : null}
                    </div>
                    <div className="pb-2 flex-1">
                      <div className="flex items-center gap-2">
                        {evt.status ? (
                          <StatusBadge status={evt.status as RequestStatus} />
                        ) : (
                          <StatusBadge status={"note_added"} />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(evt.updated_at)} · {evt.actor_name}
                        </span>
                      </div>
                      {evt.note ? (
                        <p className="text-sm mt-1 text-foreground/80 text-neutral-800">
                          {evt.note}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{role} actions</CardTitle>
          </CardHeader>
          <CardContent>
            {role === "Admin" ? (
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Update status
                </label>
                <Select
                  value={currentStatus as string}
                  onValueChange={(v) => {
                    setCurrentStatus(v as RequestStatus);
                    adminChangeStatus({
                      data: { ticket_id: request.id, new_status: v.toLocaleLowerCase() },
                    });
                    toast.success(`Status updated to ${STATUS_LABELS[v as RequestStatus]}`);
                  }}
                >
                  <SelectTrigger className="w-42 mb-10">
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
            ) : null}
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
                  Add note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleCreateNote();
                    reset();
                    setOpenNote(false);
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Add note</DialogTitle>
                    <DialogDescription>
                      Notes are viewable by the requesting counselor and all admins.
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
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
