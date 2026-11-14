export default function DocLoading() {
  return (
    <div className="doc-skeleton" role="status">
      <span className="sr-only">Loading documentation</span>
      <div className="skeleton skeleton-line skeleton-line-short" aria-hidden="true" />
      <div className="skeleton skeleton-line skeleton-line-title" aria-hidden="true" />
      <div className="skeleton skeleton-line skeleton-line-description" aria-hidden="true" />
      <div className="skeleton skeleton-block" aria-hidden="true" />
      <div className="skeleton skeleton-line" aria-hidden="true" />
      <div className="skeleton skeleton-line" aria-hidden="true" />
      <div className="skeleton skeleton-line skeleton-line-short" aria-hidden="true" />
    </div>
  );
}
