import "./index.css";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { UseWalletProvider } from "use-wallet";
import { config } from "../app.config";

export default function App({ Component, pageProps }: AppProps) {
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
