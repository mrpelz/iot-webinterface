# base-ui-styled

Every [Base UI](https://base-ui.com) React component, wrapped with
[`@emotion/styled`](https://emotion.sh) and pre-styled to match the clean,
no-frills look from Base UI's own documentation.

Base UI ships unstyled. This library keeps the entire Base UI API intact —
every part, prop, ref, the `render` composition prop, and all `data-*` state
attributes — and just adds the default styling so components look good out of
the box. They remain drop-in replacements for the unstyled originals.

The CSS for each component is ported **verbatim** from that component's
"CSS Modules" example on base-ui.com, so what you get matches the docs exactly.

## Install

```sh
npm install base-ui-styled
```

Peer dependencies (install if you don't have them):

```sh
npm install @base-ui/react @emotion/react @emotion/styled react react-dom
```

## Theme variables

A few components (`CheckboxGroup`, `Switch`, `Progress`, `Tabs`, `Slider`,
`NumberField`) reference CSS custom properties that the Base UI docs define
globally — `--color-gray-50/100/200/300/500/600/700/900` and `--color-blue`.
Import the bundled `theme.css` once at your app root, or define your own values:

```ts
import 'base-ui-styled/src/theme.css';
```

Everything else uses literal colors and needs no theme.

## Usage

Import from the barrel:

```tsx
import { Dialog, Button } from 'base-ui-styled';

function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Intro>
            <Dialog.Title>Subscribe</Dialog.Title>
            <Dialog.Description>Enter your email to subscribe.</Dialog.Description>
          </Dialog.Intro>
          <Dialog.Actions>
            <Dialog.Close>Cancel</Dialog.Close>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

…or import a single component directly, which keeps your bundle lean:

```tsx
import { Accordion } from 'base-ui-styled/src/components/accordion.js';
```

Because each component spreads the original Base UI namespace
(`{ ...BaseX, ...styledOverrides }`), any part that the docs didn't style is
still available and behaves exactly as in Base UI.

## Components

All 38 Base UI components are included:

Accordion, Alert Dialog, Autocomplete, Avatar, Button, Checkbox, Checkbox
Group, Collapsible, Combobox, Context Menu, Dialog, Drawer, Field, Fieldset,
Form, Input, Menu, Menubar, Meter, Navigation Menu, Number Field, OTP Field,
Popover, Preview Card, Progress, Radio (and Radio Group), Scroll Area, Select,
Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar, Tooltip.

### Helper parts

Where a docs example shipped extra elements (icons, layout wrappers, labels),
those are re-exported on the component's namespace so nothing from the demo is
lost — for example `Checkbox.CheckIcon`, `Checkbox.Label`, `Dialog.Intro`,
`Dialog.Actions`, `Collapsible.Icon`, `Toggle.HeartFilledIcon`,
`Tabs.Icon`, `Toast.Text`, and so on.

### Single-element components

Most components are namespaces of parts (`Accordion.Root`, `Accordion.Item`, …).
A few render a single element and are exported as the styled element itself,
with any helpers attached: `Button`, `Input` (+ `Input.Label`), `Form`,
`CheckboxGroup`, `Separator`, `Toggle`, `ToggleGroup`.

## Notes

- Import path convention is `@base-ui/react/<name>` (the package was previously
  published as `@base-ui-components/react`).
- Styling is applied with `@emotion/styled`; shared styles use `@emotion/react`'s
  `css` helper. Make sure Emotion is set up in your app.
- Colors use the `oklch()` color space and include `prefers-color-scheme: dark`
  variants, mirroring the Base UI docs.

## License

The component wrappers are yours to use freely. The ported CSS originates from
the Base UI documentation; refer to Base UI's own license for its terms.
