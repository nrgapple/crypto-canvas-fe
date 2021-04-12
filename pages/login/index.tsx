import { Button } from "@chakra-ui/button";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import Layout from "../../components/Layout";
import {
  useAuth,
  useContractAndAccount,
} from "../../hooks/useContractAndAccount";

const Login = () => {
  useContractAndAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signin } = useAuth();
  const router = useRouter();

  const handleSignin = async () => {
    try {
      setIsLoading(true);
      await signin(router);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Button isLoading={isLoading} onClick={handleSignin}>
        Login
      </Button>
    </Layout>
  );
};

export default Login;
