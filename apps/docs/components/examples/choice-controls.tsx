'use client';

import { useState } from 'react';

import { Stack } from '@orkest/ui';
import { Checkbox, Radio, RadioGroup, Switch } from '@orkest/ui/client';

export {
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
} from '@orkest/ui/client';

const teams = ['Design', 'Engineering', 'Product'];

export function IndeterminateCheckboxExample() {
  const [selected, setSelected] = useState<string[]>(['Design']);
  const allSelected = selected.length === teams.length;
  const partiallySelected = selected.length > 0 && !allSelected;

  function toggleTeam(team: string) {
    setSelected((current) =>
      current.includes(team)
        ? current.filter((item) => item !== team)
        : [...current, team],
    );
  }

  return (
    <Stack gap={2}>
      <Checkbox
        label="All teams"
        checked={allSelected}
        indeterminate={partiallySelected}
        onCheckedChange={() => setSelected(allSelected ? [] : teams)}
      />
      <Stack gap={2} style={{ paddingInlineStart: '1.5rem' }}>
        {teams.map((team) => (
          <Checkbox
            key={team}
            label={team}
            checked={selected.includes(team)}
            onCheckedChange={() => toggleTeam(team)}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export function RadioGroupExample() {
  const [value, setValue] = useState('standard');

  return (
    <RadioGroup
      aria-label="Plan"
      value={value}
      onValueChange={setValue}
      orientation="horizontal"
    >
      <Radio value="standard" label="Standard" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  );
}

export function SwitchExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      label="Email notifications"
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  );
}
