export const replaceTemplate = (
  template: string,
  payload: Record<string, any>,
): string => {
  return template.replace(
    /\{([^{}]+)\}/g,
    (_: unknown, placeholder: string) => {
      return payload.hasOwnProperty(placeholder)
        ? String(payload[placeholder])
        : `{${placeholder}}`;
    },
  );
};
