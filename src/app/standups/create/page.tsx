'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import StandupForm from '@/components/forms/StandupForm';

export default function CreateStandupPage() {
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
      router.push('/standups');
    }, 1500);
  };

  const handleSubmitError = (message: string) => {
    setError(message);
    setIsLoading(false);
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
                  Create
                </li>
              </ol>
            </nav>
            <h1 className="heading-1">Create Standup ✏️</h1>
            <p className="text-secondary">Document your daily standup discussion, plans, and blockers</p>
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
                <strong>Success!</strong> Your standup has been created. Redirecting...
              </div>
            )}

            <StandupForm
              isLoading={isLoading}
              onSubmitting={handleSubmitStart}
              onSuccess={handleSubmitSuccess}
              onError={handleSubmitError}
            />

            <div className="card border-info mb-4">
              <div className="card-body">
                <h6 className="card-title text-info">💡 Tips for Effective Standups</h6>
                <ul className="mb-0 text-small">
                  <li>Be specific about what you accomplished yesterday</li>
                  <li>Clearly state what you plan to do today</li>
                  <li>Document any blockers as soon as they arise</li>
                  <li>Set realistic targets that can be completed in a day</li>
                  <li>Add notes for follow-ups or additional context</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
