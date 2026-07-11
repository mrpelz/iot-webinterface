/**
 * base-ui-styled
 *
 * Base UI components wrapped with `@emotion/styled`, pre-styled to match the
 * no-frills look from the official Base UI documentation. The CSS for each
 * component is ported verbatim from that component's "CSS Modules" example on
 * https://base-ui.com.
 *
 * Each component keeps the original Base UI API (parts, props, refs, the
 * `render` composition prop, and all `data-*` state attributes), so these are
 * drop-in replacements for the unstyled components — the styling just ships by
 * default.
 *
 * Every component is also available as a one-file module under
 * `./components/<name>` if you prefer to import them individually.
 *
 * Some components reference CSS custom properties (e.g. `--color-gray-*`,
 * `--color-blue`) that the Base UI docs define globally. Import `theme.css`
 * (or define equivalents yourself) so those components render as intended.
 */

// Disclosure
export { Accordion } from './components/accordion.js';
export { Collapsible } from './components/collapsible.js';

// Data display
export { Avatar } from './components/avatar.js';

// Buttons & inputs
export { Button } from './components/button.js';
export { Checkbox } from './components/checkbox.js';
export { CheckboxGroup } from './components/checkbox-group.js';
export { Input } from './components/input.js';
export { NumberField } from './components/number-field.js';
export { OTPField } from './components/otp-field.js';
export { Radio, RadioGroup } from './components/radio.js';
export { Slider } from './components/slider.js';
export { Switch } from './components/switch.js';
export { Toggle } from './components/toggle.js';
export { ToggleGroup } from './components/toggle-group.js';

// Forms
export { Field } from './components/field.js';
export { Fieldset } from './components/fieldset.js';
export { Form } from './components/form.js';

// Selection / pickers
export { Autocomplete } from './components/autocomplete.js';
export { Combobox } from './components/combobox.js';
export { Select } from './components/select.js';

// Navigation & menus
export { Menu } from './components/menu.js';
export { Menubar } from './components/menubar.js';
export { ContextMenu } from './components/context-menu.js';
export { NavigationMenu } from './components/navigation-menu.js';
export { Toolbar } from './components/toolbar.js';

// Layout
export { ScrollArea } from './components/scroll-area.js';
export { Separator } from './components/separator.js';
export { Tabs } from './components/tabs.js';

// Feedback & status
export { Meter } from './components/meter.js';
export { Progress } from './components/progress.js';
export { Toast } from './components/toast.js';

// Overlays
export { AlertDialog } from './components/alert-dialog.js';
export { Dialog } from './components/dialog.js';
export { Drawer } from './components/drawer.js';
export { Popover } from './components/popover.js';
export { PreviewCard } from './components/preview-card.js';
export { Tooltip } from './components/tooltip.js';
