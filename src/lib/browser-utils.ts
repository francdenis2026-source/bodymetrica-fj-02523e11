/**
 * Utilitário para encapsular acesso seguro a APIs do navegador
 * Evita erros de "window is not defined" durante SSR
 */

export const isBrowser = typeof window !== 'undefined';

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  },
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

export const safeNavigator = {
  get onLine(): boolean {
    if (!isBrowser) return true;
    return navigator.onLine;
  },
  get serviceWorker() {
    if (!isBrowser) return undefined;
    return navigator.serviceWorker;
  }
};

export const safeWindow = {
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void => {
    if (!isBrowser) return;
    window.addEventListener(type, listener, options);
  },
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void => {
    if (!isBrowser) return;
    window.removeEventListener(type, listener, options);
  }
};
