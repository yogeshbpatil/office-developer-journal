'use client';

import { useState, FormEvent } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import StandupCard from '@/components/ui/StandupCard';
import { standupService } from '@/services/standup-service';
import { Standup, SearchFilters } from '@/models/Standup';

export default function SearchStandupsPage() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: '',
    dateFrom: '',
    dateTo: '',
  });
  const [results, setResults] = useState<Standup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await standupService.searchStandups(searchFilters);
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
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/standups">Standups</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Search
                </li>
              </ol>
            </nav>
            <h1 className="heading-1">Search Standups 🔍</h1>
            <p className="text-secondary">Find specific standup entries by keyword or date range</p>
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
                    Search across discussion points, today's plan, blockers, targets, and notes
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

                {/* Search Buttons */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClear}
                    disabled={isLoading}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Search Results */}
          <div className="col-lg-8 col-xl-9">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError('')}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {!hasSearched ? (
              <div className="text-center py-5">
                <p className="text-muted">Enter search criteria and click Search to find standups</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No standups found matching your criteria</p>
              </div>
            ) : (
              <>
                <p className="text-muted mb-3">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                {results.map((standup) => (
                  <StandupCard key={standup.id} standup={standup} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
