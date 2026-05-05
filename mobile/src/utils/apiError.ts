type ApiErrorDetail = {
  path?: string;
  message?: string;
};

export type AppApiError = Error & {
  status?: number;
  errors?: ApiErrorDetail[];
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as AppApiError;
  return apiError?.message || fallback;
};

export const isInvalidCredentialsError = (error: unknown) => {
  const apiError = error as AppApiError;
  return apiError?.status === 401 || apiError?.message?.toLowerCase().includes("invalid credentials");
};

