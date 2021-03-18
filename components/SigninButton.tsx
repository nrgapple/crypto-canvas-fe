import { Circle } from "@chakra-ui/layout";
import { useContractAndAccount } from "../hooks/useContractAndAccount";

const SigninButton = () => {
  const { connect, status } = useContractAndAccount();
  console.log(status);
  return (
    <Circle
      size="20px"
      background={
        status === "connected" ? "var(--connected)" : "var(--disconnected)"
      }
      onClick={() => connect("injected")}
    ></Circle>
  );
};

export default SigninButton;
