import { Button } from "@chakra-ui/button";
import Layout from "../../components/Layout";
import { useAuth } from "../../hooks/useContractAndAccount";

const Login = () => {
  const { signin } = useAuth();

  return (
    <Layout>
      <Button onClick={signin}>Login</Button>
    </Layout>
  );
};

export default Login;
