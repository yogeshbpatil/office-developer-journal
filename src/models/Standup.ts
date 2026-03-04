export interface Standup {
  id: string;
  standupDate: string; // ISO date string (YYYY-MM-DD)
  discussionPoints: string;
  todayPlan: string;
  blockers: string;
  targets: string;
  notes?: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface CreateStandupDto {
  standupDate: string;
  discussionPoints: string;
  todayPlan: string;
  blockers: string;
  targets: string;
  notes?: string;
}

export interface SearchFilters {
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}
