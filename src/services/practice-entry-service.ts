import { PracticeEntry, PracticeEntryInput } from '@/models/PracticeEntry';

const seedEntries: PracticeEntry[] = [
  {
    id: 'sample-1',
    title: 'Review dashboard layout',
    hours: 2,
    reference: 'dashboard',
    description: 'Check the layout on desktop and mobile screens.',
    category: 'Design',
    assignee: 'Alex',
    completed: true,
    dueDate: '2026-09-18',
    fileName: 'layout-notes.pdf',
    rating: 4,
    createdAt: '2026-09-17T09:00:00.000Z',
    updatedAt: '2026-09-18T09:00:00.000Z',
  },
  {
    id: 'sample-2',
    title: 'Try a new API request',
    hours: 1.5,
    reference: 'api',
    description: 'Practice sending a request and displaying its result.',
    category: 'Development',
    assignee: 'Sam',
    completed: false,
    dueDate: '2026-09-22',
    fileName: '',
    rating: 3,
    createdAt: '2026-09-19T09:00:00.000Z',
    updatedAt: '2026-09-19T09:00:00.000Z',
  },
];

const storageKey = (userId: string) => 'journal-form-practice:' + userId;

function read(userId: string): PracticeEntry[] {
  const stored = window.localStorage.getItem(storageKey(userId));
  if (stored === null) return seedEntries.map((entry) => ({ ...entry }));
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed as PracticeEntry[] : [];
  } catch {
    return [];
  }
}

function write(userId: string, entries: PracticeEntry[]): void {
  window.localStorage.setItem(storageKey(userId), JSON.stringify(entries));
}

export const practiceEntryService = {
  list(userId: string): PracticeEntry[] {
    return read(userId);
  },
  create(userId: string, input: PracticeEntryInput): PracticeEntry {
    const now = new Date().toISOString();
    const entry: PracticeEntry = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    write(userId, [entry, ...read(userId)]);
    return entry;
  },
  update(userId: string, id: string, input: PracticeEntryInput): PracticeEntry {
    const entries = read(userId);
    const existing = entries.find((entry) => entry.id === id);
    if (!existing) throw new Error('The entry could not be found.');
    const updated: PracticeEntry = { ...existing, ...input, updatedAt: new Date().toISOString() };
    write(userId, entries.map((entry) => entry.id === id ? updated : entry));
    return updated;
  },
  delete(userId: string, ids: string[]): void {
    const selected = new Set(ids);
    write(userId, read(userId).filter((entry) => !selected.has(entry.id)));
  },
};
