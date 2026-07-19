'use client';

import { useEffect, useRef, useState } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { noteService } from '@/services/note-service';

export default function NotesPage() {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const loadedContent = useRef('');

  useEffect(() => {
    let active = true;
    noteService.getNote()
      .then((note) => {
        if (!active) return;
        const content = note?.content ?? '';
        loadedContent.current = content;
        setNotes(content);
      })
      .catch(() => active && setSaveState('error'))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isLoading || notes === loadedContent.current) return;
    const timeoutId = window.setTimeout(() => {
      noteService.saveNote(notes)
        .then((note) => {
          loadedContent.current = note.content;
          setSaveState('saved');
        })
        .catch(() => setSaveState('error'));
    }, 600);
    return () => window.clearTimeout(timeoutId);
  }, [notes, isLoading]);

  const updateNotes = (value: string) => {
    setNotes(value);
    setSaveState('saving');
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
        disabled={isLoading}
      />
      <div className={`notes-save-status ${saveState === 'error' ? 'text-danger' : 'text-muted'}`} aria-live="polite">
        {isLoading ? 'Loading…' : saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Could not save notes' : ''}
      </div>
    </ProtectedLayout>
  );
}
