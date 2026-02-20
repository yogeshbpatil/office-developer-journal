'use client';

import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import DailyLogCard from '@/components/ui/DailyLogCard';
import { dailyLogService } from '@/services/dailylog-service';
import { DailyLog } from '@/models/DailyLog';

export default function DailyLogsPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchedLogs = await dailyLogService.getAllLogs();
        setLogs(fetchedLogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <ProtectedLayout>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="heading-1">Daily Logs 📋</h1>
            <p className="text-secondary">View all your developer journal entries</p>
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
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-text">No logs found</h3>
            <p className="text-muted">You haven't created any daily logs yet. Start documenting your journey!</p>
            <a href="/dailylogs/create" className="btn btn-primary mt-3">
              Create Your First Log
            </a>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted mb-0">
                  Showing <strong>{logs.length}</strong> log{logs.length !== 1 ? 's' : ''}
                </p>
                <a href="/dailylogs/create" className="btn btn-primary btn-sm">
                  ➕ Create New Log
                </a>
              </div>

              {logs.map((log) => (
                <DailyLogCard key={log.id} log={log} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
