'use client';

import { useState } from 'react';

import { Button, Heading, Stack } from '@orkest/ui';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@orkest/ui/client';

export function AlertDemo() {
  const [noticeVisible, setNoticeVisible] = useState(true);

  return (
    <Stack gap={3}>
      <Heading level={2} size="xl">
        Alert
      </Heading>
      <Stack gap={2}>
        <Alert variant="info">
          <AlertTitle>Workspace updated</AlertTitle>
          <AlertDescription>
            The shared theme tokens were applied to every environment.
          </AlertDescription>
        </Alert>
        <Alert variant="success">
          <AlertTitle>Changes saved</AlertTitle>
          <AlertDescription>Your profile is up to date.</AlertDescription>
        </Alert>
        {noticeVisible ? (
          <Alert variant="warning" closable onClose={() => setNoticeVisible(false)}>
            <AlertTitle>Verify your email</AlertTitle>
            <AlertDescription>
              Some features stay limited until the address is confirmed.
            </AlertDescription>
          </Alert>
        ) : (
          <Button variant="outline" onClick={() => setNoticeVisible(true)}>
            Restore warning
          </Button>
        )}
        <Alert variant="error">
          <AlertTitle>Could not load billing data</AlertTitle>
          <AlertDescription>The payment provider did not respond in time.</AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              Retry
            </Button>
          </AlertAction>
        </Alert>
        <Alert variant="warning" icon={null}>
          <AlertTitle>Maintenance window</AlertTitle>
          <AlertDescription>
            Expect brief interruptions on Saturday, 02:00–04:00 UTC.
          </AlertDescription>
        </Alert>
      </Stack>
    </Stack>
  );
}
