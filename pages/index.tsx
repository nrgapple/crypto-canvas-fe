import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SidePanel from "../components/SidePanel";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  selectedExhibitState,
  selectedPixelsState,
  worldState,
} from "../state";
import dynamic from "next/dynamic";
import { useWeb3 } from "../hooks/useWeb3";
import { usePixels } from "../hooks/usePixels";
import { Pixel, WorldStateType } from "../interfaces";
import ExhibitDetailPanel from "../components/ExhibitDetailPanel";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

interface DataProps {
  exhibitId?: number;
}

const HomePage = ({ exhibitId }: DataProps) => {
  const { loading, web3Contract } = useWeb3();
  const { checkout, update } = usePixels(web3Contract);
  const [world, setWorld] = useRecoilState(worldState);
  const setSelectedPixels = useSetRecoilState(selectedPixelsState);
  const [selectedExhibit, setSelectedExhibit] = useRecoilState(
    selectedExhibitState
  );
  const router = useRouter();

  const handleCheckout = async (selected: Pixel[]) => {
    try {
      await checkout(selected);
      setSelectedPixels([]);
      setWorld(WorldStateType.view);
    } catch (e) {}
  };

  const refresh = () => {
    update();
  };

  useEffect(() => {
    setSelectedExhibit(exhibitId);
  }, [exhibitId]);

  useEffect(() => {
    if (selectedExhibit !== undefined) {
      router.replace({
        query: { exhibit: selectedExhibit.toString() },
      });
    } else {
      router.replace({ query: {} });
    }
  }, [selectedExhibit]);

  return (
    <Layout title="Crypto Canvas">
      <div className="nav-bar">
        <div className="flex-center-baseline">
          <h5>Crypto Canvas</h5>
          <Link href={"/about"}>
            <h6 className="clickable">about</h6>
          </Link>
          <Link href={"/bids"}>
            <h6 className="clickable">bids</h6>
          </Link>
        </div>
        <div
          className="button"
          onClick={() =>
            setWorld(
              world !== WorldStateType.view
                ? WorldStateType.view
                : WorldStateType.create
            )
          }
        >
          {world === WorldStateType.view ? "Create" : "Cancel"}
        </div>
      </div>
      {loading && !web3Contract ? (
        <div className="flex-center-center">
          <h3>Loading Web3</h3>
        </div>
      ) : (
        <>
          {!loading && web3Contract != undefined && (
            <div className="flex-space-strech m8">
              <div className="frame">
                <div className="border">
                  <World you={web3Contract?.accounts[0] ?? ""} />
                </div>
              </div>
              {world !== WorldStateType.create &&
                selectedExhibit != undefined && (
                  <ExhibitDetailPanel
                    web3Contract={web3Contract}
                    onRefresh={refresh}
                  />
                )}
              {world === WorldStateType.create && (
                <SidePanel onCheckout={handleCheckout} />
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  query,
}) => {
  if (query && query.exhibit) {
    return {
      props: {
        exhibitId: parseInt(query.exhibit as string),
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
