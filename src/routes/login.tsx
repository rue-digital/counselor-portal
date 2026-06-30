import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Counselor Portal" },
      { name: "description", content: "Sign in to the counselor portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("jordan@portal.test");
  const [password, setPassword] = useState("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Placeholder sign-in. Authentication is not wired up in this MVP.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
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
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button asChild type="button" variant="outline" size="sm">
                <Link to="/dashboard">Enter as Counselor</Link>
              </Button>
              <Button asChild type="button" variant="outline" size="sm">
                <Link to="/admin">Enter as Admin</Link>
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground pt-2">
              No sign up — accounts are created by an administrator.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}