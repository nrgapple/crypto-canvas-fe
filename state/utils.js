import { DefaultValue } from "recoil";

export const localStorageEffect = (key) => ({ setSelf, onSet, resetSelf }) => {
  if (typeof window === "undefined") {
    resetSelf();
    return;
  }
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue) => {
    if (typeof window === "undefined") return;
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};
