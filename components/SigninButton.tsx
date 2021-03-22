import { Circle } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import { useContractAndAccount } from "../hooks/useContractAndAccount";
import { wasSignedInState } from "../state";

const SigninButton = () => {
  const { connect, status } = useContractAndAccount();
  const wasSignedIn = useRecoilValue(wasSignedInState);
  console.log(wasSignedIn);
  return (
    <Circle
      size="20px"
      background={wasSignedIn ? "var(--connected)" : "var(--disconnected)"}
      onClick={() => connect("injected")}
    ></Circle>
  );
};

export default SigninButton;
