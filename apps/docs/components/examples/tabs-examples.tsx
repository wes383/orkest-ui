'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import {
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from '@orkest/ui/client';
import { Bell, Settings, User } from 'lucide-react';

export function TabsBasicExample() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="overview">
        <Text size="sm" tone="muted">
          A summary of the project, recent changes, and open work.
        </Text>
      </TabsContent>
      <TabsContent value="activity">
        <Text size="sm" tone="muted">
          Commits, reviews, and comments from the last seven days.
        </Text>
      </TabsContent>
      <TabsContent value="settings">
        <Text size="sm" tone="muted">
          Visibility, members, and notification preferences.
        </Text>
      </TabsContent>
    </Tabs>
  );
}

export function TabsPillsExample() {
  return (
    <Tabs defaultValue="day">
      <TabsList variant="pills">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="day">Today&apos;s activity.</TabsContent>
      <TabsContent value="week">This week&apos;s activity.</TabsContent>
      <TabsContent value="month">This month&apos;s activity.</TabsContent>
    </Tabs>
  );
}

export function TabsEnclosedExample() {
  return (
    <Tabs defaultValue="list">
      <TabsList variant="enclosed">
        <TabsTrigger value="list">List</TabsTrigger>
        <TabsTrigger value="board">Board</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="list">Tasks grouped in a list.</TabsContent>
      <TabsContent value="board">Tasks grouped by status.</TabsContent>
      <TabsContent value="timeline">Tasks ordered by date.</TabsContent>
    </Tabs>
  );
}

export function TabsVerticalExample() {
  return (
    <Tabs defaultValue="profile" orientation="vertical">
      <TabsList variant="pills">
        <TabsTrigger value="profile" icon={User}>
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" icon={Bell} badge={2}>
          Notifications
        </TabsTrigger>
        <TabsTrigger value="preferences" icon={Settings}>
          Preferences
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="profile">
        <Text size="sm" tone="muted">
          Name, avatar, and contact details.
        </Text>
      </TabsContent>
      <TabsContent value="notifications">
        <Text size="sm" tone="muted">
          Two unread notifications.
        </Text>
      </TabsContent>
      <TabsContent value="preferences">
        <Text size="sm" tone="muted">
          Language, time zone, and keyboard shortcuts.
        </Text>
      </TabsContent>
    </Tabs>
  );
}

export function TabsSizesExample() {
  return (
    <Stack gap={5}>
      <Tabs defaultValue="first">
        <TabsList size="sm" variant="pills">
          <TabsTrigger value="first">Small</TabsTrigger>
          <TabsTrigger value="second">Tabs</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="first">Small size.</TabsContent>
        <TabsContent value="second">Small size.</TabsContent>
      </Tabs>
      <Tabs defaultValue="first">
        <TabsList size="md" variant="pills">
          <TabsTrigger value="first">Medium</TabsTrigger>
          <TabsTrigger value="second">Tabs</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="first">Medium size.</TabsContent>
        <TabsContent value="second">Medium size.</TabsContent>
      </Tabs>
      <Tabs defaultValue="first">
        <TabsList size="lg" variant="pills">
          <TabsTrigger value="first">Large</TabsTrigger>
          <TabsTrigger value="second">Tabs</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="first">Large size.</TabsContent>
        <TabsContent value="second">Large size.</TabsContent>
      </Tabs>
    </Stack>
  );
}

export function TabsFullWidthExample() {
  return (
    <Tabs defaultValue="all">
      <TabsList fullWidth variant="pills">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="all">All projects.</TabsContent>
      <TabsContent value="active">Active projects.</TabsContent>
      <TabsContent value="archived">Archived projects.</TabsContent>
    </Tabs>
  );
}

export function TabsManualExample() {
  return (
    <Tabs defaultValue="details">
      <TabsList activationMode="manual">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="details">
        <Text size="sm" tone="muted">
          Arrow keys move focus. Press Enter or Space to load a panel.
        </Text>
      </TabsContent>
      <TabsContent value="members">
        <Text size="sm" tone="muted">
          Members load only after you confirm the selection.
        </Text>
      </TabsContent>
      <TabsContent value="history">
        <Text size="sm" tone="muted">
          History keeps the current panel until you activate it.
        </Text>
      </TabsContent>
    </Tabs>
  );
}

export function TabsControlledExample() {
  const [value, setValue] = useState('overview');

  return (
    <Stack gap={2}>
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="overview">Overview panel.</TabsContent>
        <TabsContent value="activity">Activity panel.</TabsContent>
      </Tabs>
      <Text size="sm" tone="muted">
        Active tab: {value}
      </Text>
    </Stack>
  );
}

export function TabsDisabledExample() {
  const [disabled, setDisabled] = useState(false);

  return (
    <Stack gap={3}>
      <Switch
        label="Disable the whole tab list"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Tabs defaultValue="general" disabled={disabled}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="general">General settings.</TabsContent>
        <TabsContent value="billing">Billing settings.</TabsContent>
        <TabsContent value="advanced">Advanced settings.</TabsContent>
      </Tabs>
    </Stack>
  );
}
