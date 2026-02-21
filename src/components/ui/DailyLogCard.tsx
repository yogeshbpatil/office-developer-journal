'use client';

import { DailyLog } from '@/models/DailyLog';

interface DailyLogCardProps {
  log: DailyLog;
}

export default function DailyLogCard({ log }: DailyLogCardProps) {
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
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-1">{formatDate(log.logDate)}</h5>
            <small className="text-muted">
              Created: {new Date(log.createdAt).toLocaleDateString()}
            </small>
          </div>
          <span className="badge bg-primary">Log #{log.id}</span>
        </div>

        <div className="mb-3">
          <h6 className="text-success mb-2">✅ Tasks Worked</h6>
          <p className="text-body mb-0">{log.tasksWorked}</p>
        </div>

        <div className="mb-3">
          <h6 className="text-danger mb-2">⚠️ Problems Faced</h6>
          <p className="text-body mb-0">{log.problemsFaced}</p>
        </div>

        <div className="mb-3">
          <h6 className="text-info mb-2">💡 Solutions</h6>
          <p className="text-body mb-0">{log.solutions}</p>
        </div>

        <div className="mb-3">
          <h6 className="text-warning mb-2">📚 Learnings</h6>
          <p className="text-body mb-0">{log.learnings}</p>
        </div>

        {log.tips && (
          <div className="mb-3">
            <h6 className="text-secondary mb-2">💭 Tips & Best Practices</h6>
            <p className="text-body mb-0">{log.tips}</p>
          </div>
        )}

        {log.gitLink && (
          <div className="mb-0">
            <h6 className="text-primary mb-2">🔗 Git Link</h6>
            <a 
              href={log.gitLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              {log.gitLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
