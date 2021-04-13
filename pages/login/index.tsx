import { Button } from "@chakra-ui/button";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import ConnectView from "../../components/ConnectView";
import Layout from "../../components/Layout";
import {
  useAuth,
  useContractAndAccount,
} from "../../hooks/useContractAndAccount";

const Login = () => {
  return (
    <Layout>
      <ConnectView />
    </Layout>
  );
};

export default Login;
