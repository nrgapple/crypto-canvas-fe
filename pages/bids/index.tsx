import BidsList from "../../components/BidsList";
import Layout from "../../components/Layout";
import { useWeb3 } from "../../hooks/useWeb3";

const BidsPage = () => {
  const { loading, web3Contract } = useWeb3();

  return (
    <Layout title="Bids">
      {loading ? (
        <h1>Loading Bids</h1>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "8px",
            }}
          >
            <h5>Bids</h5>
          </div>
          <BidsList web3Contract={web3Contract} />
        </>
      )}
    </Layout>
  );
};

export default BidsPage;
