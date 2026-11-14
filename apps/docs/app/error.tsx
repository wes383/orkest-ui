'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="status-page">
      <p className="status-code">Error</p>
      <h1 className="status-title">Something went wrong.</h1>
      <p className="status-description">
        The page could not be rendered. Try again, or return to the documentation index.
      </p>
      <div className="status-actions">
        <button type="button" className="button-link" onClick={reset}>
          Try again
        </button>
        <a className="button-link button-link-secondary" href="/docs/">
          Browse documentation
        </a>
      </div>
    </div>
  );
}
