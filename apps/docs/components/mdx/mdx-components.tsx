import Link from 'next/link';
import {
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import {
  Badge,
  Box,
  Button,
  Caption,
  Code,
  Grid,
  Heading,
  Icon,
  IconButton,
  Label,
  Link as TypographyLink,
  Paragraph,
  Separator,
  Small,
  Stack,
  Strong,
  Tag,
  Text,
} from '@orkest/ui';
import { Check, Circle } from 'lucide-react';

import { ColorPalette } from './color-palette';
import { Callout } from './callout';
import { PropsTable } from './props-table';
import { SemanticColorTable } from './semantic-color-table';
import { SpacingScale } from './spacing-scale';
import { TokenPreviewGrid } from './token-preview-grid';
import { TokenTable } from './token-table';
import { FontFamilySample, TypographySample } from './typography-sample';
import { CodeBlock } from '../examples/code-block';
import { ComponentPreview } from '../examples/component-preview';
import { CopyButton } from '../examples/copy-button';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarIconExample,
  AvatarImage,
} from '../examples/avatar-examples';
import { Input, InputIconsExample, Textarea } from '../examples/form-components';
import {
  Checkbox,
  IndeterminateCheckboxExample,
  Radio,
  RadioGroup,
  RadioGroupExample,
  Switch,
  SwitchExample,
} from '../examples/choice-controls';
import {
  BasicSelectExample,
  DetailedSelectExample,
  MultiSelect,
  MultiSelectExample,
  SearchableSelectExample,
  Select,
  SelectLoadingExample,
  SelectSizesExample,
  SelectStatesExample,
} from '../examples/select-examples';
import {
  FieldBasicExample,
  FieldCheckboxExample,
  FieldDisabledExample,
  FieldHorizontalExample,
  FieldMessagesExample,
  FieldRequiredExample,
  FieldSelectExample,
  FieldValidationExample,
} from '../examples/field-examples';
import {
  FieldsetBasicExample,
  FieldsetDisabledExample,
  FieldsetRadioExample,
} from '../examples/fieldset-examples';
import {
  AlertDialogBasicExample,
  AlertDialogControlledExample,
} from '../examples/alert-dialog-examples';
import {
  DialogBasicExample,
  DialogControlledExample,
  DialogScrollExample,
  DialogSizesExample,
} from '../examples/dialog-examples';
import {
  DropdownMenuBasicExample,
  DropdownMenuControlledExample,
  DropdownMenuGroupExample,
  DropdownMenuRadioExample,
  DropdownMenuSizingExample,
  DropdownMenuSubmenuExample,
} from '../examples/dropdown-menu-examples';
import {
  PopoverBasicExample,
  PopoverControlledExample,
  PopoverPositionExample,
  PopoverRegionExample,
} from '../examples/popover-examples';
import {
  TooltipBasicExample,
  TooltipPositionExample,
  TooltipTextTriggerExample,
} from '../examples/tooltip-examples';
import { InteractiveTagExample, RemovableTagExample } from '../examples/tag-examples';
import { TableScroll } from './table-scroll';

function Heading2({ id, children, ...props }: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2 {...props} id={id} className="mdx-heading">
      {children}
      {id ? (
        <a className="heading-anchor" href={`#${id}`} aria-label="Link to section">
          #
        </a>
      ) : null}
    </h2>
  );
}

function Heading3({ id, children, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 {...props} id={id} className="mdx-heading">
      {children}
      {id ? (
        <a className="heading-anchor" href={`#${id}`} aria-label="Link to section">
          #
        </a>
      ) : null}
    </h3>
  );
}

function MdxLink({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
}

function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <TableScroll>
      <table {...props} />
    </TableScroll>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  return '';
}

function MdxPre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const code = extractText(children).replace(/\n+$/, '');
  const isSingleLine = !code.includes('\n');

  return (
    <div className={isSingleLine ? 'code-block code-block-single-line' : 'code-block'}>
      <CopyButton code={code} />
      <div className="code-block-content">
        <pre {...props}>{children}</pre>
      </div>
    </div>
  );
}

export const mdxComponents = {
  h2: Heading2,
  h3: Heading3,
  a: MdxLink,
  pre: MdxPre,
  table: MdxTable,
  AlertDialogBasicExample,
  AlertDialogControlledExample,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarIconExample,
  AvatarImage,
  Badge,
  BasicSelectExample,
  Box,
  Button,
  Caption,
  Checkbox,
  Code,
  DetailedSelectExample,
  DialogBasicExample,
  DialogControlledExample,
  DialogSizesExample,
  DialogScrollExample,
  DropdownMenuBasicExample,
  DropdownMenuControlledExample,
  DropdownMenuGroupExample,
  DropdownMenuRadioExample,
  DropdownMenuSizingExample,
  DropdownMenuSubmenuExample,
  PopoverBasicExample,
  PopoverControlledExample,
  PopoverPositionExample,
  PopoverRegionExample,
  TooltipBasicExample,
  TooltipPositionExample,
  TooltipTextTriggerExample,
  FieldBasicExample,
  FieldCheckboxExample,
  FieldDisabledExample,
  FieldHorizontalExample,
  FieldMessagesExample,
  FieldRequiredExample,
  FieldSelectExample,
  FieldsetBasicExample,
  FieldsetDisabledExample,
  FieldsetRadioExample,
  FieldValidationExample,
  Grid,
  Heading,
  Icon,
  IconButton,
  IndeterminateCheckboxExample,
  Input,
  InputIconsExample,
  InteractiveTagExample,
  Label,
  Link: TypographyLink,
  MultiSelect,
  MultiSelectExample,
  Paragraph,
  Radio,
  RadioGroup,
  RadioGroupExample,
  RemovableTagExample,
  SearchableSelectExample,
  Select,
  SelectLoadingExample,
  SelectSizesExample,
  SelectStatesExample,
  Separator,
  Small,
  Stack,
  Strong,
  Switch,
  SwitchExample,
  Tag,
  Text,
  Textarea,
  Check,
  Circle,
  ComponentPreview,
  CodeBlock,
  Callout,
  PropsTable,
  TokenTable,
  ColorPalette,
  SemanticColorTable,
  SpacingScale,
  TokenPreviewGrid,
  TypographySample,
  FontFamilySample,
};
