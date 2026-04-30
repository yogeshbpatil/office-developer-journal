'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { dailyLogService } from '@/services/dailylog-service';
import { DailyLog } from '@/models/DailyLog';
import { getCurrentUser } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.name);
    }

    const fetchRecentLogs = async () => {
      try {
        const logs = await dailyLogService.getAllLogs();
        setRecentLogs(logs.slice(0, 5)); // Get latest 5 logs
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentLogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ProtectedLayout>
      <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9f0', minHeight: '100vh' }}>
        <div className="container">
        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="heading-1">Welcome back, {userName}! 👋</h1>
            <p className="text-secondary">Here's an overview of your developer journal</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card card-elevated">
              <div className="card-body d-flex align-items-center">
                <div className="me-3">
                  <div className="fs-4 text-primary">📊</div>
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Total Logs</h6>
                  <h3 className="mb-0">{isLoading ? '...' : recentLogs.length}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-elevated">
              <div className="card-body d-flex align-items-center">
                <div className="me-3">
                  <div className="fs-4 text-success">✅</div>
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Tasks Completed</h6>
                  <h3 className="mb-0">{isLoading ? '...' : recentLogs.length}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-elevated">
              <div className="card-body d-flex align-items-center">
                <div className="me-3">
                  <div className="fs-4 text-warning">💡</div>
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Learnings</h6>
                  <h3 className="mb-0">{isLoading ? '...' : recentLogs.length}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-elevated">
              <div className="card-body d-flex align-items-center">
                <div className="me-3">
                  <div className="fs-4 text-info">🔍</div>
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Solutions Found</h6>
                  <h3 className="mb-0">{isLoading ? '...' : recentLogs.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-title">Quick Actions</h2>
            <div className="row g-3">
              <div className="col-md-4">
                <button
                  onClick={() => router.push('/dailylogs/create')}
                  className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <span className="fs-4">➕</span>
                  Create New Log
                </button>
              </div>
              <div className="col-md-4">
                <button
                  onClick={() => router.push('/dailylogs')}
                  className="btn btn-outline-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <span className="fs-4">📋</span>
                  View All Logs
                </button>
              </div>
              <div className="col-md-4">
                <button
                  onClick={() => router.push('/dailylogs/search')}
                  className="btn btn-outline-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <span className="fs-4">🔍</span>
                  Search Logs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="row">
          <div className="col-12">
            <h2 className="section-title">Recent Logs</h2>
            
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3 className="empty-state-text">No logs yet</h3>
                <p className="text-muted">Start documenting your development journey by creating your first log!</p>
                <button
                  onClick={() => router.push('/dailylogs/create')}
                  className="btn btn-primary mt-3"
                >
                  Create Your First Log
                </button>
              </div>
            ) : (
              <div className="list-group">
                {recentLogs.map((log) => (
                  <div key={log.id} className="list-group-item list-group-item-action border-left-primary">
                    <div className="d-flex w-100 justify-content-between align-items-start mb-2">
                      <h5 className="mb-1">{formatDate(log.logDate)}</h5>
                      <small className="text-muted">{formatDate(log.createdAt)}</small>
                    </div>
                    <p className="mb-1 text-truncate-2">{log.tasksWorked}</p>
                    <small className="text-muted">
                      Problems: {log.problemsFaced.substring(0, 80)}...
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
