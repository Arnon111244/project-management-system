const transfer = new Map<string, unknown>();
const STORAGE_PREFIX = "nav_transfer_";

function storageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

export function setTransfer(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < sessionStorage.length; i++) {
        const existingKey = sessionStorage.key(i);
        if (existingKey?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(existingKey);
        }
      }

      keysToRemove.forEach((keyToRemove) => {
        sessionStorage.removeItem(keyToRemove);
      });

      sessionStorage.setItem(storageKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn("Failed to save to sessionStorage", e);
    }
  }

  transfer.set(key, value);
}

export function takeTransfer<T = unknown>(key: string): T | undefined {
  const inMemory = transfer.get(key);
  if (inMemory !== undefined) {
    transfer.delete(key);
    return inMemory as T;
  }

  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(storageKey(key));
      if (raw != null) {
        return JSON.parse(raw) as T;
      }
    } catch (e) {
      console.warn("Failed to read from sessionStorage", e);
    }
  }

  return undefined;
}
