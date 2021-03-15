import { Divider, Heading, VStack, Wrap } from "@chakra-ui/layout";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import ExhibitBox from "../../components/ExhibitBox";
import Layout from "../../components/Layout";
import { useBids } from "../../hooks/useBids";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import { Pixel } from "../../interfaces";
import { allBidsState, pixelsState } from "../../state";

const ProfilePage = () => {
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract);
  const pixels = useRecoilValue(pixelsState);
  useBids(web3Contract);
  const allBids = useRecoilValue(allBidsState);

  const done = useMemo(() => !loading && web3Contract !== undefined, [
    loading,
    web3Contract,
  ]);

  const myExibits = useMemo(() => {
    const exibitMap = new Map<number, Pixel[]>();
    pixels.map((p) =>
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
    <Layout title={web3Contract?.accounts[0] ?? "Profile"}>
      {done && (
        <VStack w="100%" h="100%" overflowY="scroll">
          <Heading as="h1">My Exhibits</Heading>
          <Divider />
          <Wrap>{renderMyExibits}</Wrap>
        </VStack>
      )}
    </Layout>
  );
};

export default ProfilePage;
