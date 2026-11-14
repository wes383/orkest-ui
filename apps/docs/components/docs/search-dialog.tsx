'use client';

import { Icon } from '@orkest/ui';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import type { SearchIndexItem } from '@/lib/docs-types';
import { searchDocs } from '@/lib/search';

export function SearchDialog({ index }: { index: SearchIndexItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const results = searchDocs(index, query);

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openDialog();
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  function openDialog() {
    if (dialogRef.current?.open) {
      inputRef.current?.focus();
      return;
    }

    dialogRef.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      resultsRef.current?.querySelector<HTMLAnchorElement>('a[data-search-result]')?.focus();
    }
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
    }
  }

  function handleResultsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    const links = Array.from(
      event.currentTarget.querySelectorAll<HTMLAnchorElement>('a[data-search-result]'),
    );
    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);

    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();

    if (event.key === 'ArrowUp' && currentIndex === 0) {
      inputRef.current?.focus();
      return;
    }

    const nextIndex =
      event.key === 'ArrowDown'
        ? Math.min(currentIndex + 1, links.length - 1)
        : Math.max(currentIndex - 1, 0);

    links[nextIndex]?.focus();
  }

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={openDialog}
        aria-label="Search documentation"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <Icon icon={Search} size="sm" />
        <span className="search-label">Search docs</span>
        <kbd className="search-shortcut">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-labelledby="search-dialog-title"
        onClose={() => setQuery('')}
        onKeyDown={handleDialogKeyDown}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeDialog();
          }
        }}
      >
        <div className="search-dialog-inner">
          <div className="search-dialog-header">
            <Icon icon={Search} size="sm" />
            <h2 className="sr-only" id="search-dialog-title">
              Search documentation
            </h2>
            <input
              ref={inputRef}
              className="search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search documentation..."
              aria-label="Search documentation"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="icon-button"
              onClick={closeDialog}
              aria-label="Close search"
            >
              <Icon icon={X} size="sm" />
            </button>
          </div>

          <div className="search-body" onKeyDown={handleResultsKeyDown}>
            {query.trim() === '' ? (
              <p className="search-empty">
                Search page titles, headings, and content. Press <kbd>Esc</kbd> to close.
              </p>
            ) : null}

            {query.trim() !== '' && results.length === 0 ? (
              <p className="search-empty" role="status">
                No results for “{query}”.
              </p>
            ) : null}

            {results.length > 0 ? (
              <div ref={resultsRef}>
                <p className="sr-only" role="status">
                  {results.length} results
                </p>
                <ul className="search-results">
                  {results.map((result) => (
                    <li key={result.href}>
                      <Link
                        href={result.href}
                        className="search-result-link"
                        data-search-result
                        onClick={closeDialog}
                      >
                        <span className="search-result-section">{result.sectionLabel}</span>
                        <span className="search-result-title">{result.title}</span>
                        <span className="search-result-description">{result.description}</span>
                        <span className="search-result-excerpt">{result.excerpt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="search-footer">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>Enter</kbd> open
            </span>
            <span>
              <kbd>Esc</kbd> close
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}
