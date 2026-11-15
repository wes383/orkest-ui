import { createRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  type AvatarShape,
  type AvatarSize,
  type AvatarStatus,
} from './avatar';

const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const shapes: AvatarShape[] = ['circle', 'square'];
const statusLabels: Array<[AvatarStatus, string]> = [
  ['online', 'Online'],
  ['away', 'Away'],
  ['offline', 'Offline'],
  ['busy', 'Busy'],
];

describe('Avatar', () => {
  it('renders a span with the default size and shape', () => {
    const { container } = render(<Avatar>AM</Avatar>);

    const avatar = container.querySelector('[data-size="md"][data-shape="circle"]');
    expect(avatar?.tagName).toBe('SPAN');
  });

  it.each(sizes)('applies the %s size', (size) => {
    const { container } = render(<Avatar size={size}>AM</Avatar>);

    expect(container.querySelector(`[data-size="${size}"]`)).toBeInTheDocument();
  });

  it.each(shapes)('applies the %s shape', (shape) => {
    const { container } = render(<Avatar shape={shape}>AM</Avatar>);

    expect(container.querySelector(`[data-shape="${shape}"]`)).toBeInTheDocument();
  });

  it('hides visual content and exposes a text label when label is set', () => {
    const { container } = render(
      <Avatar label="Alex Morgan">
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>,
    );

    const frame = container.querySelector('[data-size="md"] > span[aria-hidden="true"]');
    expect(frame).toBeInTheDocument();
    expect(frame).toContainElement(screen.getByText('AM'));
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
  });

  it.each(statusLabels)('announces the %s status as text', (status, label) => {
    render(<Avatar status={status}>AM</Avatar>);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('supports a custom status label', () => {
    render(
      <Avatar status="busy" statusLabel="In a meeting">
        AM
      </Avatar>,
    );

    expect(screen.getByText('In a meeting')).toBeInTheDocument();
    expect(screen.queryByText('Busy')).not.toBeInTheDocument();
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Avatar ref={ref} id="avatar" className="custom" data-testid="avatar">
        AM
      </Avatar>,
    );

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('id', 'avatar');
    expect(avatar).toHaveClass('custom');
    expect(ref.current).toBe(avatar);
  });
});

describe('AvatarImage', () => {
  it('renders an image and hides the fallback after loading', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="Alex Morgan" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>,
    );

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', '/avatar.png');
    expect(image).toHaveAttribute('data-state', 'loading');
    expect(image).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('AM')).toBeInTheDocument();

    fireEvent.load(image!);

    expect(image).toHaveAttribute('data-state', 'loaded');
    expect(image).not.toHaveAttribute('aria-hidden');
    expect(screen.queryByText('AM')).not.toBeInTheDocument();
  });

  it('replaces a failed image with the fallback', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/missing.png" alt="Jordan Lee" />
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>,
    );

    const image = container.querySelector('img');
    fireEvent.error(image!);

    expect(image).toHaveAttribute('data-state', 'error');
    expect(image).toHaveAttribute('aria-hidden', 'true');
    expect(
      screen.queryByRole('img', { name: 'Jordan Lee' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('JL')).toBeInTheDocument();
    expect(screen.getByText('JL')).toHaveAttribute('data-state', 'error');
  });

  it('restores the image state when the source changes', () => {
    const { container, rerender } = render(
      <Avatar>
        <AvatarImage src="/missing.png" alt="Alex Morgan" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>,
    );

    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByText('AM')).toHaveAttribute('data-state', 'error');

    rerender(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="Alex Morgan" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>,
    );

    expect(container.querySelector('img')).toHaveAttribute(
      'data-state',
      'loading',
    );
    expect(screen.getByText('AM')).toHaveAttribute('data-state', 'loading');
  });

  it('forwards image attributes and refs', () => {
    const ref = createRef<HTMLImageElement>();

    const { container } = render(
      <Avatar>
        <AvatarImage
          ref={ref}
          src="/avatar.png"
          alt="Alex Morgan"
          width={64}
          height={64}
          className="custom"
        />
      </Avatar>,
    );

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('width', '64');
    expect(image).toHaveAttribute('height', '64');
    expect(image).toHaveClass('custom');
    expect(ref.current).toBe(image);
  });
});

describe('AvatarFallback', () => {
  it('renders without an image and forwards attributes and refs', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Avatar>
        <AvatarFallback ref={ref}>AM</AvatarFallback>
      </Avatar>,
    );

    expect(ref.current).toBe(screen.getByText('AM'));
  });
});

describe('AvatarGroup', () => {
  function renderGroup(max?: number) {
    return render(
      <AvatarGroup max={max}>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );
  }

  it('renders all avatars when max is not set', () => {
    renderGroup();

    for (const label of ['A', 'B', 'C', 'D', 'E']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText(/more avatar/)).not.toBeInTheDocument();
  });

  it('renders an overflow indicator after max avatars', () => {
    renderGroup(3);

    for (const label of ['A', 'B', 'C']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText('D')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByText('2 more avatars')).toBeInTheDocument();
  });

  it('supports a custom overflow label', () => {
    render(
      <AvatarGroup max={1} overflowLabel={(count) => `${count} teammates`}>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    expect(screen.getByText('2 teammates')).toBeInTheDocument();
  });

  it('uses the singular overflow label for one hidden avatar', () => {
    render(
      <AvatarGroup max={1}>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    expect(screen.getByText('1 more avatar')).toBeInTheDocument();
  });

  it('can show only the overflow indicator', () => {
    render(
      <AvatarGroup max={0}>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('applies size and shape to child avatars and the overflow indicator', () => {
    const { container } = render(
      <AvatarGroup max={1} size="lg" shape="square">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    const avatars = container.querySelectorAll('[data-size="lg"][data-shape="square"]');
    expect(avatars).toHaveLength(2);
  });

  it('lets individual avatars override the group size and shape', () => {
    const { container } = render(
      <AvatarGroup size="lg" shape="square">
        <Avatar size="xs" shape="circle">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    expect(container.querySelector('[data-size="xs"][data-shape="circle"]')).toBeInTheDocument();
  });

  it('applies the overlap spacing step', () => {
    const { container } = render(
      <AvatarGroup spacing={3}>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    expect(container.querySelector('[data-spacing="3"]')).toBeInTheDocument();
  });

  it('preserves the provided avatar order', () => {
    const { container } = renderGroup(3);

    const labels = Array.from(container.querySelectorAll('[data-state]')).map(
      (fallback) => fallback.textContent,
    );
    expect(labels).toEqual(['A', 'B', 'C', '+2']);
  });

  it('forwards group attributes and refs', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <AvatarGroup ref={ref} id="team" className="custom" aria-label="Team members">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    const group = screen.getByLabelText('Team members');
    expect(group).toHaveAttribute('id', 'team');
    expect(group).toHaveClass('custom');
    expect(ref.current).toBe(group);
  });
});
