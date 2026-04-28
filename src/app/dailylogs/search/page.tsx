'use client';

import { useState, FormEvent } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import DailyLogCard from '@/components/ui/DailyLogCard';
import { dailyLogService } from '@/services/dailylog-service';
import { DailyLog, SearchFilters } from '@/models/DailyLog';

export default function SearchDailyLogsPage() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: '',
    dateFrom: '',
    dateTo: '',
  });
  const [results, setResults] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await dailyLogService.searchLogs(searchFilters);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchFilters({
      keyword: '',
      dateFrom: '',
      dateTo: '',
    });
    setResults([]);
    setHasSearched(false);
    setError('');
  };

  return (
    <ProtectedLayout>
      <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9f0', minHeight: '100vh' }}>
        <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/dailylogs">Daily Logs</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Search
                </li>
              </ol>
            </nav>
            <h1
              className="heading-1"
              style={{ fontSize: '2.25rem', lineHeight: 1.1, marginBottom: '0.25rem' }}
            >
              Search Logs 🔍
            </h1>
            <p className="text-secondary mb-0">Find specific entries by keyword or date range</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-xl-3 mb-4">
            <div className="card form-section">
              <form onSubmit={handleSearch}>
                <h5 className="heading-4 mb-3">Search Filters</h5>

                {/* Keyword Search */}
                <div className="mb-3">
                  <label htmlFor="keyword" className="form-label">
                    Keyword
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="keyword"
                    placeholder="Search in all fields..."
                    value={searchFilters.keyword}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({ ...prev, keyword: e.target.value }))
                    }
                  />
                  <div className="form-text">
                    Search across tasks, problems, solutions, learnings, and tips
                  </div>
                </div>

                {/* Date Range */}
                <div className="mb-3">
                  <label htmlFor="dateFrom" className="form-label">
                    Date From
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateFrom"
                    value={searchFilters.dateFrom}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="dateTo" className="form-label">
                    Date To
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateTo"
                    value={searchFilters.dateTo}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                    }
                  />
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Searching...
                      </>
                    ) : (
                      '🔍 Search'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClear}
                    disabled={isLoading}
                  >
                    Clear Filters
                  </button>
                </div>
              </form>
            </div>

            {/* Search Tips */}
            <div className="card border-info mt-3">
              <div className="card-body">
                <h6 className="card-title text-info">💡 Search Tips</h6>
                <ul className="mb-0 text-small">
                  <li>Use specific keywords for better results</li>
                  <li>Date filters help narrow down entries</li>
                  <li>Search is case-insensitive</li>
                  <li>Leave fields empty to show all logs</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-xl-9">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
                <p className="text-muted mt-3">Searching your logs...</p>
              </div>
            ) : hasSearched ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    {results.length === 0
                      ? 'No results found'
                      : `Found ${results.length} log${results.length !== 1 ? 's' : ''}`}
                  </h5>
                </div>

                {results.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3 className="empty-state-text">No matching logs</h3>
                    <p className="text-muted">
                      Try adjusting your search filters or keywords
                    </p>
                  </div>
                ) : (
                  results.map((log) => <DailyLogCard key={log.id} log={log} />)
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-text">Start Searching</h3>
                <p className="text-muted">
                  Use the filters on the left to search through your daily logs
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
