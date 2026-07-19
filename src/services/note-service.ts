import { Note } from '@/models/Note';
import { apiClient } from '@/services/api-client';

const NOTES_PATH = '/Notes';

export const noteService = {
  getNote(): Promise<Note | null> {
    return apiClient.get<Note | null>(NOTES_PATH);
  },

  saveNote(content: string): Promise<Note> {
    return apiClient.put<Note>(NOTES_PATH, { content });
  },
};
