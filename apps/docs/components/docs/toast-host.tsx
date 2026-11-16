'use client';

import { ToastProvider, ToastViewport } from '@orkest/ui/client';

export function ToastHost() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  );
}
