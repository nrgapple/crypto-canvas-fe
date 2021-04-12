import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { config } from "../app.config";
import { User } from "../interfaces";
import { authTokenState } from "../state";

export const useProfile = () => {
  const token = useRecoilValue(authTokenState);
  const [user, setUser] = useState<User | undefined>(undefined);

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

  return { getProfile, user } as const;
};
