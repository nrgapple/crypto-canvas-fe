import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { config } from "../app.config";
import { User } from "../interfaces";
import { authTokenState, userState } from "../state";

export const useProfile = () => {
  const token = useRecoilValue(authTokenState);
  const setUser = useSetRecoilState(userState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    if (token) {
      const resp = await fetch(`${config.baseUri}api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser((await resp.json()).user as User);
    }
  }, [token]);

  const updateProfile = useCallback(
    async (username: string, about: string) => {
      try {
        if (username && about) {
          setIsLoading(true);
          const resp = await fetch(`${config.baseUri}api/user`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ username, about }),
          });
          if (resp) {
            const newUser = (await resp.json()) as User;
            setUser(newUser);
          }
        }
        return true;
      } catch (error) {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  return { getProfile, updateProfile, isLoading } as const;
};
