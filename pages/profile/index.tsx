import { Divider, Heading, VStack, Wrap } from "@chakra-ui/layout";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import DartBox from "../../components/ExhibitBox";
import Layout from "../../components/Layout";
import { allBidsState } from "../../state";
import React from "react";
import {
  useContractAndAccount,
  useRequireLogin,
} from "../../hooks/useContractAndAccount";
import { useDarts } from "../../hooks/useDarts";

const ProfilePage = () => {
  const appData = useContractAndAccount(true);
  const { account, status, connect, web3, contract } = appData;
  const { darts } = useDarts();
  useRequireLogin(status);

  const myDarts = useMemo(() => {
    return darts.filter((d) => d.owner == account);
  }, [darts, account]);

  const renderMyDarts = useMemo(
    () =>
      myDarts.map((dart) => (
        <DartBox
          key={dart.dartId}
          image={`/api/darts/image/${dart.dartId}`}
          dartId={dart.dartId}
          name={dart.name}
          bid={undefined}
        />
      )),
    [myDarts]
  );

  return (
    <Layout title={account ?? "Profile"}>
      <VStack w="100%" h="100%" overflowY="scroll" p="8px">
        <Heading as="h1">My Exhibits</Heading>
        <Divider />
        <Wrap justify="center" w="100%">
          {renderMyDarts}
        </Wrap>
      </VStack>
    </Layout>
  );
};

export default ProfilePage;
