import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Checkbox } from '../checkbox';
import { Input } from '../input';
import { Select } from '../select';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldMessage,
  FieldRequiredIndicator,
  Fieldset,
  Legend,
} from './index';

describe('Field', () => {
  it('associates the label with the control and focuses it on click', async () => {
    const user = userEvent.setup();

    render(
      <Field controlId="email">
        <FieldLabel>Email</FieldLabel>
        <Input />
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('id', 'email');

    await user.click(screen.getByText('Email'));
    expect(input).toHaveFocus();
  });

  it('links descriptions and error messages to the control', async () => {
    render(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <Input defaultValue="not-an-email" />
        <FieldDescription>We never share your email.</FieldDescription>
        <FieldMessage>Enter a valid email address.</FieldMessage>
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    const description = screen.getByText('We never share your email.');
    const message = screen.getByRole('alert');

    await waitFor(() => {
      expect(input.getAttribute('aria-describedby')).toContain(description.id);
      expect(input.getAttribute('aria-describedby')).toContain(message.id);
    });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(message).toHaveTextContent('Enter a valid email address.');
  });

  it('marks required fields visually and for assistive technology', () => {
    render(
      <Field required>
        <FieldLabel>Email</FieldLabel>
        <Input />
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: /email required/i });
    expect(input).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('shows an optional marker without requiring the control', () => {
    render(
      <Field>
        <FieldLabel optional>Nickname</FieldLabel>
        <Input />
      </Field>,
    );

    expect(screen.getByRole('textbox', { name: /nickname optional/i })).not.toBeRequired();
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('hides error messages after the field becomes valid', () => {
    const { rerender } = render(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldMessage>Enter a valid email address.</FieldMessage>
      </Field>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldMessage>Enter a valid email address.</FieldMessage>
      </Field>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(['success', 'warning', 'info'] as const)('renders %s messages as status', (type) => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldMessage type={type} icon>
          Field status
        </FieldMessage>
      </Field>,
    );

    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('data-type', type);
    expect(message).toHaveTextContent('Field status');
    expect(message.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders standalone messages without a Field', () => {
    render(
      <FieldMessage type="warning" icon>
        Review this value.
      </FieldMessage>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Review this value.');
  });

  it('uses vertical orientation by default and supports horizontal layout', () => {
    const { rerender } = render(
      <Field data-testid="field">
        <FieldLabel>Email</FieldLabel>
        <Input />
      </Field>,
    );

    expect(screen.getByTestId('field')).toHaveAttribute('data-orientation', 'vertical');

    rerender(
      <Field data-testid="field" orientation="horizontal">
        <FieldLabel>Email</FieldLabel>
        <Input />
      </Field>,
    );

    expect(screen.getByTestId('field')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('disables the control and label together', () => {
    render(
      <Field disabled>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldDescription>Account notices only.</FieldDescription>
      </Field>,
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
    expect(screen.getByText('Email').closest('label')).toHaveAttribute('data-disabled');
  });

  it('runs Base UI validation and shows the validation message', async () => {
    const user = userEvent.setup();

    render(
      <Field
        validate={(value) => (value === 'taken' ? 'Username is already taken' : null)}
        validationMode="onChange"
      >
        <FieldLabel>Username</FieldLabel>
        <Input />
        <FieldMessage />
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: 'Username' });
    await user.type(input, 'taken');

    expect(await screen.findByRole('alert')).toHaveTextContent('Username is already taken');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('links a description to a checkbox', async () => {
    render(
      <Field>
        <Checkbox label="Accept terms" />
        <FieldDescription>Read the policy before continuing.</FieldDescription>
        <FieldMessage type="info">You can change this later.</FieldMessage>
      </Field>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    const description = screen.getByText('Read the policy before continuing.');
    const message = screen.getByText('You can change this later.');

    await waitFor(() => {
      expect(checkbox.getAttribute('aria-describedby')).toContain(description.id);
      expect(checkbox.getAttribute('aria-describedby')).toContain(message.id);
    });
  });

  it('names a checkbox from FieldLabel', () => {
    render(
      <Field>
        <FieldLabel>Accept terms</FieldLabel>
        <Checkbox />
      </Field>,
    );

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('names Select controls from FieldLabel', () => {
    render(
      <Field>
        <FieldLabel>Country</FieldLabel>
        <Select
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
          ]}
        />
        <FieldDescription>Where you live.</FieldDescription>
      </Field>,
    );

    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('forwards native attributes and refs to the field root', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Field ref={ref} data-testid="field" aria-label="Contact details">
        <FieldLabel>Email</FieldLabel>
        <Input />
      </Field>,
    );

    expect(ref.current).toBe(screen.getByTestId('field'));
    expect(screen.getByTestId('field')).toHaveAttribute('aria-label', 'Contact details');
  });

  it('renders a standalone required indicator with screen-reader text', () => {
    render(<FieldRequiredIndicator />);

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

describe('Fieldset', () => {
  it('groups fields with a legend and disables them together', () => {
    render(
      <Fieldset disabled>
        <Legend>Billing address</Legend>
        <Field>
          <FieldLabel>Street</FieldLabel>
          <Input />
        </Field>
      </Fieldset>,
    );

    expect(screen.getByRole('group', { name: 'Billing address' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Street' })).toBeDisabled();
  });
});
