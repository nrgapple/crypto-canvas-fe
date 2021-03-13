import { Heading, HStack, VStack } from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import { useRecoilValue } from "recoil";
import Layout from "../../components/Layout";
import Viewer from "../../components/Viewer";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import { pixelsState } from "../../state";

interface DataProps {
  exhibitId?: number;
}

const Exhibit = ({ exhibitId }: DataProps) => {
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract);
  const pixels = useRecoilValue(pixelsState);

  return (
    <Layout title={`${exhibitId}`}>
      <HStack>
        <VStack>
          <Viewer pixels={pixels.filter((p) => p.exhibitId === exhibitId)} />
        </VStack>
        <VStack>
          <Heading>Exhibit {exhibitId}</Heading>
        </VStack>
      </HStack>
    </Layout>
  );
};

export default Exhibit;

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  params,
}) => {
  if (params && params.exhibitId) {
    return {
      props: {
        exhibitId: parseInt(params.exhibitId as string),
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
