import { Icon } from '@orkest/ui';
import { CircleAlert, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

const calloutTypes = {
  note: { label: 'Note', icon: Info },
  tip: { label: 'Tip', icon: Lightbulb },
  warning: { label: 'Warning', icon: TriangleAlert },
  important: { label: 'Important', icon: CircleAlert },
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
    <div className={`callout callout-${type}`}>
      <span className="callout-icon">
        <Icon icon={config.icon} size="sm" />
      </span>
      <div className="callout-content">
        <p className="callout-title">{title ?? config.label}</p>
        <div className="callout-body">{children}</div>
      </div>
    </div>
  );
}
