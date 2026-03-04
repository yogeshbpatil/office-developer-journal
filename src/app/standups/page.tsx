'use client';

import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import StandupForm from '@/components/forms/StandupForm';
import StandupCard from '@/components/ui/StandupCard';
import { standupService } from '@/services/standup-service';
import { Standup, SearchFilters } from '@/models/Standup';

export default function StandupsPage() {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [filteredStandups, setFilteredStandups] = useState<Standup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [standupToDelete, setStandupToDelete] = useState<Standup | null>(null);
  const [standupToEdit, setStandupToEdit] = useState<Standup | null>(null);
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: '',
    dateFrom: '',
    dateTo: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchStandups = async () => {
      try {
        const fetchedStandups = await standupService.getAllStandups();
        setStandups(fetchedStandups);
        setFilteredStandups(fetchedStandups);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch standups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandups();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    setError('');

    try {
      const results = await standupService.searchStandups(searchFilters);
      setFilteredStandups(results);
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
    setFilteredStandups(standups);
    setShowFilters(false);
  };

  const handleOpenDeleteDialog = (standup: Standup) => {
    setError('');
    setStandupToDelete(standup);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setStandupToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!standupToDelete) return;

    setError('');
    setIsDeleting(true);
    try {
      await standupService.deleteStandup(standupToDelete.id);
      setStandups((prev) => prev.filter((s) => s.id !== standupToDelete.id));
      setFilteredStandups((prev) => prev.filter((s) => s.id !== standupToDelete.id));
      setStandupToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete standup');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setStandupToEdit(null);
    // Refresh standups
    standupService.getAllStandups().then((data) => {
      setStandups(data);
      setFilteredStandups(data);
    });
  };

  const handleEditError = (message: string) => {
    setError(message);
  };

  return (
    <ProtectedLayout>
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="heading-1">Daily Standups 📋</h1>
            <p className="text-secondary">Track your daily standup discussions, plans, and blockers</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-info">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <h5 className="heading-4 mb-0">Search Standups</h5>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>

                <div className="row g-3">
                  {/* Keyword Search */}
                  <div className="col-12">
                    <label htmlFor="keyword" className="form-label">
                      Keyword Search
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                    <div className="form-text">
                      Search across discussion points, today's plan, blockers, targets, and notes
                    </div>
                  </div>

                  {/* Date Range - Shown when filters expanded */}
                  {showFilters && (
                    <>
                      <div className="col-md-6">
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
                      <div className="col-md-6">
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
                    </>
                  )}

                  {/* Search Buttons */}
                  <div className="col-12">
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-primary"
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
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleClearSearch}
                        disabled={isSearching}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading standups...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="row mb-3">
              <div className="col-12">
                <p className="text-muted mb-0">
                  Showing {filteredStandups.length} of {standups.length} standup{standups.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Standup Cards */}
            {filteredStandups.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No standups found. Create your first standup!</p>
                <a href="/standups/create" className="btn btn-primary">
                  Create Standup
                </a>
              </div>
            ) : (
              <div className="row">
                <div className="col-12">
                  {filteredStandups.map((standup) => (
                    <StandupCard
                      key={standup.id}
                      standup={standup}
                      onEditClick={setStandupToEdit}
                      onDeleteClick={handleOpenDeleteDialog}
                      isEditing={isUpdating}
                      isDeleting={isDeleting}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit Modal */}
        {standupToEdit && (
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Standup</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setStandupToEdit(null)}
                    disabled={isUpdating}
                  ></button>
                </div>
                <div className="modal-body">
                  <StandupForm
                    initialData={standupToEdit}
                    mode="edit"
                    standupId={standupToEdit.id}
                    isLoading={isUpdating}
                    onSubmitting={() => {
                      setError('');
                      setIsUpdating(true);
                    }}
                    onSuccess={handleEditSuccess}
                    onError={handleEditError}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {standupToDelete && (
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete the standup from {standupToDelete.standupDate}?</p>
                  <p className="text-muted">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
