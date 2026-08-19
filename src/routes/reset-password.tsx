import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";
import { setPasswordRecovery } from "@/lib/password-recovery";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — DARN Counselor Portal" },
      { name: "description", content: "Choose a new password for your account." },
    ],
  }),
  component: ResetPasswordPage,
});

function hasRecoveryMarkers() {
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    params.has("code") ||
    params.get("type") === "recovery" ||
    hash.get("type") === "recovery" ||
    hash.has("access_token")
  );
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    let active = true;
    let resolved = false;
    const supabase = createClient();

    const markReady = () => {
      if (!active || resolved) return;
      resolved = true;
      setPasswordRecovery(true);
      setReady(true);
      setInvalidLink(false);
    };

    const markInvalid = () => {
      if (!active || resolved) return;
      resolved = true;
      setInvalidLink(true);
      setReady(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      // PKCE recovery often emits SIGNED_IN; older/implicit flows emit PASSWORD_RECOVERY.
      if (event === "PASSWORD_RECOVERY") {
        markReady();
        return;
      }

      if (event === "SIGNED_IN" && session && hasRecoveryMarkers()) {
        markReady();
      }
    });

    async function establishRecoverySession() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;
        if (error) {
          console.error("exchangeCodeForSession failed:", error);
          markInvalid();
          return;
        }
        markReady();
        // Clean the auth code out of the URL without a navigation.
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;

      if (session && hasRecoveryMarkers()) {
        markReady();
        return;
      }

      // Give onAuthStateChange a moment for hash-based implicit recovery tokens.
      window.setTimeout(async () => {
        if (!active || resolved) return;
        const {
          data: { session: laterSession },
        } = await supabase.auth.getSession();
        if (!active || resolved) return;
        if (laterSession && hasRecoveryMarkers()) {
          markReady();
        } else {
          markInvalid();
        }
      }, 2500);
    }

    void establishRecoverySession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Could not update password. Please try again.");
      return;
    }

    setPasswordRecovery(false);
    await supabase.auth.signOut();
    toast.success("Password updated. Please sign in with your new password.");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Choose a new password</CardTitle>
            <CardDescription className="mt-1.5">
              Enter a new password for your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {invalidLink ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This reset link is invalid or has expired. Request a new one and try again.
              </p>
              <Button asChild className="w-full">
                <Link to="/forgot-password">Request a new link</Link>
              </Button>
            </div>
          ) : !ready ? (
            <p className="text-sm text-muted-foreground">Validating reset link...</p>
          ) : (
            <form className="space-y-4" method="POST" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
