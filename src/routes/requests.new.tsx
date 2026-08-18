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
  TicketInsert,
} from "@/lib/types";
import { MultiSelect } from "@/components/ui/multiselect";
import { createRequest } from "@/lib/tickets.server";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { CalendarIcon, CircleX } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [assistanceTypes, setAssistanceTypes] = useState<string[]>([]);
  const [assistanceReasons, setAssistanceReasons] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [isUrgent, setIsUrgent] = useState(false);

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
        family_reference_code: String(formData.get("family_reference_code")),
        youth_in_family: Number(formData.get("youth_in_family")),
        school_name: formData.get("school_name") as TicketInsert["school_name"],
        assistance_types: assistanceTypes as TicketInsert["assistance_types"],
        assistance_reasons: assistanceReasons as TicketInsert["assistance_reasons"],
        assistance_context: String(formData.get("assistance_context")),
        past_assistance: String(formData.get("past_assistance")),
        request_details: String(formData.get("request_details")),
        status: "submitted" as TicketInsert["status"],
        needed_by: date as TicketInsert["needed_by"],
        urgent_need: isUrgent as TicketInsert["urgent_need"],
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="identifier" required={true}>
                  Family reference code
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  name="family_reference_code"
                  required
                  placeholder="e.g. EVE-MS-MT"
                  pattern="^[A-Za-z]{3}-[A-Za-z]{2}-[A-Za-z]{2}$"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youth_in_family" required={true}>
                  Youth in family
                </Label>
                <Input
                  id="youth_in_family"
                  type="number"
                  name="youth_in_family"
                  min={0}
                  required
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_name" required={true}>
                  School
                </Label>
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
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assistance_types" required={true}>
                  Type of assistance requested
                </Label>
                <MultiSelect
                  name={"assistance_types"}
                  options={ASSISTANCE_TYPE_VALUES.map((i) => ({ label: i, value: i }))}
                  value={assistanceTypes}
                  onValueChange={setAssistanceTypes}
                  placeholder="Select assistance types"
                ></MultiSelect>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assistance_reasons" required={true}>
                  Primary reason for request
                </Label>
                <MultiSelect
                  name={"assistance_reasons"}
                  options={ASSISTANCE_REASON_VALUES.map((i) => ({ label: i, value: i }))}
                  value={assistanceReasons}
                  onValueChange={setAssistanceReasons}
                  placeholder="Select assistance reasons"
                ></MultiSelect>
              </div>
            </div>
            {assistanceTypes.includes("Gift Card") || assistanceTypes.includes("Utility Bill") ? (
              <p className="text-sm italic">
                For utility bills or gift cards, Denny Devine (614-403-0232) will contact you for
                more details.
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="request_details" required={true}>
                Specific details & quantities
              </Label>
              <Input
                id="request_details"
                type="text"
                name="request_details"
                required
                placeholder="e.g., $150 Grocery Gift Card; Size 4T winter coat; Water bill pay-off ($400)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assistance_context" required={true}>
                Context & family background
              </Label>
              <Textarea
                id="assistance_context"
                rows={2}
                name="assistance_context"
                required
                placeholder="Describe the family's situation and explain why this assistance is needed. Include any circumstances that will help reviewers understand the request."
              />
            </div>
            <div className="space-y-2">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[3fr_7fr]">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <Label htmlFor="needed_by" className="mb-1 mt-2">
                    Needed by
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-1 size-4" />
                        {date ? date.toLocaleDateString() : "select date"}
                        {date ? (
                          <Button
                            type="reset"
                            onClick={() => setDate(undefined)}
                            variant="ghost"
                            className="p-0 m-0"
                          >
                            <CircleX className="text-gray-600" />
                          </Button>
                        ) : null}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mark as urgent, immediate need</Label>
                <div className="flex items-center gap-3 rounded-md border p-2.5">
                  <Checkbox
                    id="urgent_need"
                    checked={isUrgent}
                    onCheckedChange={(checked) => setIsUrgent(Boolean(checked))}
                  />
                  <Label
                    htmlFor="urgent_need"
                    className="space-y-1 leading-none cursor-pointer font-normal"
                  >
                    e.g. utility shut-off, safety concern, or emergency accommodation
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/requests" })}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#1E3B70] hover:bg-[#152A52] text-white">
                {submitting ? "Submitting..." : "Submit request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PortalShell>
  );
}
