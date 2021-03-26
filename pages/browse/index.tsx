import { GetServerSideProps } from "next";
import { Dart } from "../../interfaces";
import { getAllDarts } from "../../services";
import Browse from "./[dartId]";

interface DataProps {
  darts?: Dart[];
}

const BrowsePage = ({ darts }: DataProps) => <Browse darts={darts} />;

export default BrowsePage;

export const getServerSideProps: GetServerSideProps<DataProps> = async () => {
  const darts = await getAllDarts();
  if (darts && darts.length > 0) {
    return {
      props: {
        darts,
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
