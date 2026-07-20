export type UserRole = 'admin' | 'counselor';

export interface Profile {
  id: string; // Maps to Supabase auth.users ID
  email: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
}

export interface CounselorRequest {
  id?: string;
  counselor_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at?: string;
}