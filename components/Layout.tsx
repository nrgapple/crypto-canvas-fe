import React, { ReactNode } from "react";
import Head from "next/head";
import NavBar from "./NavBar";
import { Box, Flex } from "@chakra-ui/layout";
import { config } from "../app.config";

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

const Layout = ({
  children,
  title = "Crypto Canvas",
  description = "100% Decentralized NFTs built in a finite canvas",
  url = config.baseUri,
  image = "",
}: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300&family=Nunito:ital,wght@0,200;0,300;1,200&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* <link rel="apple-touch-icon" sizes="192x192" href="/logo-bg-192.png" /> */}
        <meta name="theme-color" content="#6930c3" />
        <link id="favicon" rel="shortcut icon" type="image/png" href={image} />
        <meta property="og:title" content={title} key="og-title" />
        <meta property="og:type" content="article" />
        <meta
          property="og:description"
          content={description}
          key="og-description"
        />
        <meta property="og:image" content={image} key="og-image" />
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
        <meta
          property="twitter:image:src"
          content={image}
          key="twitter-image"
        />
        <meta property="twitter:site" content={url} key="twitter-site" />
        <meta
          property="twitter:image:height"
          content="1200"
          key="twitter-height"
        />
        <meta
          property="twitter:image:width"
          content="1200"
          key="twitter-width"
        />
      </Head>
      <Flex direction="column" className="layout">
        <NavBar />
        <Box w="100%" h="100%" overflowY="hidden" className="app">
          {children}
        </Box>
      </Flex>
    </>
  );
};

export default Layout;
