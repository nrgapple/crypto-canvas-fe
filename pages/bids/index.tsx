import Link from "next/Link";
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
      <div className="nav-bar">
        <div className="flex-center-baseline">
          <Link href={"/"}>
            <h5 className="clickable">Crypto Canvas</h5>
          </Link>
          <Link href={"/about"}>
            <h6 className="clickable">about</h6>
          </Link>
          <Link href={"/bids"}>
            <h6 className="clickable">bids</h6>
          </Link>
        </div>
      </div>
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
