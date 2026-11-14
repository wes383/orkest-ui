import { ArrowRight, Settings } from 'lucide-react';

import { Badge, Button, Heading, IconButton, Stack, Tag, Text } from '@orkest/ui';

import { PlaygroundForm } from './playground-form';

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
