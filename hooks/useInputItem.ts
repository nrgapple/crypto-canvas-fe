import { useCallback, useState } from "react";

type errorMessage = string;

export const useInputItem = <T>(
  defaultItem: T,
  validate: (newItem: T) => errorMessage
) => {
  const [item, setItem] = useState<T | undefined>(defaultItem);
  const [error, setError] = useState<string>("");

  const onValidate = useCallback((newItem: T) => {
    setItem(newItem);
    setError(validate(newItem));
  }, []);

  return [item, error, onValidate] as const;
};
