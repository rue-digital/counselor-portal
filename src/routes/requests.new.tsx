import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { requireRole } from "@/lib/route-auth";
import { SCHOOL_VALUES, ASSISTANCE_TYPE_VALUES, ASSISTANCE_REASON_VALUES } from "@/lib/auth";

export const Route = createFileRoute("/requests/new")({
  beforeLoad: async () => {
    const profile = await requireRole("counselor");
    return { profile };
  },
  head: () => ({ meta: [{ title: "New Request — Counselor Portal" }] }),
  component: NewRequestPage,
});

function NewRequestPage() {
  const { profile } = Route.useRouteContext();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  return (
    <PortalShell role={profile.role} title="Submit Assistance Request">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Request details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitting(true);
              setTimeout(() => {
                toast.success("Request submitted", {
                  description: "Your request has been queued for review.",
                });
                navigate({ to: "/requests" });
              }, 400);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">What does the family need?</Label>
                <Input
                  id="title"
                  required
                  placeholder="Example: Kroger gift card, electric bill payment, twin mattress, bicycle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Family reference code</Label>
                <Input id="identifier" required placeholder="e.g. A. Nguyen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Select defaultValue="Bexley High School">
                  <SelectTrigger id="school">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOL_VALUES.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type of Assistance Requested</Label>
                <Select defaultValue="Other">
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSISTANCE_TYPE_VALUES.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Primary Reason for Request</Label>
                <Select defaultValue="Other">
                  <SelectTrigger id="reason">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSISTANCE_REASON_VALUES.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2 mt-4">
                <Label htmlFor="assistance_reason_text">Reason for Assistance</Label>
                <Textarea
                  id="assistance_reason_text"
                  rows={2}
                  placeholder="Describe the family's situation and explain why this assistance is needed. Include any circumstances that will help reviewers understand the request."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="past_support_text">
                  What support has this family received from DARN in the past 12 months?
                </Label>
                <Textarea
                  id="past_support_text"
                  rows={2}
                  required
                  placeholder="If known, describe any assistance the family has received."
                />
              </div>
              <div className="space-y-2 sm:col-span-2 mt-4">
                <Label htmlFor="description">Describe what is needed</Label>
                <Textarea
                  id="description"
                  required
                  rows={6}
                  placeholder="Include specifics such as amounts, sizes, gender identity, or any other details needed to fulfill this request."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select defaultValue="Medium">
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Low", "Medium", "High", "Urgent"].map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/requests" })}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PortalShell>
  );
}
