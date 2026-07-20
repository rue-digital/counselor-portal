import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient.ts'; // Adjust path to your Supabase client

export function CreateRequestModal({ isOpen, onClose, onRequestCreated }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onRequestCreated: () => void 
}) {
  const [counselors, setCounselors] = useState<any[]>([]);
  const [counselorId, setCounselorId] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  // Fetch counselors when modal opens
  useEffect(() => {
    if (isOpen) {
      supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'counselor')
        .then(({ data }) => setCounselors(data || []));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('requests').insert([
      {
        counselor_id: counselorId,
        title,
        priority,
        status: 'submitted', // Starts under the 'Submitted' column
      },
    ]);

    if (!error) {
      onRequestCreated(); // Refreshes board data
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Counselor Request</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm font-medium">Select Counselor</label>
          <select 
            value={counselorId} 
            onChange={(e) => setCounselorId(e.target.value)} 
            required 
            className="border p-2 rounded"
          >
            <option value="">Select a counselor...</option>
            {counselors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name || c.email}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium">Request Title / Item</label>
          <input
            type="text"
            placeholder="e.g. Need 3 bikes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <label className="text-sm font-medium">Priority</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="flex gap-2 justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}