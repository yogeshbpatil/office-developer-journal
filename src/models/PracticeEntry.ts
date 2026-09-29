export interface PracticeEntry {
  id: string;
  title: string;
  hours: number;
  reference: string;
  description: string;
  category: string;
  assignee: string;
  completed: boolean;
  dueDate: string;
  fileName: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export type PracticeEntryInput = Omit<PracticeEntry, 'id' | 'createdAt' | 'updatedAt'>;
