import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { disconnectSocket } from './useSocket';

/** Clear session and return to the marketing landing page. */
export function useLogout() {
  const navigate = useNavigate();
  const logout = useStore((s) => s.logout);

  return () => {
    logout();
    disconnectSocket();
    navigate('/', { replace: true });
  };
}

/** For non-React callers (e.g. axios interceptors). */
export function logoutAndGoLanding() {
  useStore.getState().logout();
  disconnectSocket();
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    window.location.replace('/');
  }
}
