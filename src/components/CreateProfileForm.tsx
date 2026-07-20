import { useState } from 'react';
import { supabase } from '@/supabaseClient.ts'; // Adjust path to your Supabase client

export function CreateProfileForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'counselor'>('counselor');
  const [message, setMessage] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Step A: Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (authError) {
      setMessage(`Auth Error: ${authError.message}`);
      return;
    }

    // Step B: Insert row into public profiles table
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        },
      ]);

      if (profileError) {
        setMessage(`Profile Insert Error: ${profileError.message}`);
      } else {
        setMessage(`Successfully created ${role} account for ${email}!`);
        // Reset form fields
        setEmail('');
        setPassword('');
        setFullName('');
      }
    }
  };

  return (
    <form onSubmit={handleCreateUser} className="p-4 flex flex-col gap-3 max-w-md">
      <h3 className="text-lg font-bold">Create Profile</h3>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'counselor')}>
        <option value="counselor">Counselor</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Create User</button>
      {message && <p>{message}</p>}
    </form>
  );
}