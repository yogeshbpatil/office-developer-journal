import { Suspense } from 'react';
import LoginPageClient from './LoginPageClient';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-container">
          <div className="auth-card">
            <div className="d-flex justify-content-center align-items-center py-4">
              <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
              <span className="ms-2 text-muted">Loading...</span>
            </div>
          </div>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
