'use client';

import { createContext, useContext, useEffect } from 'react';

export type FieldOrientation = 'vertical' | 'horizontal';

export interface FieldContextValue {
  /** Id assigned to the field control. */
  controlId: string;
  /** Id of the associated label, when one is rendered. */
  labelId?: string;
  /** Space-separated ids registered by descriptions and messages. */
  describedBy?: string;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  name?: string;
  orientation: FieldOrientation;
  /** Validation messages produced by Base UI Field. */
  errors: string[];
  registerLabel: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
  registerMessage: (id: string) => () => void;
}

export interface FieldsetContextValue {
  disabled: boolean;
  legendId?: string;
  registerLegend: (id: string) => () => void;
}

export const FieldContext = createContext<FieldContextValue | null>(null);
export const FieldsetContext = createContext<FieldsetContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

export function useFieldsetContext(): FieldsetContextValue | null {
  return useContext(FieldsetContext);
}

/** Joins ids while dropping empty values, matching `aria-describedby` expectations. */
export function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const merged = ids.filter(Boolean).join(' ').trim();
  return merged === '' ? undefined : merged;
}

export interface FieldControlOptions {
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  /** Set to `false` when the control should not inherit the field's control id. */
  inheritId?: boolean;
}

export interface FieldControlState {
  id?: string;
  name?: string;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  describedBy?: string;
  /** Id of the field label, for controls that cannot rely on native label association. */
  labelId?: string;
}

/** Merges a form control's own props with the surrounding Field context. */
export function useFieldControl(options: FieldControlOptions = {}): FieldControlState {
  const field = useFieldContext();
  const { inheritId = true } = options;

  return {
    id: options.id ?? (inheritId ? field?.controlId : undefined),
    name: options.name ?? field?.name,
    disabled: Boolean(options.disabled || field?.disabled),
    required: Boolean(options.required || field?.required),
    invalid: Boolean(options.invalid || field?.invalid),
    describedBy: mergeIds(options.describedBy, field?.describedBy),
    labelId: field?.labelId,
  };
}

export type FieldRegistrationKind = 'label' | 'description' | 'message';

/** Registers a Fieldset legend id so the fieldset can reference it. */
export function useFieldsetLegendRegistration(id: string, enabled = true): void {
  const fieldset = useFieldsetContext();
  const register = fieldset?.registerLegend;

  useEffect(() => {
    if (!register || !enabled) {
      return undefined;
    }

    return register(id);
  }, [register, id, enabled]);
}

export function useFieldRegistration(
  kind: FieldRegistrationKind,
  id: string,
  enabled = true,
): void {
  const field = useFieldContext();
  const register =
    kind === 'label'
      ? field?.registerLabel
      : kind === 'description'
        ? field?.registerDescription
        : field?.registerMessage;

  useEffect(() => {
    if (!register || !enabled) {
      return undefined;
    }

    return register(id);
  }, [register, id, enabled]);
}
