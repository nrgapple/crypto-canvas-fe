import React, { ReactNode } from "react";
import Head from "next/head";
import NavBar from "./NavBar";
import { Box, Center, Flex } from "@chakra-ui/layout";

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
  isEditor?: boolean;
  url?: string;
};

const Layout = ({
  children,
  title = "Crypto Canvas",
  description = "100% Decentralized NFTs built in a finite canvas",
  isEditor = false,
  url = "https://cryptocanvas.vercel.app",
}: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      {/* <link rel="apple-touch-icon" sizes="192x192" href="/logo-bg-192.png" /> */}
      <meta name="theme-color" content="#6930c3" />
      <meta property="og:title" content={title} key="og-title" />
      <meta property="og:type" content="article" />
      <meta
        property="og:description"
        content={description}
        key="og-description"
      />
      {/* <meta
        property="og:image"
        content={image ?? defaultImage}
        key="og-image"
      /> */}
      <meta property="og:url" content={url} key="og-url" />
      <meta
        name="title"
        content={title ?? "Progressive App Store"}
        key="title"
      />
      <meta name="description" content={description} key="description" />
      {/* <meta name="image" content={image ?? defaultImage} key="image" /> */}
      <meta name="url" content={url} key="url" />
      <meta name="twitter:card" content="summary" />
      <meta property="twitter:title" content={title} key="twitter-title" />
      <meta
        property="twitter:description"
        content={description}
        key="twitter-description"
      />
      {/* <meta
        property="twitter:image:src"
        content={image ?? defaultImage}
        key="twitter-image"
      /> */}
      <meta property="twitter:site" content={url} key="twitter-site" />
      <meta
        property="twitter:image:height"
        content="1200"
        key="twitter-height"
      />
      <meta property="twitter:image:width" content="1200" key="twitter-width" />
    </Head>
    <Flex direction="column" h="100vh" w="100vw">
      <NavBar isEditor={isEditor} />
      <Box w="100%" h="100%" className="app">
        {children}
      </Box>
    </Flex>
  </>
);

export default Layout;
