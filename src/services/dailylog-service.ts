import { DailyLog, CreateDailyLogDto, SearchFilters } from '@/models/DailyLog';
import { apiClient } from '@/services/api-client';

const DAILY_LOGS_PATH = '/DailyLogs';

const sortByLogDateDesc = (logs: DailyLog[]) =>
  [...logs].sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());

const applyClientFilters = (logs: DailyLog[], filters: SearchFilters): DailyLog[] => {
  let results = [...logs];

  if (filters.keyword?.trim()) {
    const keyword = filters.keyword.toLowerCase().trim();
    results = results.filter((log) => {
      return (
        log.tasksWorked.toLowerCase().includes(keyword) ||
        log.problemsFaced.toLowerCase().includes(keyword) ||
        log.solutions.toLowerCase().includes(keyword) ||
        log.learnings.toLowerCase().includes(keyword) ||
        (log.tips && log.tips.toLowerCase().includes(keyword)) ||
        log.logDate.includes(keyword) ||
        (log.gitLink && log.gitLink.toLowerCase().includes(keyword))
      );
    });
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    results = results.filter((log) => new Date(log.logDate) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    results = results.filter((log) => new Date(log.logDate) <= toDate);
  }

  return sortByLogDateDesc(results);
};

export const dailyLogService = {
  async getAllLogs(): Promise<DailyLog[]> {
    const logs = await apiClient.get<DailyLog[]>(DAILY_LOGS_PATH);
    return sortByLogDateDesc(logs);
  },

  async getLogById(id: string): Promise<DailyLog> {
    return apiClient.get<DailyLog>(`${DAILY_LOGS_PATH}/${id}`);
  },

  async createLog(logData: CreateDailyLogDto): Promise<DailyLog> {
    return apiClient.post<DailyLog>(DAILY_LOGS_PATH, logData);
  },

  async updateLog(id: string, logData: Partial<CreateDailyLogDto>): Promise<DailyLog> {
    return apiClient.put<DailyLog>(`${DAILY_LOGS_PATH}/${id}`, logData);
  },

  async deleteLog(id: string): Promise<void> {
    await apiClient.delete<void>(`${DAILY_LOGS_PATH}/${id}`);
  },

  async searchLogs(filters: SearchFilters): Promise<DailyLog[]> {
    const logs = await dailyLogService.getAllLogs();
    return applyClientFilters(logs, filters);
  },
};
