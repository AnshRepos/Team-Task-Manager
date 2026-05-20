import { useCallback, useEffect, useMemo, useState } from 'react';

import { authApi } from '../api/authApi.js';
import { tokenStorage } from '../api/tokenStorage.js';
import { AuthContext } from './auth-context.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => tokenStorage.get());
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [authError, setAuthError] = useState(null);

  const setSession = useCallback((authPayload) => {
    tokenStorage.set(authPayload.token);
    setToken(authPayload.token);
    setUser(authPayload.user);
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const signup = useCallback(
    async (payload) => {
      const authPayload = await authApi.signup(payload);
      setSession(authPayload);
      return authPayload.user;
    },
    [setSession],
  );

  const login = useCallback(
    async (payload) => {
      const authPayload = await authApi.login(payload);
      setSession(authPayload);
      return authPayload.user;
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    try {
      if (tokenStorage.get()) {
        await authApi.logout();
      }
    } catch {
      // Logout should still clear local state if the server token is expired.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const data = await authApi.me();

        if (isMounted) {
          setUser(data.user);
          setAuthError(null);
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
          setAuthError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [clearSession, token]);

  useEffect(() => {
    window.addEventListener('team-task-manager:unauthorized', clearSession);

    return () => {
      window.removeEventListener('team-task-manager:unauthorized', clearSession);
    };
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      authError,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      signup,
      login,
      logout,
    }),
    [authError, isBootstrapping, login, logout, signup, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
