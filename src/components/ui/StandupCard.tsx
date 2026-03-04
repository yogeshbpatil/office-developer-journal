'use client';

import { Standup } from '@/models/Standup';

interface StandupCardProps {
  standup: Standup;
  onEditClick?: (standup: Standup) => void;
  onDeleteClick?: (standup: Standup) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
}

export default function StandupCard({
  standup,
  onEditClick,
  onDeleteClick,
  isEditing = false,
  isDeleting = false,
}: StandupCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="card card-elevated mb-3 border-left-primary">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
          <div>
            <h5 className="card-title mb-1">{formatDate(standup.standupDate)}</h5>
            <small className="text-muted">
              Created: {new Date(standup.createdAt).toLocaleDateString()}
            </small>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-primary">Standup #{standup.id}</span>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEditClick?.(standup)}
              disabled={isEditing || isDeleting}
            >
              {isEditing ? 'Editing...' : 'Edit'}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDeleteClick?.(standup)}
              disabled={isDeleting || isEditing}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <h6 className="text-primary mb-2">💬 Discussion Points</h6>
          <p className="text-body mb-0 whitespace-pre-line">{standup.discussionPoints}</p>
        </div>

        <div className="mb-3">
          <h6 className="text-success mb-2">📋 Today's Plan</h6>
          <p className="text-body mb-0 whitespace-pre-line">{standup.todayPlan}</p>
        </div>

        <div className="mb-3">
          <h6 className="text-danger mb-2">🚫 Blockers</h6>
          <p className="text-body mb-0 whitespace-pre-line">{standup.blockers || 'No blockers'}</p>
        </div>

        <div className="mb-3">
          <h6 className="text-warning mb-2">🎯 Targets</h6>
          <p className="text-body mb-0 whitespace-pre-line">{standup.targets}</p>
        </div>

        {standup.notes && (
          <div className="mb-0">
            <h6 className="text-secondary mb-2">📝 Notes</h6>
            <p className="text-body mb-0 whitespace-pre-line">{standup.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
