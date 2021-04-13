import {
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth, useContractAndAccount } from "../hooks/useContractAndAccount";
//@ts-ignore
import MetaMaskLogo from "metamask-logo";
import { useSetRecoilState } from "recoil";
import { showConnectPageState } from "../state";
import { useRouter } from "next/dist/client/router";

const ConnectView = () => {
  const { connect, error, status } = useContractAndAccount();
  const logoParentRef = useRef<HTMLDivElement>(null);
  const setShowConnectPage = useSetRecoilState(showConnectPageState);
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

  const onConnect = async () => {
    await connect("injected");
    if (status !== error) {
      setShowConnectPage(false);
    }
  };

  useEffect(() => {
    var viewer = MetaMaskLogo({
      // Dictates whether width & height are px or multiplied
      pxNotRatio: true,
      width: 500,
      height: 400,
      // To make the face follow the mouse.
      followMouse: false,
      // head should slowly drift (overrides lookAt)
      slowDrift: false,
    });
    if (logoParentRef.current) {
      logoParentRef.current.appendChild(viewer.container);
    }
    viewer.setFollowMouse(true);
    return () => {
      if (viewer && logoParentRef.current) {
        viewer.stopAnimation();
        logoParentRef.current.removeChild(viewer.container);
      }
    };
  }, []);

  return (
    <Center>
      <VStack>
        <Box ref={logoParentRef} />
        {error && <Heading>{error.name}</Heading>}
        {status === "connected" && (
          <Button isLoading={isLoading} onClick={handleSignin}>
            Login with Wallet
          </Button>
        )}
        {status === "disconnected" && (
          <Button onClick={onConnect}>Connect Wallet</Button>
        )}
        {status === "connecting" && <Spinner />}
      </VStack>
    </Center>
  );
};

export default ConnectView;
