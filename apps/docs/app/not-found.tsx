import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="status-page">
      <p className="status-code">404</p>
      <h1 className="status-title">This page does not exist.</h1>
      <p className="status-description">
        The documentation may have moved, or the URL may be incomplete.
      </p>
      <div className="status-actions">
        <Link className="button-link" href="/docs/">
          Browse documentation
        </Link>
        <Link className="button-link button-link-secondary" href="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
