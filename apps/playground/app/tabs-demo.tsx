'use client';

import { useState } from 'react';

import { Heading, Stack, Text } from '@orkest/ui';
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from '@orkest/ui/client';
import { Bell, Settings, User } from 'lucide-react';

export function TabsDemo() {
  const [value, setValue] = useState('overview');

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Tabs
      </Heading>
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="overview">Overview panel.</TabsContent>
        <TabsContent value="activity">Activity panel.</TabsContent>
        <TabsContent value="billing">Billing panel.</TabsContent>
      </Tabs>

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
        <TabsContent value="profile">Profile settings.</TabsContent>
        <TabsContent value="notifications">Notification settings.</TabsContent>
        <TabsContent value="preferences">Preference settings.</TabsContent>
      </Tabs>

      <Text size="sm" tone="muted">
        {`Active tab: ${value}`}
      </Text>
    </Stack>
  );
}
