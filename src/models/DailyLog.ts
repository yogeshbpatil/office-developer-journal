export interface DailyLog {
  id: string;
  logDate: string; // ISO date string (YYYY-MM-DD)
  tasksWorked: string;
  problemsFaced: string;
  solutions: string;
  learnings: string;
  tips: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface CreateDailyLogDto {
  logDate: string;
  tasksWorked: string;
  problemsFaced: string;
  solutions: string;
  learnings: string;
  tips: string;
}

export interface SearchFilters {
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}
