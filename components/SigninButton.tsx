import { Circle } from "@chakra-ui/layout";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useContractAndAccount } from "../hooks/useContractAndAccount";
import { wasSignedInState } from "../state";

const SigninButton = () => {
  const { connect, status } = useContractAndAccount();
  const wasSignedIn = useRecoilValue(wasSignedInState);
  const render = useMemo(() => {
    // this makes literally no sense but it has
    // to be the opposite for some reason...
    const background = !wasSignedIn
      ? "var(--connected)"
      : "var(--disconnected)";
    console.log({ wasSignedIn, background });
    return (
      <Circle
        size="20px"
        background={background}
        onClick={() => connect("injected")}
      ></Circle>
    );
  }, [wasSignedIn]);

  return render;
};

export default SigninButton;
