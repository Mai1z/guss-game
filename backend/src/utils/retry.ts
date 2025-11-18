/**
 * Retry механизм для транзакций с Serializable уровнем изоляции
 * При конфликте сериализации Postgres выдает ошибку - нужно повторить попытку
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 10
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Retry только для конфликтов сериализации и deadlock
      const isRetryable =
        error.code === 'P2034' || // Prisma: transaction conflict
        error.code === '40P01';   // Postgres: deadlock_detected

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      // Экспоненциальная задержка со случайным смещением
      const delay = delayMs * Math.pow(2, attempt) + Math.random() * 10;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}