interface DefaultType {
  [key: string]: any;
}

export function saveToLocalStorage(key: string, data: DefaultType) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromLocalStorage<T extends DefaultType>(key: string, defaultValue: T = {} as T): T {
  const localStorageData = localStorage.getItem(key);
  return localStorageData ? JSON.parse(localStorageData) : defaultValue;
}

export function removeFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}
