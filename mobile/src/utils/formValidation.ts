export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export const isBlank = (value: string) => value.trim().length === 0;

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidUrl = (value: string) => {
  if (isBlank(value)) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

