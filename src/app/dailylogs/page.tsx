'use client';

import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import DailyLogCard from '@/components/ui/DailyLogCard';
import { dailyLogService } from '@/services/dailylog-service';
import { DailyLog, SearchFilters } from '@/models/DailyLog';

export default function DailyLogsPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: '',
    dateFrom: '',
    dateTo: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchedLogs = await dailyLogService.getAllLogs();
        setLogs(fetchedLogs);
        setFilteredLogs(fetchedLogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    setError('');

    try {
      const results = await dailyLogService.searchLogs(searchFilters);
      setFilteredLogs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchFilters({
      keyword: '',
      dateFrom: '',
      dateTo: '',
    });
    setFilteredLogs(logs);
    setShowFilters(false);
  };

  const hasActiveFilters = searchFilters.keyword || searchFilters.dateFrom || searchFilters.dateTo;

  return (
    <ProtectedLayout>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="heading-1">Daily Logs 📋</h1>
            <p className="text-secondary">View all your developer journal entries</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search logs by keyword..."
                    value={searchFilters.keyword}
                    onChange={(e) =>
                      setSearchFilters({ ...searchFilters, keyword: e.target.value })
                    }
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    🔍 {showFilters ? 'Hide' : 'Show'} Filters
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </button>
                  {hasActiveFilters && (
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <>
                  <div className="col-md-6">
                    <label htmlFor="dateFrom" className="form-label fw-semibold">
                      Date From
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateFrom"
                      value={searchFilters.dateFrom}
                      onChange={(e) =>
                        setSearchFilters({ ...searchFilters, dateFrom: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dateTo" className="form-label fw-semibold">
                      Date To
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateTo"
                      value={searchFilters.dateTo}
                      onChange={(e) =>
                        setSearchFilters({ ...searchFilters, dateTo: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            {hasActiveFilters && (
              <div className="mt-3">
                <small className="text-muted">
                  Active filters: 
                  {searchFilters.keyword && <span className="badge bg-secondary ms-2">Keyword: {searchFilters.keyword}</span>}
                  {searchFilters.dateFrom && <span className="badge bg-secondary ms-2">From: {searchFilters.dateFrom}</span>}
                  {searchFilters.dateTo && <span className="badge bg-secondary ms-2">To: {searchFilters.dateTo}</span>}
                </small>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading logs...</span>
            </div>
            <p className="text-muted mt-3">Loading your logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-text">
              {hasActiveFilters ? 'No logs found matching your search' : 'No logs found'}
            </h3>
            <p className="text-muted">
              {hasActiveFilters
                ? 'Try adjusting your search filters or clearing them to see all logs.'
                : "You haven't created any daily logs yet. Start documenting your journey!"}
            </p>
            {hasActiveFilters ? (
              <button onClick={handleClearSearch} className="btn btn-primary mt-3">
                Clear Filters
              </button>
            ) : (
              <a href="/dailylogs/create" className="btn btn-primary mt-3">
                Create Your First Log
              </a>
            )}
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted mb-0">
                  Showing <strong>{filteredLogs.length}</strong> log{filteredLogs.length !== 1 ? 's' : ''}
                  {hasActiveFilters && logs.length !== filteredLogs.length && (
                    <span> (filtered from {logs.length} total)</span>
                  )}
                </p>
                <a href="/dailylogs/create" className="btn btn-primary btn-sm">
                  ➕ Create New Log
                </a>
              </div>

              {filteredLogs.map((log) => (
                <DailyLogCard key={log.id} log={log} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
