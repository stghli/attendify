/**
 * Secure logging utility that prevents sensitive data exposure in production
 * Only logs in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  // For critical errors that should always be logged
  criticalError: (...args: any[]) => {
    console.error('[CRITICAL]', ...args);
  }
};
