import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";
import { getLoggedInUserProfile, signIn } from "@/lib/auth.server";
import { toast } from "sonner";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const profile = await getLoggedInUserProfile();
    if (profile) {
      throw redirect({ to: profile.role == "admin" ? "/admin" : "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in — DARN Counselor Portal" },
      { name: "description", content: "Sign in to the counselor portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("developforgood");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signingIn = await signIn({ data: { email, password } });

    if (!signingIn?.user) {
      toast.error("Could not sign in. Please try again.");
      return;
    }

    const profile = await getLoggedInUserProfile();

    if (!profile) {
      toast.error("Could not get user profile. Please signing in again.");
      return;
    }

    if (profile.role === "admin") {
      navigate({ to: "/admin" });
    } else if (profile.role === "counselor") {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Sign in to your account</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
            <p className="text-center text-xs text-muted-foreground pt-2">
              No sign up — accounts are created by an administrator.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
