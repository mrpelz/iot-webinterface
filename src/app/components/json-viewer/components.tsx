import { styled } from 'goober';
import { JSX } from 'preact/jsx-runtime';

import { dimensions } from '../../style.js';

export type TypeString =
  | 'boolean'
  | 'index'
  | 'key'
  | 'null'
  | 'number'
  | 'string'
  | 'undefined'
  | 'unknown';

export const INSET_CH = 3;

export const Wrapper = styled('section')`
  --background: #1e1e1e;
  --foreground-boolean: #569cd6;
  --foreground-faded: #7f7f7f;
  --foreground-index: #268bd2;
  --foreground-key: #9cdcfe;
  --foreground-null: #569cd6;
  --foreground-number: #b5cea8;
  --foreground-string: #ce9178;
  --foreground-undefined: #569cd6;
  --foreground: #d4d4d4;

  background-color: var(--background);
  color: var(--foreground);
  font-size: ${dimensions.fontSize};
  line-height: 1.5;
  padding: 1ch;
`;

export const Property = styled('div')`
  position: relative;
  --last-key: initial;

  &:last-of-type {
    --last-key: 1;
  }
`;

export const Key = styled<{
  isIndex?: boolean;
  onCopy?: JSX.ClipboardEventHandler<HTMLSpanElement>;
  title?: string;
}>('span')`
  color: var(
    ${({ isIndex = false }) =>
      isIndex ? '--foreground-index' : '--foreground-key'}
  );
`;

export const Annotation = styled<{ content: string }>('span')`
  margin-inline: 0.5ch;

  &::before {
    color: var(--foreground-faded);
    content: '${({ content }) => content}';
    font-size: ${dimensions.fontSizeSmall};
    font-style: italic;
  }
`;

export const Background = styled<{ type: TypeString }>('span')`
  background-color: color-mix(
    in srgb,
    var(${({ type }) => `--foreground-${type}`}) 25%,
    var(--background)
  );
`;

export const TypeAnnotation = styled<{ content: string }>('span')`
  margin-inline-end: 0.5ch;

  &::before {
    color: var(--foreground-faded);
    content: '${({ content }) => content}';
    font-size: ${dimensions.fontSizeSmall};
    font-style: italic;
    font-variant-caps: all-small-caps;
  }
`;

export const PrimitiveValue = styled<{ type: TypeString }>('span')`
  color: var(${({ type }) => `--foreground-${type}`});
`;

const treelineColors = ['#FF7E79', '#FFD479', '#73FA79', '#0096FF', '#7A81FF'];

export const Treeline = styled<{ content?: string; indent: number }>('span')`
  color: ${({ indent }) => treelineColors.at(indent % treelineColors.length)};

  &::before {
    border-inline-start: ${dimensions.hairline} solid currentColor;
    content: '${({ content = '' }) => content}';
    inline-size: ${INSET_CH - 0.75}ch;
    inset-block-end: calc(var(--last-key, 0) * calc(100% - 0.5lh));
    inset-block-start: 0;
    inset-inline-start: -${INSET_CH - 0.5}ch;
    position: absolute;
    text-align: right;
  }

  &::after {
    border-block-start: ${dimensions.hairline} solid currentColor;
    content: '';
    inline-size: ${INSET_CH - 1}ch;
    inset-block-start: 0.5lh;
    inset-inline-start: -${INSET_CH - 0.5}ch;
    position: absolute;
  }
`;
