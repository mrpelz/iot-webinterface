export const writeClipboardText = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(new Error('error writing to clipboard', { cause: error }));
  }
};
