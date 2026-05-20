import { useState } from 'react';

import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';

export const ProjectMembers = ({ canManage = false, members = [], onAddMember, onRemoveMember }) => {
  const [userId, setUserId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userId.trim()) {
      return;
    }

    onAddMember(userId.trim());
    setUserId('');
  };

  return (
    <div className="space-y-4">
      {canManage ? (
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
          <div className="flex-1">
            <Input
              id="member-user-id"
              label="Add member by user ID"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="MongoDB user ID"
            />
          </div>
          <Button type="submit">Add member</Button>
        </form>
      ) : null}

      <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
        {members.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">No members assigned yet.</p>
        ) : (
          members.map((member) => (
            <div key={member.id || member} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-slate-950">{member.name || member}</p>
                {member.email ? <p className="text-sm text-slate-500">{member.email}</p> : null}
              </div>
              {canManage ? (
                <Button variant="secondary" onClick={() => onRemoveMember(member.id || member)}>
                  Remove
                </Button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
