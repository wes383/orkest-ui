import { createRef, type ReactElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton, type SkeletonAnimation, type SkeletonVariant } from './skeleton';

const variants: SkeletonVariant[] = ['text', 'circular', 'rectangular'];
const animations: SkeletonAnimation[] = ['pulse', 'wave', 'none'];

function renderSkeleton(element: ReactElement) {
  const { container } = render(element);

  return container.firstElementChild as HTMLElement;
}

describe('Skeleton', () => {
  it('renders a hidden placeholder with the default attributes', () => {
    const skeleton = renderSkeleton(<Skeleton />);

    expect(skeleton.tagName).toBe('SPAN');
    expect(skeleton).toHaveAttribute('data-variant', 'text');
    expect(skeleton).toHaveAttribute('data-animation', 'pulse');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(variants)('applies the %s variant', (variant) => {
    expect(renderSkeleton(<Skeleton variant={variant} />)).toHaveAttribute(
      'data-variant',
      variant,
    );
  });

  it.each(animations)('applies the %s animation', (animation) => {
    expect(renderSkeleton(<Skeleton animation={animation} />)).toHaveAttribute(
      'data-animation',
      animation,
    );
  });

  it('treats numeric dimensions as pixels', () => {
    const skeleton = renderSkeleton(<Skeleton width={120} height={16} radius={8} />);

    expect(skeleton.style.getPropertyValue('--skeleton-width')).toBe('120px');
    expect(skeleton.style.getPropertyValue('--skeleton-height')).toBe('16px');
    expect(skeleton.style.getPropertyValue('--skeleton-radius')).toBe('8px');
  });

  it('passes string dimensions through unchanged', () => {
    const skeleton = renderSkeleton(<Skeleton width="60%" height="1.5rem" />);

    expect(skeleton.style.getPropertyValue('--skeleton-width')).toBe('60%');
    expect(skeleton.style.getPropertyValue('--skeleton-height')).toBe('1.5rem');
    expect(skeleton.style.getPropertyValue('--skeleton-radius')).toBe('');
  });

  it('forwards native attributes, class names, and refs', () => {
    const ref = createRef<HTMLSpanElement>();
    const skeleton = renderSkeleton(
      <Skeleton ref={ref} id="title" className="custom" aria-hidden={false} />,
    );

    expect(skeleton).toHaveAttribute('id', 'title');
    expect(skeleton).toHaveClass('custom');
    expect(skeleton).toHaveAttribute('aria-hidden', 'false');
    expect(ref.current).toBe(skeleton);
  });
});
