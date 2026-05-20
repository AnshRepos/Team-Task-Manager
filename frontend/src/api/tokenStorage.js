const TOKEN_KEY = 'team_task_manager_token';

export const tokenStorage = Object.freeze({
  get() {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      throw new Error('Unable to save your session in this browser');
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage can fail in restricted browser modes; clearing app state still logs out locally.
    }
  },
});
