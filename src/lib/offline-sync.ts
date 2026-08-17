import { toast } from "sonner";

// Use IndexedDB for the offline queue
const DB_NAME = 'BodyMetricaOfflineDB';
const STORE_NAME = 'offline_queue';
const DB_VERSION = 1;

export interface OfflineAction {
  id?: number;
  type: 'WATER_LOG' | 'MEAL_CONFIRM' | 'BODY_METRIC';
  data: any;
  timestamp: number;
}

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
    
    if (!navigator.onLine) {
      toast.info("Você está offline. O registro foi salvo localmente e será sincronizado quando a internet voltar.");
    }
  } catch (error) {
    console.error("Failed to queue offline action:", error);
  }
};

export const syncOfflineActions = async () => {
  if (!navigator.onLine) return;
  
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = async () => {
      const actions: OfflineAction[] = request.result;
      if (actions.length === 0) return;
      
      console.log(`Syncing ${actions.length} offline actions...`);
      
      // In a real app, we would send these to the server
      // For now, we simulate a successful sync
      for (const action of actions) {
        console.log("Syncing action:", action);
        // Simulate API call
        // await api.post('/sync', action);
      }
      
      // Clear the store after successful sync
      const clearTransaction = db.transaction(STORE_NAME, 'readwrite');
      clearTransaction.objectStore(STORE_NAME).clear();
      
      toast.success(`${actions.length} registros foram sincronizados com sucesso!`);
    };
  } catch (error) {
    console.error("Failed to sync offline actions:", error);
  }
};
