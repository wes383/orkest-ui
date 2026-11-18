'use client';

import { useEffect, useRef, useState } from 'react';
import { Code, Globe, Layers, Server } from 'lucide-react';

import { Stack } from '@orkest/ui';
import { Combobox, type SelectItem, type SelectOption } from '@orkest/ui/client';

export { Combobox } from '@orkest/ui/client';

const fruitOptions: SelectItem[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'peach', label: 'Peach' },
  { value: 'pear', label: 'Pear' },
  { value: 'raspberry', label: 'Raspberry' },
];

const projectOptions: SelectItem[] = [
  {
    label: 'Engineering',
    options: [
      { value: 'frontend', label: 'Frontend', description: 'Web interfaces', icon: Code },
      { value: 'backend', label: 'Backend', description: 'APIs and services', icon: Server },
      { value: 'platform', label: 'Platform', description: 'Infrastructure', icon: Layers },
    ],
  },
  {
    label: 'Marketing',
    options: [
      { value: 'website', label: 'Website', description: 'Public site', icon: Globe },
      { value: 'launch', label: 'Launch', description: 'Release campaign', icon: Globe },
    ],
  },
];

const countryOptions: SelectOption[] = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'cn', label: 'China' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
  { value: 'fr', label: 'France' },
  { value: 'in', label: 'India' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'mx', label: 'Mexico' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'se', label: 'Sweden' },
  { value: 'sg', label: 'Singapore' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

export function ComboboxBasicExample() {
  const [value, setValue] = useState<string | null>('apple');

  return (
    <Combobox
      aria-label="Fruit"
      options={fruitOptions}
      value={value}
      onChange={setValue}
      clearable
      placeholder="Pick a fruit"
      searchPlaceholder="Search fruit"
    />
  );
}

export function ComboboxGroupedExample() {
  return (
    <Combobox
      aria-label="Project"
      options={projectOptions}
      defaultValue="backend"
      placeholder="Pick a project"
      searchPlaceholder="Search projects"
    />
  );
}

export function ComboboxAsyncExample() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SelectOption[]>(countryOptions);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Stands in for a request: the list only changes once the "server" answers.
  function handleSearch(query: string) {
    clearTimeout(timer.current);
    const term = query.trim().toLowerCase();

    if (term === '') {
      setResults(countryOptions);
      setLoading(false);
      return;
    }

    setLoading(true);
    timer.current = setTimeout(() => {
      setResults(countryOptions.filter((option) => option.label.toLowerCase().includes(term)));
      setLoading(false);
    }, 450);
  }

  return (
    <Combobox
      aria-label="Country"
      options={results}
      filterOption={null}
      loading={loading}
      onSearchChange={handleSearch}
      placeholder="Pick a country"
      searchPlaceholder="Search countries"
      emptyMessage="No country matched"
    />
  );
}

export function ComboboxCustomItemExample() {
  const [value, setValue] = useState<string | null>('frontend');

  return (
    <Combobox
      aria-label="Project"
      options={projectOptions}
      value={value}
      onChange={setValue}
      placeholder="Pick a project"
      renderItem={(option) => (
        <span style={{ display: 'grid', gap: 2 }}>
          <strong style={{ fontWeight: 600 }}>{option.label}</strong>
          <span style={{ color: 'var(--ui-muted-foreground)', fontSize: 'var(--ok-font-size-xs)' }}>
            {option.description ?? option.value}
          </span>
        </span>
      )}
    />
  );
}

export function ComboboxStatesExample() {
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Combobox aria-label="Fruit" options={fruitOptions} disabled defaultValue="apple" />
      <Combobox aria-label="Team fruit" options={fruitOptions} invalid placeholder="Invalid" />
      <Combobox aria-label="Sized fruit" options={fruitOptions} size="lg" placeholder="Large" />
    </Stack>
  );
}
