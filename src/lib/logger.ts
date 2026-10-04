export function logError(event: string, requestId: string, error: unknown) {
  console.error(
    JSON.stringify({
      level: "error",
      event,
      requestId,
      errorType: error instanceof Error ? error.name : "UnknownError",
    }),
  );
}
