export interface Note {
  id: string;
  content: string;
  updatedAtUtc: string;
}

export const NOTE_COLORS = ['yellow', 'peach', 'mint', 'blue', 'lavender'] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotesBoard {
  format: 'developer-journal-notes-board';
  version: 1;
  notes: StickyNote[];
}
