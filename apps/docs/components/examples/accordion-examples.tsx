'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Stack, Text } from '@orkest/ui';
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@orkest/ui/client';

export function AccordionBasicExample() {
  return (
    <Accordion defaultValue={['shipping']}>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionPanel>Orders leave the warehouse within two business days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionPanel>Unused items can be returned within 30 days of delivery.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Support</AccordionTrigger>
        <AccordionPanel>Reach the team from the help panel in your account.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionMultipleExample() {
  return (
    <Accordion multiple defaultValue={['account']}>
      <AccordionItem value="account">
        <AccordionTrigger icon={Plus}>Account</AccordionTrigger>
        <AccordionPanel>Update your name, email, and password.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionPanel>Manage invoices and payment methods.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionPanel>Choose which activity sends an email.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionControlledExample() {
  const [value, setValue] = useState<string[]>(['account']);

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Accordion value={value} onValueChange={setValue}>
        <AccordionItem value="account">
          <AccordionTrigger>Account</AccordionTrigger>
          <AccordionPanel>Update your name, email, and password.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="billing">
          <AccordionTrigger>Billing</AccordionTrigger>
          <AccordionPanel>Manage invoices and payment methods.</AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Text size="sm" tone="muted">
        Open: {value.join(', ') || 'none'}
      </Text>
    </Stack>
  );
}
