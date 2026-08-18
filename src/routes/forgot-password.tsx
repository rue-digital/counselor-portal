import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";
import { getLoggedInUserProfile } from "@/lib/auth.server";
import { isPasswordRecovery } from "@/lib/password-recovery";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: async () => {
    if (isPasswordRecovery()) {
      throw redirect({ to: "/reset-password" });
    }

    const profile = await getLoggedInUserProfile();
    if (profile) {
      throw redirect({ to: profile.role == "admin" ? "/admin" : "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Forgot password — DARN Counselor Portal" },
      { name: "description", content: "Reset your counselor portal password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Use the browser client so the PKCE code verifier is stored in this browser.
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    } catch {
      // Swallow errors in the UI to avoid account enumeration.
    }

    setSent(true);
    toast.success("If an account exists for that email, a reset link has been sent.");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription className="mt-1.5">
              Enter your email and we&apos;ll send you a link to reset it.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Check your inbox for a reset link. You can close this page once you&apos;ve opened
                the email.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <form className="space-y-4" method="POST" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Send reset link"}
              </Button>
              <p className="text-center text-xs text-muted-foreground pt-2">
                <Link to="/login" className="underline underline-offset-2 hover:text-foreground">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
