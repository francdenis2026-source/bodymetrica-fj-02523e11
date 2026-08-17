import { describe, it, expect, vi } from 'vitest';

// Simular ambiente de servidor (sem window)
vi.stubGlobal('window', undefined);
vi.stubGlobal('localStorage', undefined);
vi.stubGlobal('navigator', undefined);

describe('SSR Compatibility for offline-sync', () => {
  it('should not throw ReferenceError when window is undefined', async () => {
    // Importar dinamicamente para testar o escopo do módulo
    const { getSyncHistory } = await import('./offline-sync');
    
    await expect(getSyncHistory()).resolves.toEqual({
      lastSync: null,
      totalSynced: 0,
      failures: 0
    });
  });
});
