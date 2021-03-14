import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";
import BidsList from "../../components/BidsList";
import Layout from "../../components/Layout";
import { useBids } from "../../hooks/useBids";
import { useWeb3 } from "../../hooks/useWeb3";
import { allBidsState } from "../../state";

const BidsPage = () => {
  const { loading, web3Contract } = useWeb3();
  useBids(web3Contract);
  const [allBids] = useRecoilState(allBidsState);

  return (
    <Layout title="Bids">
      {loading ? (
        <h1>Loading Bids</h1>
      ) : (
        <>
          <div className="flex-center-center">
            <h5>Bids</h5>
          </div>
          <BidsList allBids={allBids} />
        </>
      )}
    </Layout>
  );
};

export default BidsPage;
