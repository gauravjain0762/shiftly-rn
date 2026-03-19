/**
 * Ensures 401 redirect to login happens only ONCE when multiple API calls fail simultaneously.
 */

let isRedirecting = false;
const RESET_DELAY_MS = 5000;

export const shouldHandle401 = (): boolean => {
  if (isRedirecting) return false;
  isRedirecting = true;
  return true;
};

export const scheduleGuardReset = () => {
  setTimeout(() => {
    isRedirecting = false;
  }, RESET_DELAY_MS);
};
