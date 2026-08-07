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
import {
  SCHOOL_VALUES,
  ASSISTANCE_TYPE_VALUES,
  ASSISTANCE_REASON_VALUES,
  Ticket,
} from "@/lib/types";
import { createRequest } from "@/lib/tickets.server";

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

  const handleSubmit = async (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const ticketData = {
        requested_item: String(formData.get("requested_item")),
        family_reference_code: String(formData.get("family_reference_code")),
        school_name: formData.get("school_name") as Ticket["school_name"],
        assistance_type: formData.get("assistance_type") as Ticket["assistance_type"],
        assistance_reason: formData.get("assistance_reason") as Ticket["assistance_reason"],
        assistance_details: String(formData.get("assistance_details")),
        past_assistance: String(formData.get("past_assistance")),
        request_details: String(formData.get("request_details")),
        priority: formData.get("priority") as Ticket["priority"],
        status: "submitted" as Ticket["status"],
      };
      await createRequest({ data: ticketData });

      setTimeout(() => {
        toast.success("Request submitted", {
          description: "Your request has been queued for review.",
        });
        navigate({ to: "/requests" });
      }, 400);
    } catch (error) {
      toast.error("Error creating ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalShell role={profile.role} title="Submit Assistance Request">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Request details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="requested_item">What does the family need?</Label>
                <Input
                  id="requested_item"
                  type="text"
                  required
                  placeholder="Example: Kroger gift card, electric bill payment, twin mattress, bicycle"
                  name="requested_item"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Family reference code</Label>
                <Input
                  id="identifier"
                  type="text"
                  name="family_reference_code"
                  required
                  placeholder="e.g. A. Nguyen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_name">School</Label>
                <Select defaultValue="Bexley High School" name="school_name">
                  <SelectTrigger id="school_name">
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
                <Select defaultValue="Other" name="assistance_type">
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
                <Select defaultValue="Other" name="assistance_reason">
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
                <Label htmlFor="assistance_details">Reason for Assistance</Label>
                <Textarea
                  id="assistance_details"
                  rows={2}
                  name="assistance_details"
                  placeholder="Describe the family's situation and explain why this assistance is needed. Include any circumstances that will help reviewers understand the request."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="past_assistance">
                  What support has this family received from DARN in the past 12 months?
                </Label>
                <Textarea
                  id="past_assistance"
                  rows={2}
                  name="past_assistance"
                  placeholder="If known, describe any assistance the family has received."
                />
              </div>
              <div className="space-y-2 sm:col-span-2 mt-4">
                <Label htmlFor="request_details">Describe what is needed</Label>
                <Textarea
                  id="request_details"
                  name="request_details"
                  required
                  rows={6}
                  placeholder="Include specifics such as amounts, sizes, gender identity, or any other details needed to fulfill this request."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Urgency</Label>
                <Select defaultValue="Low" name="priority">
                  <SelectTrigger id="priority">
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
