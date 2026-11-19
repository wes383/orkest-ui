'use client';

import { useState } from 'react';

import { Button, Stack } from '@orkest/ui';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@orkest/ui/client';
import { Rocket } from 'lucide-react';

export function AlertVariantsExample() {
  return (
    <Stack gap={3}>
      <Alert variant="info">
        <AlertTitle>New version available</AlertTitle>
        <AlertDescription>Orkest UI 0.2 adds updated theme tokens.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>Your profile is up to date.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Unsaved changes</AlertTitle>
        <AlertDescription>Leaving this page will discard your draft.</AlertDescription>
      </Alert>
      <Alert variant="error">
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>Check your connection and try again.</AlertDescription>
      </Alert>
    </Stack>
  );
}

export function AlertWithoutTitleExample() {
  return (
    <Stack gap={3}>
      <Alert variant="info">
        <AlertDescription>Two-factor authentication is enabled for this account.</AlertDescription>
      </Alert>
      <Alert variant="warning" icon={null}>
        <AlertTitle>Maintenance window</AlertTitle>
        <AlertDescription>
          Expect brief interruptions on Saturday, 02:00–04:00 UTC.
        </AlertDescription>
      </Alert>
    </Stack>
  );
}

export function AlertCustomIconExample() {
  return (
    <Alert variant="info" icon={Rocket}>
      <AlertTitle>Early access</AlertTitle>
      <AlertDescription>This workspace is enrolled in the preview program.</AlertDescription>
    </Alert>
  );
}

export function AlertClosableExample() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="outline" onClick={() => setVisible(true)}>
        Show alert again
      </Button>
    );
  }

  return (
    <Alert variant="warning" closable onClose={() => setVisible(false)}>
      <AlertTitle>Verify your email</AlertTitle>
      <AlertDescription>
        Some features stay limited until the address is confirmed.
      </AlertDescription>
    </Alert>
  );
}

export function AlertActionExample() {
  return (
    <Alert variant="error">
      <AlertTitle>Could not load billing data</AlertTitle>
      <AlertDescription>The payment provider did not respond in time.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Retry
        </Button>
        <Button size="sm" variant="ghost">
          Contact support
        </Button>
      </AlertAction>
    </Alert>
  );
}
