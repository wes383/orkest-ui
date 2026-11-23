'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';

import { CopyButton } from '../examples/copy-button';

const managers = ['pnpm', 'npm', 'yarn', 'bun'] as const;

type PackageManager = (typeof managers)[number];

const commands: Record<PackageManager, string> = {
  pnpm: 'pnpm add @orkest/ui',
  npm: 'npm install @orkest/ui',
  yarn: 'yarn add @orkest/ui',
  bun: 'bun add @orkest/ui',
};

export function InstallCommand() {
  const [manager, setManager] = useState<PackageManager>('pnpm');
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = useId();

  function select(index: number) {
    const next = managers[index];

    if (!next) {
      return;
    }

    setManager(next);
    tabs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % managers.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + managers.length) % managers.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = managers.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    select(next);
  }

  return (
    <div className="install-block">
      <div className="install-tabs" role="tablist" aria-label="Package manager">
        {managers.map((item, index) => (
          <button
            key={item}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${panelId}-${item}`}
            aria-selected={manager === item}
            aria-controls={panelId}
            tabIndex={manager === item ? 0 : -1}
            className="install-tab"
            onClick={() => setManager(item)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item}
          </button>
        ))}
      </div>
      <CopyButton key={manager} code={commands[manager]} />
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${panelId}-${manager}`}
        className="install-command"
        tabIndex={0}
      >
        <pre>
          <code>{commands[manager]}</code>
        </pre>
      </div>
    </div>
  );
}
