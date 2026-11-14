'use client';

import { Icon } from '@orkest/ui';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

import type { NavGroup } from '@/lib/docs-types';

import { DocsNav } from './docs-nav';
import { useScrollOverflow } from './use-scroll-overflow';

export function MobileNav({ navigation }: { navigation: NavGroup[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const { ref: scrollRef, overflowing, atTop, atBottom } = useScrollOverflow<HTMLDivElement>(
    navigation,
  );
  const bodyClassName = [
    'mobile-nav-body',
    overflowing && !atTop ? 'mobile-nav-fade-top' : '',
    overflowing && !atBottom ? 'mobile-nav-fade-bottom' : '',
  ]
    .filter(Boolean)
    .join(' ');

  function open() {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        className="icon-button mobile-menu"
        onClick={open}
        aria-label="Open documentation navigation"
      >
        <Icon icon={Menu} size="sm" />
      </button>
      <dialog
        ref={dialogRef}
        className="mobile-nav-dialog"
        aria-labelledby="mobile-nav-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            close();
          }
        }}
      >
        <div className="mobile-nav-header">
          <h2 className="mobile-nav-title" id="mobile-nav-title">
            Documentation
          </h2>
          <button
            type="button"
            className="icon-button"
            onClick={close}
            aria-label="Close documentation navigation"
          >
            <Icon icon={X} size="sm" />
          </button>
        </div>
        <div className={bodyClassName}>
          <div ref={scrollRef} className="mobile-nav-scroll">
            <DocsNav navigation={navigation} activePath={pathname} onNavigate={close} />
          </div>
        </div>
      </dialog>
    </>
  );
}
