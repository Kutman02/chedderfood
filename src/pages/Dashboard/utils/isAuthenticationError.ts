import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export const isAuthenticationError = (
  error: FetchBaseQueryError | SerializedError | undefined
): boolean => {

  if (!error) return false;

  // Проверка FetchBaseQueryError
  if ("status" in error) {

    if (error.status === 401) {
      return true;
    }

    if (
      typeof error.data === "object" &&
      error.data !== null &&
      "status" in error.data &&
      (error.data as { status?: number }).status === 401
    ) {
      return true;
    }

  }

  return false;
};