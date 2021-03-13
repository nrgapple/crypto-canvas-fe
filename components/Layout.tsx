import React, { ReactNode } from "react";
import Head from "next/head";
import NavBar from "./NavBar";
import { Box, Center, Flex } from "@chakra-ui/layout";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Cryto Canvas" }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Flex direction="column" h="100%" w="100%">
      <NavBar />
      <Box w="100%" h="100%">
        {children}
      </Box>
    </Flex>
  </>
);

export default Layout;
