import "./index.css";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { UseWalletProvider } from "use-wallet";
import { config } from "../app.config";
import { useMobileResize } from "../hooks/useMobileResize";

export default function App({ Component, pageProps }: AppProps) {
  useMobileResize();

  return (
    <ChakraProvider>
      <UseWalletProvider
        chainId={config.chainId}
        connectors={{
          // This is how connectors get configured
          injected: {},
        }}
      >
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </UseWalletProvider>
    </ChakraProvider>
  );
}
