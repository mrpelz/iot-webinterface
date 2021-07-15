import { createGlobalStyles as createGlobalStyle } from 'goober/global';

const GlobalStyles = createGlobalStyle`
  * {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  :root {
    --font: -apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial,
      sans-serif;
    --titlebar-height: 44px;
    --menu-height: 44px;
    --menu-width: 200px;
    --translucent: var(--translucent-override, 0.8);

    --black: 0, 0%, 0%;
    --white: 0, 100%, 100%;
    --white-shaded: 240, 7%, 97%;
    --grey-light: 220, 2%, 76%;
    --grey-mid: 0, 0%, 77%;
    --grey-low: 0, 0%, 57%;
    --blue: 211, 100%, 50%;

    --black-shaded: 240, 17%, 9%;
    --grey-dark: 0, 0%, 26%;
    --grey-glow: 240, 9%, 23%;
    --orange: 35, 100%, 50%;

    --background-primary: var(--white);
    --background-secondary: var(--white-shaded);
    --background-tertiary: var(--grey-light);
    --font-primary: var(--black);
    --font-secondary: var(--grey-low);
    --font-tertiary: var(--grey-mid);
    --selection: var(--blue);
    --status-bar-background: var(--black);

    --safe-area-inset-top: env(safe-area-inset-top, 20px);
    /* --safe-area-inset-top: 20px; */
  }

  :root.dark {
    --background-primary: var(--black);
    --background-secondary: var(--black-shaded);
    --background-tertiary: var(--black-shaded);
    --font-primary: var(--white);
    --font-tertiary: var(--grey-glow);
    --selection: var(--orange);
    --status-bar-background: var(--black-shaded);
  }

  body {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    background: no-repeat center url('/images/icons/favicon-192.png'),
      hsl(var(--black-shaded));
    height: 100vh;
    overflow-x: hidden;
    scroll-behavior: auto;
    width: 100vw;
  }

  body::-webkit-scrollbar {
    display: none;
  }

  :root,
  body {
    margin: 0;
    padding: 0;
    scrollbar-width: none;
  }

  :root.ready body {
    background: hsl(var(--black-shaded));
    height: unset;
    width: unset;
  }

  :root.ready body::before {
    background: hsl(var(--status-bar-background));
    content: '';
    height: var(--safe-area-inset-top);
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 4;
  }
`;

export function App(): JSX.Element {
  return (
    <>
      <GlobalStyles />
    </>
  );
}
