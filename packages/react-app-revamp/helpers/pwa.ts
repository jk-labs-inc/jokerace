import { loadFromLocalStorage, saveToLocalStorage } from "./localStorage";

export function shouldShowPopup(): boolean {
  const popupPreference = loadFromLocalStorage("pwaPreference");
  return !popupPreference?.doNotShowAgain;
}

export function hidePopupForever(): void {
  saveToLocalStorage("pwaPreference", { doNotShowAgain: true });
}
