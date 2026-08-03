import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/portal-shell";
import { STATUSES, STATUS_LABELS, formatDate, type AssistanceRequest } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { Ticket, getTicketStatusHistory } from "@/lib/auth";
import { Check } from "lucide-react";

type History = { actor_name: string; status: string; updated_at: string };
export function RequestDetail(request: Ticket) {
  const [statusHistory, setStatusHistory] = useState<History[]>([]);
  const [reachedStatuses, setReachedStatuses] = useState<Set<string> | null>(null);

  useEffect(() => {
    async function getHistory() {
      const history = await getTicketStatusHistory({ data: { ticket_id: request.id } });
      setStatusHistory(history);
      setReachedStatuses(new Set(history.map((e) => e.status)));
    }
    getHistory();
  }, []);

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
                <CardTitle className="mt-1">{request.requested_item}</CardTitle>
              </div>
              <StatusBadge status={request.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-foreground/90 whitespace-pre-line">{request.assistance_details}</p>
            <p className="text-foreground/90 whitespace-pre-line">{request.request_details}</p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t">
              <Field label="Category" value={request.assistance_type} />
              <Field label="Urgency" value={request.priority} />
              {/* <Field label="Client" value={request.client} /> */}
              {/* <Field label="Counselor" value={request.counselor} /> */}
              <Field label="Created" value={formatDate(request.created_at)} />
              <Field label="Updated" value={formatDate(request.updated_at)} />
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
                        <StatusBadge status={evt.status} />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(evt.updated_at)} · {evt.actor_name}
                        </span>
                      </div>
                      {/* {evt.note ? (
                        <p className="text-sm mt-1 text-foreground/80">{evt.note}</p>
                      ) : null} */}
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
            <CardTitle className="text-base">Status timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {STATUSES.map((s) => {
                const reached = reachedStatuses?.has(s);
                const current = request.status === s;
                return (
                  <li key={s} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full border flex items-center justify-center text-xs",
                        current
                          ? "bg-primary text-primary-foreground border-primary"
                          : reached
                            ? "bg-muted border-border text-foreground"
                            : "border-dashed border-border text-muted-foreground",
                      )}
                    >
                      {reached ? <Check className="h-3.5 w-3.5" /> : null}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        current
                          ? "font-medium"
                          : reached
                            ? "text-foreground"
                            : "text-muted-foreground",
                      )}
                    >
                      {STATUS_LABELS[s]}
                    </span>
                  </li>
                );
              })}
            </ol>
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
