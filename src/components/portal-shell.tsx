import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, STATUS_STYLES, type RequestStatus } from "@/lib/mock-data";
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  KanbanSquare,
  Users,
  LogOut,
  LifeBuoy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const counselorNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/requests/new", label: "New Request", icon: FilePlus2 },
  { to: "/requests", label: "My Requests", icon: ListChecks },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "Request Board", icon: KanbanSquare },
  { to: "/admin/users", label: "Users", icon: Users },
];

interface PortalShellProps {
  children: ReactNode;
  role: "counselor" | "admin";
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PortalShell({ children, role, title, subtitle, actions }: PortalShellProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = role === "admin" ? adminNav : counselorNav;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LifeBuoy className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">DARN Portal</div>
            <div className="text-xs text-muted-foreground capitalize">{role} workspace</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3 space-y-1">
          <button
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground hover:cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b bg-card">
          <div className="flex items-start justify-between gap-4 px-6 py-5">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
