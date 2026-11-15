'use client';

import { useState } from 'react';

import { Heading, Stack } from '@orkest/ui';
import { MultiSelect, Select, type SelectItem } from '@orkest/ui/client';

const options: SelectItem[] = [
  {
    label: 'Product',
    options: [
      { value: 'design', label: 'Design', description: 'Product design' },
      { value: 'product', label: 'Product', description: 'Planning and strategy' },
      { value: 'marketing', label: 'Marketing' },
    ],
  },
  {
    label: 'Engineering',
    options: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
      { value: 'platform', label: 'Platform', disabled: true },
    ],
  },
];

export function SelectDemo() {
  const [team, setTeam] = useState<string | undefined>('design');
  const [teams, setTeams] = useState(['frontend']);

  return (
    <Stack gap={3}>
      <Heading level={2} size="xl">
        Selects
      </Heading>
      <Select
        aria-label="Team"
        options={options}
        value={team}
        onChange={setTeam}
        searchable
        clearable
      />
      <MultiSelect
        aria-label="Teams"
        options={options}
        value={teams}
        onChange={setTeams}
        searchable
        hideSelected
        clearable
        maxSelected={3}
      />
    </Stack>
  );
}
