import { redirect } from "@tanstack/react-router";
import { getLoggedInUserProfile } from "./auth.server";
import { isPasswordRecovery } from "./password-recovery";
import { Profile } from "./types";

export async function requireAuth(): Promise<Profile> {
  if (isPasswordRecovery()) {
    throw redirect({ to: "/reset-password" });
  }

  const profile = await getLoggedInUserProfile();
  if (!profile) throw redirect({ to: "/login" });
  return profile;
}

export async function requireRole(role: Profile["role"]): Promise<Profile> {
  const profile = await requireAuth();
  if (profile.role !== role) {
    throw redirect({ to: profile.role == "admin" ? "/admin" : "/dashboard" });
  }
  return profile;
}
