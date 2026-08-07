export function logInfo(message: string, data?: unknown): void {
  if (import.meta.env.DEV) {
    console.info(`[Hotwheels] ${message}`, data ?? "");
  }
}

export function logError(message: string, error?: unknown): void {
  console.error(`[Hotwheels] ${message}`, error ?? "");
}

