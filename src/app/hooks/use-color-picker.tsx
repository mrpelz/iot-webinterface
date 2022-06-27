import { useCallback, useMemo, useRef } from 'preact/hooks';
import { ComponentChild } from 'preact';
import { VisuallyHidden } from '../components/visually-hidden.js';

export type Channel = [number | null, ((value: number) => void) | null];

const byteToDecimal = (input: number) =>
  Math.round((input / 255) * 1000) / 1000;

const decimalToByte = (input: number) => Math.round(input * 255);

const colorStringToValue = (input: string) => {
  const colorValue = Number.parseInt(input.slice(1), 16);

  /* eslint-disable no-bitwise */
  const r = (colorValue >> 16) & 0xff;
  const g = (colorValue >> 8) & 0xff;
  const b = (colorValue >> 0) & 0xff;
  /* eslint-enable no-bitwise */

  return [byteToDecimal(r), byteToDecimal(g), byteToDecimal(b)] as const;
};

const valueToColorString = (input: number[]) =>
  `#${input
    .map((value) => decimalToByte(value).toString(16).padStart(2, '0'))
    .join('')}`;

export const useColorPicker = (
  [r, rSetter]: Channel,
  [g, gSetter]: Channel,
  [b, bSetter]: Channel
): [() => void, ComponentChild] => {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const colorValue = useMemo(
    () => valueToColorString([r || 0, g || 0, b || 0]),
    [b, g, r]
  );

  const handleColorInput = useCallback(() => {
    const { current: colorPicker } = colorPickerRef;
    if (!colorPicker) return;

    const { value } = colorPicker;
    if (!value) return;

    const [setR, setG, setB] = colorStringToValue(value);

    rSetter?.(setR);
    gSetter?.(setG);
    bSetter?.(setB);
  }, [bSetter, gSetter, rSetter]);

  const focus = useCallback(() => {
    const { current: colorPicker } = colorPickerRef;
    if (!colorPicker) return;

    colorPicker.click();
    colorPicker.focus();
  }, []);

  const component = useMemo(
    () => (
      <VisuallyHidden>
        <input
          onInput={handleColorInput}
          ref={colorPickerRef}
          type="color"
          value={colorValue}
        />
      </VisuallyHidden>
    ),
    [colorValue, handleColorInput]
  );

  return useMemo(() => [focus, component], [component, focus]);
};
