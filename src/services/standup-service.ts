import { Standup, CreateStandupDto, SearchFilters } from '@/models/Standup';

// Dummy data for demonstration - replace with actual API calls later
let standups: Standup[] = [
  {
    id: '1',
    standupDate: '2026-03-04',
    discussionPoints: 'Discussed the new feature requirements for user authentication.\nReviewed the API documentation.\nShared updates on the database migration progress.',
    todayPlan: 'Implement login functionality.\nCreate user registration endpoint.\nWrite unit tests for auth module.',
    blockers: 'Waiting for API keys from the DevOps team.\nDatabase connection issues on staging environment.',
    targets: 'Complete login feature by EOD.\nSubmit PR for user registration.',
    notes: 'Team meeting scheduled at 3 PM.',
    createdAt: '2026-03-04T08:00:00.000Z',
    updatedAt: '2026-03-04T08:00:00.000Z',
  },
  {
    id: '2',
    standupDate: '2026-03-03',
    discussionPoints: 'Reviewed sprint backlog.\nDiscussed bug prioritization.\nShared knowledge on React best practices.',
    todayPlan: 'Fix login validation bug.\nUpdate user profile page.\nReview pull requests.',
    blockers: 'None',
    targets: 'Complete bug fixes.\nMerge at least 2 PRs.',
    notes: '',
    createdAt: '2026-03-03T08:30:00.000Z',
    updatedAt: '2026-03-03T09:00:00.000Z',
  },
  {
    id: '3',
    standupDate: '2026-03-02',
    discussionPoints: 'Sprint planning session.\nDiscussed Q2 roadmap.\nReviewed performance metrics from last month.',
    todayPlan: 'Start working on dashboard analytics.\nSet up CI/CD pipeline.\nCode review for junior developers.',
    blockers: 'Need access to production logs.\nWaiting for design assets.',
    targets: 'Complete dashboard wireframes.\nDeploy staging build.',
    notes: 'Remember to update Jira tickets.',
    createdAt: '2026-03-02T07:45:00.000Z',
    updatedAt: '2026-03-02T08:15:00.000Z',
  },
];

let nextId = 4;

const sortByStandupDateDesc = (logs: Standup[]) =>
  [...logs].sort((a, b) => new Date(b.standupDate).getTime() - new Date(a.standupDate).getTime());

const applyClientFilters = (logs: Standup[], filters: SearchFilters): Standup[] => {
  let results = [...logs];

  if (filters.keyword?.trim()) {
    const keyword = filters.keyword.toLowerCase().trim();
    results = results.filter((log) => {
      return (
        log.discussionPoints.toLowerCase().includes(keyword) ||
        log.todayPlan.toLowerCase().includes(keyword) ||
        log.blockers.toLowerCase().includes(keyword) ||
        log.targets.toLowerCase().includes(keyword) ||
        (log.notes && log.notes.toLowerCase().includes(keyword)) ||
        log.standupDate.includes(keyword)
      );
    });
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    results = results.filter((log) => new Date(log.standupDate) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    results = results.filter((log) => new Date(log.standupDate) <= toDate);
  }

  return sortByStandupDateDesc(results);
};

export const standupService = {
  async getAllStandups(): Promise<Standup[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return sortByStandupDateDesc([...standups]);
  },

  async getStandupById(id: string): Promise<Standup> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const standup = standups.find((s) => s.id === id);
    if (!standup) {
      throw new Error('Standup not found');
    }
    return standup;
  },

  async createStandup(standupData: CreateStandupDto): Promise<Standup> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newStandup: Standup = {
      id: String(nextId++),
      ...standupData,
      notes: standupData.notes || '',
      createdAt: now,
      updatedAt: now,
    };
    
    standups.push(newStandup);
    return newStandup;
  },

  async updateStandup(id: string, standupData: Partial<CreateStandupDto>): Promise<Standup> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const index = standups.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Standup not found');
    }
    
    const updatedStandup: Standup = {
      ...standups[index],
      ...standupData,
      updatedAt: new Date().toISOString(),
    };
    
    standups[index] = updatedStandup;
    return updatedStandup;
  },

  async deleteStandup(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = standups.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Standup not found');
    }
    
    standups.splice(index, 1);
  },

  async searchStandups(filters: SearchFilters): Promise<Standup[]> {
    const allStandups = await this.getAllStandups();
    return applyClientFilters(allStandups, filters);
  },
};
