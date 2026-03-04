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

  const getStandupDisplayName = (standup: Standup): string => {
    const title = standup.todayPlan?.trim();
    if (title) {
      return title.length > 50 ? `${title.slice(0, 50)}...` : title;
    }
    return standup.standupDate;
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

  const handleOpenEditDialog = (standup: Standup) => {
    setError('');
    setStandupToEdit(standup);
  };

  const handleCancelEdit = () => {
    if (isUpdating) return;
    setStandupToEdit(null);
  };

  const handleEditSubmitting = () => {
    setError('');
    setIsUpdating(true);
  };

  const handleEditSuccess = (updatedStandup: Standup) => {
    setStandups((prev) => prev.map((s) => (s.id === updatedStandup.id ? updatedStandup : s)));
    setFilteredStandups((prev) => prev.map((s) => (s.id === updatedStandup.id ? updatedStandup : s)));
    setStandupToEdit(null);
    setIsUpdating(false);
  };

  const handleEditError = (message: string) => {
    setError(message);
    setIsUpdating(false);
  };

  const hasActiveFilters = searchFilters.keyword || searchFilters.dateFrom || searchFilters.dateTo;

  return (
    <ProtectedLayout>
      <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9f0', minHeight: '100vh' }}>
        <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="heading-1">Daily Standups 📋</h1>
            <p className="text-secondary">View all your standup entries</p>
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
                    placeholder="Search standups by keyword..."
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
              <span className="visually-hidden">Loading standups...</span>
            </div>
            <p className="text-muted mt-3">Loading your standups...</p>
          </div>
        ) : filteredStandups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-text">
              {hasActiveFilters ? 'No standups found matching your search' : 'No standups found'}
            </h3>
            <p className="text-muted">
              {hasActiveFilters
                ? 'Try adjusting your search filters or clearing them to see all standups.'
                : "You haven't created any standups yet. Start documenting your daily standups!"}
            </p>
            {hasActiveFilters ? (
              <button onClick={handleClearSearch} className="btn btn-primary mt-3">
                Clear Filters
              </button>
            ) : (
              <a href="/standups/create" className="btn btn-primary mt-3">
                Create Your First Standup
              </a>
            )}
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted mb-0">
                  Showing <strong>{filteredStandups.length}</strong> standup{filteredStandups.length !== 1 ? 's' : ''}
                  {hasActiveFilters && standups.length !== filteredStandups.length && (
                    <span> (filtered from {standups.length} total)</span>
                  )}
                </p>
                <a href="/standups/create" className="btn btn-primary btn-sm">
                  ➕ Create New Standup
                </a>
              </div>

              {filteredStandups.map((standup) => (
                <StandupCard
                  key={standup.id}
                  standup={standup}
                  onEditClick={handleOpenEditDialog}
                  onDeleteClick={handleOpenDeleteDialog}
                  isEditing={isUpdating && standupToEdit?.id === standup.id}
                  isDeleting={isDeleting && standupToDelete?.id === standup.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

      {standupToDelete && (
        <>
          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Standup</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Do you really want to delete the standup from <strong>{getStandupDisplayName(standupToDelete)}</strong>?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {standupToEdit && (
        <>
          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Standup</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  ></button>
                </div>
                <div className="modal-body">
                  <StandupForm
                    mode="edit"
                    standupId={standupToEdit.id}
                    initialData={{
                      standupDate: standupToEdit.standupDate,
                      discussionPoints: standupToEdit.discussionPoints,
                      todayPlan: standupToEdit.todayPlan,
                      blockers: standupToEdit.blockers,
                      targets: standupToEdit.targets,
                      notes: standupToEdit.notes || '',
                    }}
                    isLoading={isUpdating}
                    onSubmitting={handleEditSubmitting}
                    onSuccess={handleEditSuccess}
                    onError={handleEditError}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </ProtectedLayout>
  );
}
