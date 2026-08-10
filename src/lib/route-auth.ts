import { redirect } from "@tanstack/react-router";
import { getLoggedInUserProfile, type Profile } from "./auth";

export async function requireAuth(): Promise<Profile> {
    const profile = await getLoggedInUserProfile();
    if (!profile) throw redirect ({ to: "/login" });
    return profile;
}

export async function requireRole(role: Profile["role"]): Promise<Profile> {
    const profile = await requireAuth();
    if (profile.role !== role){
        throw redirect({ to: profile.role == "admin" ? "/admin" : "/dashboard" });
    }
    return profile;
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

