'use client';

import { Icon, Kbd } from '@orkest/ui';
import {
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@orkest/ui/client';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { SearchIndexItem } from '@/lib/docs-types';
import { searchDocs } from '@/lib/search';

export function SearchDialog({ index }: { index: SearchIndexItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const results = searchDocs(index, query);

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setQuery('');
    }
  }

  function handleSelect(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <Icon icon={Search} size="sm" />
        <span className="search-label">Search docs</span>
        <span className="search-shortcut">
          <Kbd size="sm">Ctrl</Kbd>
          <Kbd size="sm">K</Kbd>
        </span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search documentation"
        description="Search page titles, headings, and content."
        shouldFilter={false}
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search documentation..."
          aria-label="Search documentation"
        />
        <CommandList>
          {query.trim() === '' ? (
            <CommandEmpty>
              Search page titles, headings, and content. Press <Kbd size="sm">Esc</Kbd> to close.
            </CommandEmpty>
          ) : results.length === 0 ? (
            <CommandEmpty>No results for “{query}”.</CommandEmpty>
          ) : (
            <CommandGroup heading={`${results.length} result${results.length === 1 ? '' : 's'}`}>
              {results.map((result) => (
                <CommandItem key={result.href} value={result.href} onSelect={handleSelect}>
                  <span className="search-result">
                    <span className="search-result-heading">
                      {result.title}
                      <span className="search-result-section">{result.sectionLabel}</span>
                    </span>
                    <span className="search-result-description">{result.description}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        <CommandFooter>
          <span>
            <Kbd size="sm">↑</Kbd>
            <Kbd size="sm">↓</Kbd> navigate
          </span>
          <span>
            <Kbd size="sm">Enter</Kbd> open
          </span>
          <span>
            <Kbd size="sm">Esc</Kbd> close
          </span>
        </CommandFooter>
      </CommandDialog>
    </>
  );
}
