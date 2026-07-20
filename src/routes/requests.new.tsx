import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/supabaseClient.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/requests/new")({
  head: () => ({ meta: [{ title: "New Request — Counselor Portal" }] }),
  component: NewRequestPage,
});

function NewRequestPage() {
  // Form input states
  const [title, setTitle] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [description, setDescription] = useState("");
  
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  return (
    <PortalShell role="counselor" title="Submit Assistance Request">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Request details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);

              try {
                // 1. Get the current logged-in user
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                  toast.error("You must be logged in to submit a request.");
                  setSubmitting(false);
                  return;
                }

                // 2. Insert into Supabase
                const { error } = await supabase.from("darn_portal_tickets").insert([
                  {
                    title,
                    description,
                    family_reference_code: familyCode,
                    priority: urgency.toLowerCase(),
                    status: "submitted",
                    created_by_profile_id: user.id,
                  },
                ]);

                if (error) {
                  toast.error("Failed to submit request: " + error.message);
                } else {
                  toast.success("Request submitted", {
                    description: "Your request has been queued for review.",
                  });
                  // 3. Redirect back to the admin board
                  navigate({ to: "/admin" });
                }
              } catch (err) {
                toast.error("An unexpected error occurred.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  placeholder="Brief summary of the request"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Family reference code</Label>
                <Input
                  id="identifier"
                  required
                  placeholder="e.g. A. Nguyen"
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value)}
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
              <div className="space-y-2">
                {/* <Label htmlFor="amount">Requested amount (optional)</Label>
                <Input id="amount" type="number" min={0} placeholder="0" /> */}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  rows={6}
                  placeholder="Describe the situation and what assistance is needed."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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
