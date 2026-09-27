'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { NOTE_COLORS, NoteColor, NotesBoard, StickyNote } from '@/models/Note';
import { noteService, serializeNotesBoard } from '@/services/note-service';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const colorLabels: Record<NoteColor, string> = {
  yellow: 'Yellow',
  peach: 'Peach',
  mint: 'Mint',
  blue: 'Blue',
  lavender: 'Lavender',
};

const createStickyNote = (): StickyNote => {
  const now = new Date().toISOString();
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return { id, title: '', content: '', color: 'yellow', isPinned: false, createdAt: now, updatedAt: now };
};

const formatUpdatedAt = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently updated';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function NotesPage() {
  const [board, setBoard] = useState<NotesBoard>({
    format: 'developer-journal-notes-board', version: 1, notes: [],
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const persistedBoard = useRef('');
  const latestBoard = useRef('');
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const isMounted = useRef(true);
  const hasLoadedBoard = useRef(false);

  useEffect(() => {
    let active = true;
    isMounted.current = true;
    noteService.getNotesBoard()
      .then((loadedBoard) => {
        if (!active) return;
        const serialized = serializeNotesBoard(loadedBoard);
        persistedBoard.current = serialized;
        latestBoard.current = serialized;
        hasLoadedBoard.current = true;
        setBoard(loadedBoard);
        setActiveNoteId(loadedBoard.notes[0]?.id ?? null);
      })
      .catch(() => active && setSaveState('error'))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; isMounted.current = false; };
  }, []);

  useEffect(() => {
    const serialized = serializeNotesBoard(board);
    latestBoard.current = serialized;
    if (isLoading || !hasLoadedBoard.current || serialized === persistedBoard.current) return;

    const timeoutId = window.setTimeout(() => {
      const snapshot = board;
      const snapshotContent = serialized;
      saveQueue.current = saveQueue.current
        .catch(() => undefined)
        .then(async () => {
          const savedBoard = await noteService.saveNotesBoard(snapshot);
          persistedBoard.current = serializeNotesBoard(savedBoard);
          if (isMounted.current && latestBoard.current === snapshotContent) setSaveState('saved');
        })
        .catch(() => { if (isMounted.current) setSaveState('error'); });
    }, 650);
    return () => window.clearTimeout(timeoutId);
  }, [board, isLoading]);

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...board.notes]
      .filter((note) => !query || `${note.title}\n${note.content}`.toLowerCase().includes(query))
      .sort((left, right) => {
        if (left.isPinned !== right.isPinned) return left.isPinned ? -1 : 1;
        return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
      });
  }, [board.notes, search]);

  const activeNote = board.notes.find((note) => note.id === activeNoteId) ?? null;
  const markChanged = () => setSaveState('saving');

  const addNote = () => {
    const note = createStickyNote();
    setBoard((current) => ({ ...current, notes: [note, ...current.notes] }));
    setActiveNoteId(note.id);
    setSearch('');
    markChanged();
  };

  const updateActiveNote = (changes: Partial<Pick<StickyNote, 'title' | 'content' | 'color' | 'isPinned'>>) => {
    if (!activeNoteId) return;
    const updatedAt = new Date().toISOString();
    setBoard((current) => ({
      ...current,
      notes: current.notes.map((note) => note.id === activeNoteId ? { ...note, ...changes, updatedAt } : note),
    }));
    markChanged();
  };

  const deleteActiveNote = () => {
    if (!activeNote) return;
    const name = activeNote.title.trim() || 'Untitled note';
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    const remaining = board.notes.filter((note) => note.id !== activeNote.id);
    setBoard((current) => ({
      ...current, notes: current.notes.filter((note) => note.id !== activeNote.id),
    }));
    setActiveNoteId(remaining[0]?.id ?? null);
    markChanged();
  };

  const wordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0;
  const saveMessage = isLoading ? 'Loading notes…'
    : saveState === 'saving' ? 'Saving changes…'
      : saveState === 'saved' ? 'All changes saved'
        : saveState === 'error' ? 'Could not save. Your changes are still on this screen.' : 'Ready';

  return (
    <ProtectedLayout fullPage>
      <div className="notes-board">
        <header className="notes-board-header">
          <div>
            <p className="notes-eyebrow">Personal workspace</p>
            <h1 className="notes-board-title">My Notes</h1>
            <p className="notes-board-subtitle">Capture ideas, pin what matters, and pick up where you left off.</p>
          </div>
          <button className="btn btn-primary notes-new-button" type="button" onClick={addNote} disabled={isLoading}>
            <span aria-hidden="true">+</span> New note
          </button>
        </header>
        <div className="notes-board-layout">
          <aside className="notes-library" aria-label="Saved notes">
            <div className="notes-library-toolbar">
              <label className="visually-hidden" htmlFor="notes-search">Search notes</label>
              <div className="notes-search-wrap">
                <span aria-hidden="true">⌕</span>
                <input id="notes-search" className="form-control" type="search" value={search}
                  onChange={(event) => setSearch(event.target.value)} placeholder="Search notes…" disabled={isLoading} />
              </div>
              <span className="notes-count">{visibleNotes.length} of {board.notes.length}</span>
            </div>

            {isLoading ? (
              <div className="notes-library-empty" role="status">
                <span className="loading-spinner" aria-hidden="true" />
                <span>Loading your notes…</span>
              </div>
            ) : visibleNotes.length === 0 ? (
              <div className="notes-library-empty">
                <span className="notes-empty-icon" aria-hidden="true">✦</span>
                <strong>{board.notes.length === 0 ? 'Your board is empty' : 'No matching notes'}</strong>
                <span>{board.notes.length === 0 ? 'Create your first sticky note.' : 'Try another search term.'}</span>
                {board.notes.length === 0 && (
                  <button className="btn btn-sm btn-outline-primary mt-2" type="button" onClick={addNote}>Create a note</button>
                )}
              </div>
            ) : (
              <div className="notes-card-grid">
                {visibleNotes.map((note) => (
                  <button key={note.id}
                    className={`sticky-note-card sticky-note-${note.color}${note.id === activeNoteId ? ' is-active' : ''}`}
                    type="button" onClick={() => setActiveNoteId(note.id)} aria-pressed={note.id === activeNoteId}>
                    <span className="sticky-note-card-topline">
                      <strong>{note.title.trim() || 'Untitled note'}</strong>
                      {note.isPinned && <span title="Pinned" aria-label="Pinned">●</span>}
                    </span>
                    <span className="sticky-note-preview">{note.content.trim() || 'Start writing your note…'}</span>
                    <span className="sticky-note-date">{formatUpdatedAt(note.updatedAt)}</span>
                  </button>
                ))}
              </div>
            )}
          </aside>
          <section className="notes-workspace" aria-label="Note editor">
            {activeNote ? (
              <div className={`note-sheet note-sheet-${activeNote.color}`}>
                <div className="note-sheet-toolbar">
                  <div className="note-color-picker" aria-label="Note color">
                    {NOTE_COLORS.map((color) => (
                      <button key={color}
                        className={`note-color-swatch note-color-${color}${activeNote.color === color ? ' is-selected' : ''}`}
                        type="button" onClick={() => updateActiveNote({ color })}
                        aria-label={`Use ${colorLabels[color].toLowerCase()} color`}
                        aria-pressed={activeNote.color === color} title={colorLabels[color]} />
                    ))}
                  </div>
                  <div className="d-flex gap-2">
                    <button className={`btn btn-sm ${activeNote.isPinned ? 'btn-dark' : 'btn-outline-dark'}`}
                      type="button" onClick={() => updateActiveNote({ isPinned: !activeNote.isPinned })}
                      aria-pressed={activeNote.isPinned}>
                      {activeNote.isPinned ? 'Pinned' : 'Pin note'}
                    </button>
                    <button className="btn btn-sm btn-outline-danger" type="button" onClick={deleteActiveNote}>Delete</button>
                  </div>
                </div>

                <label className="visually-hidden" htmlFor="active-note-title">Note name</label>
                <input id="active-note-title" className="note-title-input" value={activeNote.title}
                  onChange={(event) => updateActiveNote({ title: event.target.value.slice(0, 100) })}
                  placeholder="Give this note a name" maxLength={100} autoFocus />

                <label className="visually-hidden" htmlFor="active-note-content">Note content</label>
                <textarea id="active-note-content" className="note-content-input" value={activeNote.content}
                  onChange={(event) => updateActiveNote({ content: event.target.value })}
                  placeholder="Write anything you want to remember…" spellCheck />

                <footer className="note-sheet-footer">
                  <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
                  <span>Updated {formatUpdatedAt(activeNote.updatedAt)}</span>
                </footer>
              </div>
            ) : (
              <div className="notes-workspace-empty">
                <span className="notes-workspace-illustration" aria-hidden="true">✎</span>
                <h2>{board.notes.length === 0 ? 'Create your first note' : 'Choose a note to open it'}</h2>
                <p>{board.notes.length === 0 ? 'Your ideas will appear here as colorful sticky cards.' : 'Select a card from your notes board.'}</p>
                <button className="btn btn-primary" type="button" onClick={addNote}>New note</button>
              </div>
            )}
          </section>
        </div>
        <div className={`notes-save-status ${saveState === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
          <span className={`notes-save-dot notes-save-dot-${saveState}`} aria-hidden="true" />
          {saveMessage}
        </div>
      </div>
    </ProtectedLayout>
  );
}
