'use client';

import { Alert, AlertDescription, AlertTitle } from '@orkest/ui/client';
import { CircleAlert, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

// The callout vocabulary maps onto alert tones: notes and tips are informational, warnings
// and important notices carry the louder treatments.
const calloutTypes = {
  note: { label: 'Note', variant: 'info', icon: Info },
  tip: { label: 'Tip', variant: 'success', icon: Lightbulb },
  warning: { label: 'Warning', variant: 'warning', icon: TriangleAlert },
  important: { label: 'Important', variant: 'error', icon: CircleAlert },
} as const;

export type CalloutType = keyof typeof calloutTypes;

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const config = calloutTypes[type];

  return (
    <Alert variant={config.variant} icon={config.icon} className="callout">
      <AlertTitle>{title ?? config.label}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
