import { useState } from "react";

export const useInputItem = <T>(defaultItem: T) => {
  const [item, setItem] = useState<T | undefined>(defaultItem);
  const [error, setError] = useState<string>("");

  return [item, setItem, error, setError] as const;
};
