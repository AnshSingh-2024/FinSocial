import { createContext, useContext } from 'react';

/** Vertical scroll px for 3D (updated on scroll, no React rerenders). */
export const LandingScrollYRef = createContext(
  /** @type {import('react').MutableRefObject<number>} */ ({ current: 0 }),
);

export function useLandingScrollYRef() {
  return useContext(LandingScrollYRef);
}
