'use client';

import { ToastProvider, ToastViewport } from '@orkest/ui/client';

export function ToastHost() {
  return (
    <ToastProvider>
      <ToastViewport position="top-right" />
    </ToastProvider>
  );
}
