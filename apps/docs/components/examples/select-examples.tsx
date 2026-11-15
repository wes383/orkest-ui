'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';

import { Stack } from '@orkest/ui';
import { MultiSelect, Select, type SelectItem } from '@orkest/ui/client';

export { MultiSelect, Select } from '@orkest/ui/client';

const teamOptions: SelectItem[] = [
  {
    label: 'Product',
    options: [
      {
        value: 'design',
        label: 'Design',
        description: 'Product design and research',
        icon: Palette,
      },
      { value: 'product', label: 'Product', description: 'Planning and strategy' },
      { value: 'marketing', label: 'Marketing' },
    ],
  },
  {
    label: 'Engineering',
    options: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
      {
        value: 'platform',
        label: 'Platform',
        description: 'Not available on this plan',
        disabled: true,
      },
    ],
  },
];

export function BasicSelectExample() {
  return (
    <Select
      aria-label="Team"
      options={teamOptions}
      defaultValue="design"
      clearable
    />
  );
}

export function SearchableSelectExample() {
  return (
    <Select
      aria-label="Team"
      options={teamOptions}
      searchable
      searchPlaceholder="Search teams"
      placeholder="Choose a team"
    />
  );
}

export function SelectSizesExample() {
  return (
    <Stack gap={3}>
      <Select
        aria-label="Small team"
        size="sm"
        options={teamOptions}
        defaultValue="design"
      />
      <Select
        aria-label="Medium team"
        size="md"
        options={teamOptions}
        defaultValue="design"
      />
      <Select
        aria-label="Large team"
        size="lg"
        options={teamOptions}
        defaultValue="design"
      />
    </Stack>
  );
}

export function SelectStatesExample() {
  return (
    <Stack gap={3}>
      <Select
        aria-label="Disabled team"
        options={teamOptions}
        defaultValue="design"
        disabled
      />
      <Select
        aria-label="Invalid team"
        options={teamOptions}
        placeholder="Choose a team"
        invalid
      />
      <Select
        aria-label="Clearable team"
        options={teamOptions}
        defaultValue="product"
        clearable
      />
    </Stack>
  );
}

export function SelectLoadingExample() {
  return (
    <Select
      aria-label="Searching teams"
      options={[]}
      searchable
      loading
      searchPlaceholder="Search teams"
      emptyMessage="No teams matched"
    />
  );
}

export function MultiSelectExample() {
  const [selected, setSelected] = useState(['design', 'frontend']);

  return (
    <MultiSelect
      aria-label="Teams"
      options={teamOptions}
      value={selected}
      onChange={(nextValues) => setSelected(nextValues)}
      searchable
      hideSelected
      clearable
      maxSelected={3}
      placeholder="Select teams"
    />
  );
}
