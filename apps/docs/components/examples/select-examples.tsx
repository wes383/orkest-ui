'use client';

import { useState } from 'react';
import { Briefcase, Code, Layers, Megaphone, Palette, Server } from 'lucide-react';

import { Stack } from '@orkest/ui';
import { MultiSelect, Select, type SelectItem } from '@orkest/ui/client';

export { MultiSelect, Select } from '@orkest/ui/client';

const fruitOptions: SelectItem[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
];

const languageOptions: SelectItem[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
];

const priorityOptions: SelectItem[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const statusOptions: SelectItem[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];

const skillOptions: SelectItem[] = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'css', label: 'CSS' },
  { value: 'testing', label: 'Testing' },
  { value: 'accessibility', label: 'Accessibility' },
];

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
      {
        value: 'product',
        label: 'Product',
        description: 'Planning and strategy',
        icon: Briefcase,
      },
      {
        value: 'marketing',
        label: 'Marketing',
        description: 'Campaigns and brand',
        icon: Megaphone,
      },
    ],
  },
  {
    label: 'Engineering',
    options: [
      {
        value: 'frontend',
        label: 'Frontend',
        description: 'Web interfaces',
        icon: Code,
      },
      {
        value: 'backend',
        label: 'Backend',
        description: 'APIs and services',
        icon: Server,
      },
      {
        value: 'platform',
        label: 'Platform',
        description: 'Infrastructure and tooling',
        icon: Layers,
      },
    ],
  },
];

export function BasicSelectExample() {
  return (
    <Select
      aria-label="Fruit"
      options={fruitOptions}
      defaultValue="apple"
      clearable
    />
  );
}

export function SearchableSelectExample() {
  return (
    <Select
      aria-label="Language"
      options={languageOptions}
      searchable
      searchPlaceholder="Search languages"
      placeholder="Choose a language"
    />
  );
}

export function SelectSizesExample() {
  return (
    <Stack gap={3}>
      <Select
        aria-label="Small priority"
        size="sm"
        options={priorityOptions}
        defaultValue="medium"
      />
      <Select
        aria-label="Medium priority"
        size="md"
        options={priorityOptions}
        defaultValue="medium"
      />
      <Select
        aria-label="Large priority"
        size="lg"
        options={priorityOptions}
        defaultValue="medium"
      />
    </Stack>
  );
}

export function SelectStatesExample() {
  return (
    <Stack gap={3}>
      <Select
        aria-label="Disabled status"
        options={statusOptions}
        defaultValue="active"
        disabled
      />
      <Select
        aria-label="Invalid status"
        options={statusOptions}
        placeholder="Choose a status"
        invalid
      />
      <Select
        aria-label="Clearable status"
        options={statusOptions}
        defaultValue="paused"
        clearable
      />
    </Stack>
  );
}

export function SelectLoadingExample() {
  return (
    <Select
      aria-label="Searching languages"
      options={[]}
      searchable
      loading
      searchPlaceholder="Search languages"
      emptyMessage="No languages matched"
    />
  );
}

export function DetailedSelectExample() {
  return (
    <Select
      aria-label="Team"
      options={teamOptions}
      defaultValue="design"
      clearable
    />
  );
}

export function MultiSelectExample() {
  const [selected, setSelected] = useState(['react', 'typescript']);

  return (
    <MultiSelect
      aria-label="Skills"
      options={skillOptions}
      value={selected}
      onChange={(nextValues) => setSelected(nextValues)}
      searchable
      hideSelected
      clearable
      maxSelected={3}
      placeholder="Select skills"
    />
  );
}
