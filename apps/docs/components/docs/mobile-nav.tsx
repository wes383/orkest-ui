'use client';

import { IconButton } from '@orkest/ui';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

import type { NavGroup } from '@/lib/docs-types';

import { DocsNav } from './docs-nav';
import { useScrollOverflow } from './use-scroll-overflow';

export function MobileNav({ navigation }: { navigation: NavGroup[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const {
    ref: scrollRef,
    overflowing,
    atTop,
    atBottom,
  } = useScrollOverflow<HTMLDivElement>(navigation);
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
      <IconButton
        className="mobile-menu"
        icon={Menu}
        label="Open documentation navigation"
        variant="ghost"
        size="sm"
        onClick={open}
      />
      {/* Native dialog backdrops only receive pointer events on the dialog element itself. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        className="mobile-nav-dialog"
        aria-label="Documentation navigation"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            close();
          }
        }}
      >
        <div className="mobile-nav-header">
          <IconButton
            icon={X}
            label="Close documentation navigation"
            variant="ghost"
            size="sm"
            onClick={close}
          />
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
