import { Divider, Heading, VStack, Wrap } from "@chakra-ui/layout";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import ExhibitBox from "../../components/ExhibitBox";
import Layout from "../../components/Layout";
import { useBids } from "../../hooks/useBids";
import { usePixels } from "../../hooks/usePixels";
import { Pixel } from "../../interfaces";
import { allBidsState, pixelsState, showConnectPageState } from "../../state";
import React from "react";
import { Button } from "@chakra-ui/react";
import {
  useContractAndAccount,
  useRequireLogin,
} from "../../hooks/useContractAndAccount";

const ProfilePage = () => {
  usePixels();
  const appData = useContractAndAccount(true);
  const { account, status, connect, web3, contract } = appData;
  const pixels = useRecoilValue(pixelsState);
  //useBids(web3Contract);
  const allBids = useRecoilValue(allBidsState);
  useRequireLogin(status);

  console.log("stuff", appData);
  const myExibits = useMemo(() => {
    const exibitMap = new Map<number, Pixel[]>();
    pixels
      .filter((p) => p.owner === account)
      .map((p) =>
        exibitMap.set(p.exhibitId!, [
          ...(exibitMap.has(p.exhibitId!) ? exibitMap.get(p.exhibitId!)! : []),
          p,
        ])
      );
    return Array.from(exibitMap);
  }, [pixels]);

  const renderMyExibits = useMemo(
    () =>
      myExibits.map(([key, value]) => (
        <ExhibitBox
          key={key}
          pixels={value}
          bid={allBids.find((b) => b.exhibitId === key)}
        />
      )),
    [myExibits, allBids]
  );

  return (
    <Layout title={account ?? "Profile"}>
      <VStack w="100%" h="100%" overflowY="scroll" p="8px">
        <Heading as="h1">My Exhibits</Heading>
        <Divider />
        <Wrap justify="center" w="100%">
          {renderMyExibits}
        </Wrap>
      </VStack>
    </Layout>
  );
};

export default ProfilePage;
