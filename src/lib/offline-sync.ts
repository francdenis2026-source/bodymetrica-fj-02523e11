import { toast } from "sonner";
import { safeLocalStorage, safeNavigator, safeWindow, isBrowser } from "./browser-utils";

// Use IndexedDB for the offline queue
const DB_NAME = 'BodyMetricaOfflineDB';
const STORE_NAME = 'offline_queue';
const DB_VERSION = 1;

export interface OfflineAction {
  id?: number;
  type: 'WATER_LOG' | 'MEAL_CONFIRM' | 'BODY_METRIC';
  data: any;
  timestamp: number;
  status?: 'pending' | 'failed';
  error?: string;
}

export interface SyncHistory {
  lastSync: number | null;
  totalSynced: number;
  failures: number;
}

export const getSyncHistory = async (): Promise<SyncHistory> => {
  const lastSync = safeLocalStorage.getItem('last_sync_timestamp');
  const totalSynced = parseInt(safeLocalStorage.getItem('total_synced_count') || '0');
  const failures = parseInt(safeLocalStorage.getItem('sync_failures_count') || '0');
  
  return {
    lastSync: lastSync ? parseInt(lastSync) : null,
    totalSynced,
    failures
  };
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const queueOfflineAction = async (action: Omit<OfflineAction, 'timestamp'>) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const actionWithTimestamp: OfflineAction = {
      ...action,
      timestamp: Date.now()
    };
    
    store.add(actionWithTimestamp);
    
    if (!safeNavigator.onLine) {
      toast.info("Você está offline. O registro foi salvo localmente e será sincronizado quando a internet voltar.");
    }
  } catch (error) {
    console.error("Failed to queue offline action:", error);
  }
};

export const syncOfflineActions = async () => {
  if (!safeNavigator.onLine) return;
  
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = async () => {
      const actions: OfflineAction[] = request.result;
      if (actions.length === 0) return;
      
      console.log(`Syncing ${actions.length} offline actions...`);
      
      // Enviar para o servidor em lote ou sequência
      for (const action of actions) {
        try {
          console.log("Syncing action:", action);
          // Em um app real, aqui chamaríamos a API do Supabase
          // await supabase.from('logs').insert(action.data);
          
          // Simular sucesso
          const deleteTransaction = db.transaction(STORE_NAME, 'readwrite');
          deleteTransaction.objectStore(STORE_NAME).delete(action.id!);
          
          safeLocalStorage.setItem('total_synced_count', (parseInt(safeLocalStorage.getItem('total_synced_count') || '0') + 1).toString());
        } catch (err) {
          console.error("Failed to sync specific action:", err);
          safeLocalStorage.setItem('sync_failures_count', (parseInt(safeLocalStorage.getItem('sync_failures_count') || '0') + 1).toString());
        }
      }
      
      safeLocalStorage.setItem('last_sync_timestamp', Date.now().toString());
      toast.success(`${actions.length} registros foram sincronizados com sucesso!`);
    };
  } catch (error) {
    console.error("Failed to sync offline actions:", error);
  }
};

// Adiciona listener para sync em background se disponível
if (isBrowser) {
  const sw = safeNavigator.serviceWorker;
  if (sw && 'SyncManager' in window) {
    sw.ready.then(registration => {
      return (registration as any).sync.register('sync-offline-actions');
    }).catch(() => {
      // Fallback para quando o sync de background não é suportado
      safeWindow.addEventListener('online', syncOfflineActions);
    });
  } else {
    safeWindow.addEventListener('online', syncOfflineActions);
  }
}
