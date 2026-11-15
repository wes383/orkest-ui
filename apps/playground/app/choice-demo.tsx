'use client';

import { useState } from 'react';

import { Heading, Stack } from '@orkest/ui';
import { Checkbox, Radio, RadioGroup, Switch } from '@orkest/ui/client';

export function ChoiceDemo() {
  const [accepted, setAccepted] = useState(false);
  const [plan, setPlan] = useState('pro');
  const [notifications, setNotifications] = useState(true);

  return (
    <Stack gap={3}>
      <Heading level={2} size="xl">
        Choice controls
      </Heading>
      <Checkbox
        label="Accept terms"
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <RadioGroup
        aria-label="Plan"
        orientation="horizontal"
        value={plan}
        onValueChange={setPlan}
      >
        <Radio value="standard" label="Standard" />
        <Radio value="pro" label="Pro" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>
      <Switch
        label="Email notifications"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
    </Stack>
  );
}
