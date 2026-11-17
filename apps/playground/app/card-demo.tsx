import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  Heading,
  Stack,
  Text,
} from '@orkest/ui';

export function CardDemo() {
  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Card
      </Heading>

      <Stack direction="row" gap={3} wrap align="start">
        <Card style={{ width: 240 }}>
          <CardHeader>
            <CardTitle>Default</CardTitle>
            <CardDescription>Bordered surface on the page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text size="sm" tone="muted">
              Card content.
            </Text>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Action
            </Button>
          </CardFooter>
        </Card>

        <Card variant="elevated" style={{ width: 240 }}>
          <CardHeader>
            <CardTitle>Elevated</CardTitle>
            <CardDescription>Shadow carries the elevation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="info">Badge</Badge>
          </CardContent>
        </Card>

        <Card variant="outline" padding="lg" style={{ width: 240 }}>
          <CardHeader>
            <CardTitle>Outline</CardTitle>
            <CardDescription>No background, wider padding.</CardDescription>
          </CardHeader>
        </Card>

        <Card style={{ width: 240 }}>
          <CardMedia>
            <div
              style={{
                aspectRatio: '16 / 9',
                background:
                  'linear-gradient(135deg, var(--ui-accent-surface), var(--ui-surface-sunken))',
              }}
            />
          </CardMedia>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>Full-bleed region clipped by the radius.</CardDescription>
          </CardHeader>
        </Card>

        <Card as="a" href="/" style={{ width: 240 }}>
          <CardHeader>
            <CardTitle>Linked card</CardTitle>
            <CardDescription>Rendered as an anchor.</CardDescription>
          </CardHeader>
        </Card>
      </Stack>
    </Stack>
  );
}
