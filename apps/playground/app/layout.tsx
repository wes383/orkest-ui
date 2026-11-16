import type { Metadata } from 'next';

import '@orkest/ui/style.css';
import './globals.css';

import { ToastHost } from './toast-host';

export const metadata: Metadata = {
  title: 'Orkest UI playground',
  description: 'Consumer app validating the built @orkest/ui package in Next.js App Router.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
