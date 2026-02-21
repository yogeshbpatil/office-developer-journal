import { DailyLog, CreateDailyLogDto, SearchFilters } from '@/models/DailyLog';

// Mock daily logs database (in-memory)
let MOCK_DAILY_LOGS: DailyLog[] = [
  {
    id: '1',
    logDate: '2026-02-18',
    tasksWorked: 'Implemented user authentication module using JWT tokens. Integrated login and registration APIs with the frontend.',
    problemsFaced: 'CORS issues when calling the backend API. Token expiration handling was not clear initially.',
    solutions: 'Configured CORS middleware on the backend. Implemented token refresh logic and automatic redirect to login on 401 errors.',
    learnings: 'Learned about HTTP-only cookies vs localStorage for token storage. Understanding the security implications of each approach.',
    tips: 'Always implement proper error handling for authentication failures. Consider using interceptors for token injection.',
    gitLink: 'https://github.com/username/project/commit/a1b2c3d4',
    createdAt: '2026-02-18T10:30:00Z',
    updatedAt: '2026-02-18T10:30:00Z',
  },
  {
    id: '2',
    logDate: '2026-02-17',
    tasksWorked: 'Built responsive dashboard with Bootstrap 5. Created reusable card components for displaying metrics and charts.',
    problemsFaced: 'Bootstrap grid system was causing layout issues on mobile devices. Some components were not responsive.',
    solutions: 'Used Bootstrap breakpoint utilities correctly. Applied container-fluid and proper col-* classes for responsive layout.',
    learnings: 'Mastered Bootstrap 5 grid system and utility classes. Learned about the new Bootstrap 5 features compared to v4.',
    tips: 'Test responsiveness early and often. Use browser DevTools device toolbar to check multiple screen sizes.',
    gitLink: 'https://github.com/username/project/commit/e5f6g7h8',
    createdAt: '2026-02-17T09:15:00Z',
    updatedAt: '2026-02-17T09:15:00Z',
  },
  {
    id: '3',
    logDate: '2026-02-16',
    tasksWorked: 'Set up Next.js 16 project with TypeScript. Configured ESLint and Prettier for code quality.',
    problemsFaced: 'Initial setup with App Router was confusing. TypeScript errors with strict mode enabled.',
    solutions: 'Read Next.js 16 documentation thoroughly. Fixed TypeScript errors by properly typing components and props.',
    learnings: 'Understanding the difference between App Router and Pages Router. Benefits of TypeScript in large applications.',
    tips: 'Start with proper project setup and tooling. It saves a lot of time in the long run.',
    createdAt: '2026-02-16T14:20:00Z',
    updatedAt: '2026-02-16T14:20:00Z',
  },
  {
    id: '4',
    logDate: '2026-02-15',
    tasksWorked: 'Implemented search functionality with keyword filtering. Added date range picker for filtering logs.',
    problemsFaced: 'Performance issues when searching through large datasets. Debouncing search input was challenging.',
    solutions: 'Implemented debouncing using setTimeout. Optimized search algorithm to filter on the client side efficiently.',
    learnings: 'Learned about debouncing and throttling techniques. Understanding performance optimization strategies.',
    tips: 'Always debounce user input for search functionality. Consider server-side pagination for large datasets.',
    createdAt: '2026-02-15T11:45:00Z',
    updatedAt: '2026-02-15T11:45:00Z',
  },
  {
    id: '5',
    logDate: '2026-02-14',
    tasksWorked: 'Created form validation with React Hook Form. Integrated validation schema with Zod.',
    problemsFaced: 'Complex validation rules were difficult to implement. Form state management was getting messy.',
    solutions: 'Used React Hook Form with Zod for schema validation. Separated validation logic into reusable schemas.',
    learnings: 'React Hook Form simplifies form handling significantly. Zod provides excellent TypeScript integration.',
    tips: 'Use form libraries instead of managing form state manually. Define validation schemas separately for reusability.',
    createdAt: '2026-02-14T16:00:00Z',
    updatedAt: '2026-02-14T16:00:00Z',
  },
];

// Counter for generating unique IDs
let idCounter = MOCK_DAILY_LOGS.length + 1;

/**
 * Mock daily log service
 * Simulates async API calls with delay
 * In production, replace with actual API calls using apiClient
 */
export const dailyLogService = {
  /**
   * Get all daily logs
   * @returns Promise with array of daily logs
   */
  async getAllLogs(): Promise<DailyLog[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return logs sorted by date descending
    return [...MOCK_DAILY_LOGS].sort(
      (a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime()
    );
  },

  /**
   * Get daily log by ID
   * @param id - Log ID
   * @returns Promise with daily log
   */
  async getLogById(id: string): Promise<DailyLog> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const log = MOCK_DAILY_LOGS.find((l) => l.id === id);

    if (!log) {
      throw new Error(`Daily log with ID ${id} not found`);
    }

    return log;
  },

  /**
   * Create new daily log
   * @param logData - Daily log data
   * @returns Promise with created daily log
   */
  async createLog(logData: CreateDailyLogDto): Promise<DailyLog> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newLog: DailyLog = {
      id: String(idCounter++),
      ...logData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_DAILY_LOGS.push(newLog);

    return newLog;
  },

  /**
   * Update existing daily log
   * @param id - Log ID
   * @param logData - Updated log data
   * @returns Promise with updated daily log
   */
  async updateLog(id: string, logData: Partial<CreateDailyLogDto>): Promise<DailyLog> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const logIndex = MOCK_DAILY_LOGS.findIndex((l) => l.id === id);

    if (logIndex === -1) {
      throw new Error(`Daily log with ID ${id} not found`);
    }

    const updatedLog: DailyLog = {
      ...MOCK_DAILY_LOGS[logIndex],
      ...logData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_DAILY_LOGS[logIndex] = updatedLog;

    return updatedLog;
  },

  /**
   * Delete daily log
   * @param id - Log ID
   * @returns Promise with success status
   */
  async deleteLog(id: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const logIndex = MOCK_DAILY_LOGS.findIndex((l) => l.id === id);

    if (logIndex === -1) {
      throw new Error(`Daily log with ID ${id} not found`);
    }

    MOCK_DAILY_LOGS.splice(logIndex, 1);
  },

  /**
   * Search daily logs by keyword and filters
   * @param filters - Search filters
   * @returns Promise with filtered daily logs
   */
  async searchLogs(filters: SearchFilters): Promise<DailyLog[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    let results = [...MOCK_DAILY_LOGS];

    // Filter by keyword (search across all fields)
    if (filters.keyword && filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();
      results = results.filter((log) => {
        return (
          log.tasksWorked.toLowerCase().includes(keyword) ||
          log.problemsFaced.toLowerCase().includes(keyword) ||
          log.solutions.toLowerCase().includes(keyword) ||
          log.learnings.toLowerCase().includes(keyword) ||
          log.tips.toLowerCase().includes(keyword) ||
          log.logDate.includes(keyword) ||
          (log.gitLink && log.gitLink.toLowerCase().includes(keyword))
        );
      });
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      results = results.filter((log) => new Date(log.logDate) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      results = results.filter((log) => new Date(log.logDate) <= toDate);
    }

    // Sort by date descending
    return results.sort(
      (a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime()
    );
  },
};

/**
 * Future implementation with real API:
 * 
 * export const dailyLogService = {
 *   async getAllLogs(): Promise<DailyLog[]> {
 *     return apiClient.get<DailyLog[]>('/dailylogs');
 *   },
 * 
 *   async getLogById(id: string): Promise<DailyLog> {
 *     return apiClient.get<DailyLog>(`/dailylogs/${id}`);
 *   },
 * 
 *   async createLog(logData: CreateDailyLogDto): Promise<DailyLog> {
 *     return apiClient.post<DailyLog>('/dailylogs', logData);
 *   },
 * 
 *   async updateLog(id: string, logData: Partial<CreateDailyLogDto>): Promise<DailyLog> {
 *     return apiClient.put<DailyLog>(`/dailylogs/${id}`, logData);
 *   },
 * 
 *   async deleteLog(id: string): Promise<void> {
 *     return apiClient.delete<void>(`/dailylogs/${id}`);
 *   },
 * 
 *   async searchLogs(filters: SearchFilters): Promise<DailyLog[]> {
 *     return apiClient.post<DailyLog[]>('/dailylogs/search', filters);
 *   },
 * };
 */
