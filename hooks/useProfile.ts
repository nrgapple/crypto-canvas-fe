import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { config } from "../app.config";
import { authTokenState } from "../state";

export const useProfile = () => {
  const token = useRecoilValue(authTokenState);

  useEffect(() => {
    if (token) {
      const resp = fetch(`${config.baseUri}api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [token]);
};
