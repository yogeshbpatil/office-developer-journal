'use client';

import { useState } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { getCurrentUser } from '@/lib/auth';

const getStorageKey = () => {
  const user = getCurrentUser();
  return `developer_journal_important_notes_${user?.id ?? 'default'}`;
};

export default function NotesPage() {
  const [notes, setNotes] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(getStorageKey()) ?? '';
  });

  const updateNotes = (value: string) => {
    setNotes(value);
    localStorage.setItem(getStorageKey(), value);
  };

  return (
    <ProtectedLayout fullPage>
      <textarea
        className="notes-editor"
        value={notes}
        onChange={(event) => updateNotes(event.target.value)}
        placeholder="Write your important notes here..."
        aria-label="Important notes"
        autoFocus
        spellCheck
      />
    </ProtectedLayout>
  );
}
