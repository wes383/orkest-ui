import Link from 'next/link';
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
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
  Skeleton,
  Small,
  Spinner,
  Stack,
  Strong,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
} from '@orkest/ui';
import { Check, Circle } from 'lucide-react';

import { ColorPalette } from './color-palette';
import { Callout } from './callout';
import { InstallCommand } from './install-command';
import { PropsTable } from './props-table';
import { SemanticColorTable } from './semantic-color-table';
import { SemanticTokenTable } from './semantic-token-table';
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
import {
  AlertActionExample,
  AlertClosableExample,
  AlertCustomIconExample,
  AlertVariantsExample,
  AlertWithoutTitleExample,
} from '../examples/alert-examples';
import {
  AccordionBasicExample,
  AccordionControlledExample,
  AccordionMultipleExample,
} from '../examples/accordion-examples';
import {
  CollapsibleBasicExample,
  CollapsibleControlledExample,
  CollapsibleCustomTriggerExample,
} from '../examples/collapsible-examples';
import { SheetBasicExample, SheetSidesExample } from '../examples/sheet-examples';
import { OTPInputBasicExample, OTPInputMaskedExample } from '../examples/otp-input-examples';
import {
  ToggleGroupBasicExample,
  ToggleGroupDisabledExample,
  ToggleGroupMultipleExample,
  ToggleGroupVerticalExample,
} from '../examples/toggle-group-examples';
import { BreadcrumbBasicExample, BreadcrumbEllipsisExample } from '../examples/breadcrumb-examples';
import { KbdBasicExample } from '../examples/kbd-examples';
import { VisuallyHiddenExample } from '../examples/visually-hidden-examples';
import { AspectRatioExample } from '../examples/aspect-ratio-examples';
import { ProgressIndeterminateExample, ProgressSizesExample } from '../examples/progress-examples';
import {
  SliderBasicExample,
  SliderRangeExample,
  SliderVerticalExample,
} from '../examples/slider-examples';
import {
  DataTableActionsExample,
  DataTableExample,
  DataTableExpandableExample,
  DataTableSelectionExample,
  DataTableWideExample,
} from '../examples/data-table-examples';
import { TableActionsExample } from '../examples/table-examples';
import {
  PaginationBasicExample,
  PaginationFirstLastExample,
  PaginationManyPagesExample,
  PaginationSizesExample,
} from '../examples/pagination-examples';
import {
  EmptyStateAlignExample,
  EmptyStateBasicExample,
  EmptyStateCompositionExample,
  EmptyStateEmbeddedExample,
  EmptyStateImageExample,
  EmptyStateSizesExample,
} from '../examples/empty-state-examples';
import {
  CalendarBasicExample,
  CalendarCaptionSelectExample,
  CalendarRangeExample,
  CalendarSizesExample,
} from '../examples/calendar-examples';
import {
  DatePickerBasicExample,
  DatePickerBareExample,
  DatePickerCaptionSelectExample,
  DatePickerFieldExample,
  DatePickerFormatExample,
  DatePickerRangeExample,
  DatePickerSizesExample,
} from '../examples/date-picker-examples';
import {
  DateRangePickerBasicExample,
  DateRangePickerFieldExample,
  DateRangePickerLimitsExample,
  DateRangePickerSingleMonthExample,
  DateRangePickerSizesExample,
} from '../examples/date-range-picker-examples';
import {
  DateTimePickerBasicExample,
  DateTimePickerFieldExample,
  DateTimePickerMenuExample,
  DateTimePickerSecondsExample,
  DateTimePickerSizesExample,
  DateTimePickerTwelveHourExample,
} from '../examples/date-time-picker-examples';
import {
  TimePickerBasicExample,
  TimePickerBareExample,
  TimePickerFieldExample,
  TimePickerSecondsExample,
  TimePickerStatesExample,
  TimePickerTwelveHourExample,
} from '../examples/time-picker-examples';
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
  Combobox,
  ComboboxAsyncExample,
  ComboboxBasicExample,
  ComboboxCustomItemExample,
  ComboboxGroupedExample,
  ComboboxStatesExample,
} from '../examples/combobox-examples';
import {
  CommandBasicExample,
  CommandDialogExample,
  CommandShortcutExample,
} from '../examples/command-examples';
import {
  BasicSelectExample,
  DetailedSelectExample,
  MultiSelect,
  MultiSelectExample,
  MultiSelectOverflowExample,
  MultiSelectSelectAllExample,
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
import {
  TabsBasicExample,
  TabsControlledExample,
  TabsDisabledExample,
  TabsEnclosedExample,
  TabsFullWidthExample,
  TabsManualExample,
  TabsPillsExample,
  TabsSizesExample,
  TabsVerticalExample,
} from '../examples/tabs-examples';
import {
  ToastActionExample,
  ToastPositionsExample,
  ToastPromiseExample,
  ToastQueueExample,
  ToastTypesExample,
} from '../examples/toast-examples';
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
  CalendarBasicExample,
  CalendarCaptionSelectExample,
  CalendarRangeExample,
  CalendarSizesExample,
  AccordionBasicExample,
  AccordionControlledExample,
  AccordionMultipleExample,
  CollapsibleBasicExample,
  CollapsibleControlledExample,
  CollapsibleCustomTriggerExample,
  SheetBasicExample,
  SheetSidesExample,
  OTPInputBasicExample,
  OTPInputMaskedExample,
  ToggleGroupBasicExample,
  ToggleGroupMultipleExample,
  ToggleGroupVerticalExample,
  ToggleGroupDisabledExample,
  BreadcrumbBasicExample,
  BreadcrumbEllipsisExample,
  KbdBasicExample,
  VisuallyHiddenExample,
  AspectRatioExample,
  ProgressIndeterminateExample,
  ProgressSizesExample,
  SliderBasicExample,
  SliderRangeExample,
  SliderVerticalExample,
  Combobox,
  ComboboxAsyncExample,
  ComboboxBasicExample,
  ComboboxCustomItemExample,
  ComboboxGroupedExample,
  ComboboxStatesExample,
  CommandBasicExample,
  CommandDialogExample,
  CommandShortcutExample,
  DatePickerBasicExample,
  DatePickerBareExample,
  DatePickerCaptionSelectExample,
  DatePickerFieldExample,
  DatePickerFormatExample,
  DatePickerRangeExample,
  DatePickerSizesExample,
  DateRangePickerBasicExample,
  DateRangePickerFieldExample,
  DateRangePickerLimitsExample,
  DateRangePickerSingleMonthExample,
  DateRangePickerSizesExample,
  DateTimePickerBasicExample,
  DateTimePickerFieldExample,
  DateTimePickerMenuExample,
  DateTimePickerSecondsExample,
  DateTimePickerSizesExample,
  DateTimePickerTwelveHourExample,
  TimePickerBasicExample,
  TimePickerBareExample,
  TimePickerFieldExample,
  TimePickerSecondsExample,
  TimePickerStatesExample,
  TimePickerTwelveHourExample,
  AlertActionExample,
  AlertClosableExample,
  AlertCustomIconExample,
  AlertDialogBasicExample,
  AlertDialogControlledExample,
  AlertVariantsExample,
  DataTableActionsExample,
  DataTableExample,
  DataTableExpandableExample,
  DataTableSelectionExample,
  DataTableWideExample,
  AlertWithoutTitleExample,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarIconExample,
  AvatarImage,
  Badge,
  BasicSelectExample,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
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
  TabsBasicExample,
  TabsControlledExample,
  TabsDisabledExample,
  TabsEnclosedExample,
  TabsFullWidthExample,
  TabsManualExample,
  TabsPillsExample,
  TabsSizesExample,
  TabsVerticalExample,
  ToastActionExample,
  ToastPositionsExample,
  ToastPromiseExample,
  ToastQueueExample,
  ToastTypesExample,
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
  MultiSelectOverflowExample,
  MultiSelectSelectAllExample,
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
  Skeleton,
  Small,
  Spinner,
  Stack,
  Strong,
  Switch,
  SwitchExample,
  Table,
  TableActionsExample,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  PaginationBasicExample,
  PaginationFirstLastExample,
  PaginationManyPagesExample,
  PaginationSizesExample,
  EmptyStateAlignExample,
  EmptyStateBasicExample,
  EmptyStateCompositionExample,
  EmptyStateEmbeddedExample,
  EmptyStateImageExample,
  EmptyStateSizesExample,
  Tag,
  Text,
  Textarea,
  Check,
  Circle,
  ComponentPreview,
  CodeBlock,
  Callout,
  InstallCommand,
  PropsTable,
  TokenTable,
  ColorPalette,
  SemanticColorTable,
  SemanticTokenTable,
  SpacingScale,
  TokenPreviewGrid,
  TypographySample,
  FontFamilySample,
};
