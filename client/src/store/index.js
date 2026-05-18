import { create } from 'zustand';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('finsocial_user') || 'null'),
  token: localStorage.getItem('finsocial_token') || null,
  isAuthenticated: !!localStorage.getItem('finsocial_token'),

  // Notification badge
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  decrementUnread: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),

  setAuth: (user, token) => {
    localStorage.setItem('finsocial_user', JSON.stringify(user));
    localStorage.setItem('finsocial_token', token);
    set({ user, token, isAuthenticated: true });
  },

  setUser: (user) => {
    localStorage.setItem('finsocial_user', JSON.stringify(user));
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    localStorage.removeItem('finsocial_user');
    localStorage.removeItem('finsocial_token');
    set({ user: null, token: null, isAuthenticated: false, unreadCount: 0 });
  },
}));

export default useStore;
