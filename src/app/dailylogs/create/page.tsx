'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import DailyLogForm from '@/components/forms/DailyLogForm';

export default function CreateDailyLogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmitStart = () => {
    setError('');
    setSuccess(false);
    setIsLoading(true);
  };

  const handleSubmitSuccess = () => {
    setSuccess(true);
    setIsLoading(false);

    // Show success message and redirect after a short delay
    setTimeout(() => {
      router.push('/dailylogs');
    }, 1500);
  };

  const handleSubmitError = (message: string) => {
    setError(message);
    setIsLoading(false);
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
                    Create
                  </li>
                </ol>
              </nav>
              <h1
                className="heading-1"
                style={{ fontSize: '2.25rem', lineHeight: 1.1, marginBottom: '0.25rem' }}
              >
                Create Daily Log ✏️
              </h1>
              <p className="text-secondary mb-0">Document your daily development activities, challenges, and learnings</p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10 col-xl-8">
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

              {success && (
                <div className="alert alert-success" role="alert">
                  <strong>Success!</strong> Your daily log has been created. Redirecting...
                </div>
              )}

              <DailyLogForm
                isLoading={isLoading}
                onSubmitting={handleSubmitStart}
                onSuccess={handleSubmitSuccess}
                onError={handleSubmitError}
              />

              <div className="card border-info mb-4">
                <div className="card-body">
                  <h6 className="card-title text-info">💡 Tips for Effective Logging</h6>
                  <ul className="mb-0 text-small">
                    <li>Be specific about the tasks you worked on</li>
                    <li>Document problems as soon as they occur for better recall</li>
                    <li>Include technical details in your solutions</li>
                    <li>Reflect on what you learned and how it applies to future work</li>
                    <li>Share practical tips that your future self (or teammates) might find useful</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

