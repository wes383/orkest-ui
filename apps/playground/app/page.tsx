import { ArrowRight, Settings } from 'lucide-react';

import {
  Badge,
  Box,
  Button,
  Grid,
  Heading,
  IconButton,
  Separator,
  Stack,
  Tag,
  Text,
} from '@orkest/ui';

import { AlertDemo } from './alert-demo';
import { AvatarDemo } from './avatar-demo';
import { CardDemo } from './card-demo';
import { ChoiceDemo } from './choice-demo';
import { DataTableDemo } from './data-table-demo';
import { DialogDemo } from './dialog-demo';
import { DropdownMenuDemo } from './dropdown-menu-demo';
import { EmptyStateDemo } from './empty-state-demo';
import { FieldDemo } from './field-demo';
import { LoadingDemo } from './loading-demo';
import { PlaygroundForm } from './playground-form';
import { PaginationDemo } from './pagination-demo';
import { PopoverDemo } from './popover-demo';
import { SelectDemo } from './select-demo';
import { TableDemo } from './table-demo';
import { TabsDemo } from './tabs-demo';
import { ToastDemo } from './toast-demo';

function Showcase({ idPrefix }: { idPrefix: string }) {
  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Heading level={2} size="xl">
          Buttons
        </Heading>
        <Stack direction="row" gap={3} wrap align="center">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link" rightIcon={ArrowRight}>
            Link
          </Button>
          <IconButton icon={Settings} label="Settings" variant="outline" />
        </Stack>
      </Stack>
      <Stack gap={2}>
        <Heading level={2} size="xl">
          Badges and tags
        </Heading>
        <Stack direction="row" gap={2} wrap align="center">
          <Badge>Default</Badge>
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge count={12} variant="destructive" shape="pill" />
          <Tag variant="info">Design</Tag>
          <Tag variant="outline">Engineering</Tag>
        </Stack>
      </Stack>
      <Stack gap={2}>
        <Heading level={2} size="xl">
          Grid
        </Heading>
        <Grid columns={{ base: 1, md: 3 }} gap={3}>
          <Box padding={4} background="surface" border radius="md">
            <Text size="sm">{'One'}</Text>
          </Box>
          <Box padding={4} background="surface" border radius="md">
            <Text size="sm">{'Two'}</Text>
          </Box>
          <Box padding={4} background="surface" border radius="md">
            <Text size="sm">{'Three'}</Text>
          </Box>
        </Grid>
      </Stack>
      <Stack direction="row" gap={4} align="center">
        <Text size="sm" tone="muted">
          Server-safe
        </Text>
        <Separator orientation="vertical" />
        <Text size="sm" tone="muted">
          Token-driven
        </Text>
      </Stack>
      <Separator />
      <AlertDemo />
      <AvatarDemo />
      <CardDemo />
      <ChoiceDemo />
      <DataTableDemo />
      <PaginationDemo />
      <SelectDemo />
      <FieldDemo />
      <DialogDemo />
      <DropdownMenuDemo />
      <EmptyStateDemo />
      <PopoverDemo />
      <TabsDemo />
      <TableDemo />
      <ToastDemo />
      <LoadingDemo />
      <PlaygroundForm idPrefix={idPrefix} />
    </Stack>
  );
}

export default function Page() {
  return (
    <main className="page">
      <Stack gap={2}>
        <Heading level={1} size="3xl">
          Orkest UI playground
        </Heading>
        <Text tone="muted">
          Consumer app validating the built package, both themes, and the client entry in Next.js App
          Router.
        </Text>
      </Stack>
      <section className="showcase" data-orkest-theme="light">
        <Showcase idPrefix="light" />
      </section>
      <section className="showcase" data-orkest-theme="dark">
        <Showcase idPrefix="dark" />
      </section>
    </main>
  );
}
