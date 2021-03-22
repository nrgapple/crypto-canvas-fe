import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useContractAndAccount } from "../hooks/useContractAndAccount";
//@ts-ignore
import MetaMaskLogo from "metamask-logo";
import { useSetRecoilState } from "recoil";
import { showConnectPageState } from "../state";

const ConnectView = () => {
  const { connect, error } = useContractAndAccount();
  const logoParentRef = useRef<HTMLDivElement>(null);
  const setShowConnectPage = useSetRecoilState(showConnectPageState);

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
      // pxNotRatio: false,
      // width: 0.9,
      // height: 0.9,

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
        <Button onClick={() => onConnect()}>Refresh</Button>
      </VStack>
    </Center>
  );
};

export default ConnectView;
