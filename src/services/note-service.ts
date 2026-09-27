import { Note, NOTE_COLORS, NoteColor, NotesBoard, StickyNote } from '@/models/Note';
import { apiClient } from '@/services/api-client';

const NOTES_PATH = '/Notes';
const BOARD_FORMAT = 'developer-journal-notes-board';

const emptyBoard = (): NotesBoard => ({
  format: BOARD_FORMAT,
  version: 1,
  notes: [],
});

const createId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNoteColor = (value: unknown): value is NoteColor =>
  typeof value === 'string' && NOTE_COLORS.some((color) => color === value);

const normalizeStickyNote = (value: unknown): StickyNote | null => {
  if (!isRecord(value) || typeof value.id !== 'string') return null;

  const now = new Date().toISOString();
  return {
    id: value.id,
    title: typeof value.title === 'string' ? value.title : '',
    content: typeof value.content === 'string' ? value.content : '',
    color: isNoteColor(value.color) ? value.color : 'yellow',
    isPinned: value.isPinned === true,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : now,
  };
};

export const parseNotesBoard = (content: string): NotesBoard => {
  if (!content.trim()) return emptyBoard();

  try {
    const parsed: unknown = JSON.parse(content);
    if (
      isRecord(parsed) &&
      parsed.format === BOARD_FORMAT &&
      parsed.version === 1 &&
      Array.isArray(parsed.notes)
    ) {
      return {
        format: BOARD_FORMAT,
        version: 1,
        notes: parsed.notes
          .map(normalizeStickyNote)
          .filter((note): note is StickyNote => note !== null),
      };
    }
  } catch {
    // Existing notes were plain text. They are imported below without data loss.
  }

  const now = new Date().toISOString();
  return {
    format: BOARD_FORMAT,
    version: 1,
    notes: [{
      id: createId(),
      title: 'Imported note',
      content,
      color: 'yellow',
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    }],
  };
};

export const serializeNotesBoard = (board: NotesBoard): string => JSON.stringify(board);

export const noteService = {
  getNote(): Promise<Note | null> {
    return apiClient.get<Note | null>(NOTES_PATH);
  },

  saveNote(content: string): Promise<Note> {
    return apiClient.put<Note>(NOTES_PATH, { content });
  },

  async getNotesBoard(): Promise<NotesBoard> {
    const note = await this.getNote();
    return parseNotesBoard(note?.content ?? '');
  },

  async saveNotesBoard(board: NotesBoard): Promise<NotesBoard> {
    const note = await this.saveNote(serializeNotesBoard(board));
    return parseNotesBoard(note.content);
  },
};
