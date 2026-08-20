import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";
import { getLoggedInUserProfile, signIn } from "@/lib/auth.server";
import { isPasswordRecovery } from "@/lib/password-recovery";
import { toast } from "sonner";
import { redirect } from "@tanstack/react-router";
import darnLogo from "@/components/ui/darn-logo.jpg";
import login from "@/components/ui/login.svg";

export const Route = createFileRoute("/login")({
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
      { title: "Sign in — DARN Counselor Portal" },
      { name: "description", content: "Sign in to the counselor portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="min-h-screen flex flex-col bg-[#F4F9FE]">
      <header className="w-full bg-white border-b border-border/40 py-6 px-8 min-h-[72px] shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Top banner content placeholder */}
          {/* Left: DARN Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <img src={darnLogo} alt="" className="h-10 w-10 object-contain rounded-full" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#1E3B70] leading-tight tracking-tight">
                DARN
              </span>
              <span className="text-[11px] text-muted-foreground leading-none">Bexley, Ohio</span>
            </div>
          </div>

          {/* Right: Navigation Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="https://bexleydarn.org/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <a
              href="https://bexleydarn.org/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="https://bexleydarn.org/contact/"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <a href="https://bexleydarn.org/" className="hover:text-foreground transition-colors">
              Resources
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg p-2 shadow-sm">
          <CardHeader className="space-y-3">
            <img src={login} alt="" className="h-10 w-10 object-contain" />
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-[#1e293b]">
                Sign in to your account
              </CardTitle>
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
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1E3B70] hover:bg-[#152A52] text-white font-medium py-2.5 rounded-md transition-colors"
              >
                Login
              </Button>
              <p className="text-center text-xs text-muted-foreground pt-2">
                No sign up — accounts are created by an administrator.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full bg-[#1E3B70] text-white py-4 px-8 border-t border-[#152A52]">
        <div className="max-w-7xl mx-auto text-center text-xs text-white/80">
          DARN Counselor Portal
        </div>
      </footer>
    </div>
  );
}
