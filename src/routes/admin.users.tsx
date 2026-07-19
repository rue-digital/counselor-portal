import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/mock-data";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Profile,
  deleteUser,
  generatePassword,
  getAllUsers,
  CreatedUser,
  createUser,
} from "@/lib/auth";
import { requireRole } from "@/lib/route-auth";

export const Route = createFileRoute("/admin/users")({
  beforeLoad: async () => {
    const profile = await requireRole("admin");
    return { profile };
  },
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: UsersPage,
});

function UsersPage() {
  const { profile } = Route.useRouteContext();
  const [open, setOpen] = useState(false);
  const [showCreateInfo, setShowCreateInfo] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"counselor" | "admin">("counselor");
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setRole("counselor");
  };

  const [users, setUsers] = useState<Profile[] | null>(null);
  async function loadUsers() {
    const allUsers = await getAllUsers();
    if (allUsers) setUsers(allUsers);
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  if (users === null) {
    return (
      <PortalShell role={profile.role} title="Users">
        <div className="text-sm text-muted-foreground">Loading users...</div>
      </PortalShell>
    );
  }

  const handleDeleteUser = async (id: string) => {
    const error = await deleteUser(id);
    if (error) {
      toast.error("Failed to remove user.");
      return;
    }
    setUsers(users.filter((x) => x.id !== id));
    toast.success("User removed.");
  };

  const handleCreateUser = async () => {
    const createPass = generatePassword();
    const user = {
      email: email,
      password: createPass,
      name: name,
      role: role,
    };
    const create = await createUser(user);
    if (!create) {
      toast.error("Failed to create user.");
      return;
    }
    await loadUsers();
    setCreatedUser(user);
    setShowCreateInfo(true);
  };

  return (
    <PortalShell
      role={profile.role}
      title={`Welcome back, ${profile.full_name.split(" ")[0]}`}
      subtitle="Create login credentials for counselors and administrators."
      actions={
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) reset();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New user
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleCreateUser();
                reset();
              }}
            >
              <DialogHeader>
                <DialogTitle>Create user</DialogTitle>
                <DialogDescription>A temporary password will be generated.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="counselor">Counselor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create user</Button>
              </DialogFooter>
            </form>
            {showCreateInfo ? (
              <Dialog
                open={showCreateInfo}
                onOpenChange={() => {
                  setCreatedUser(null);
                  setShowCreateInfo(false);
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Created new {createdUser?.role}</DialogTitle>
                  </DialogHeader>
                  <div className="">
                    <p className="text-sm text-muted-foreground">
                      <br />
                      <b>Name:</b> {createdUser?.name}
                      <br />
                      <b>Email:</b> {createdUser?.email}
                      <br />
                      <b>Password:</b> {createdUser?.password}
                      <br />
                      An email has been sent to the new user with their login credentials.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ) : null}
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(u.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteUser(u.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PortalShell>
  );
}
