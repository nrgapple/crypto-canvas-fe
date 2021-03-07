import React from "react";
import Layout from "../components/Layout";
import SidePanel from "../components/SidePanel";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  pixelsState,
  selectedBlockState,
  selectedPixelsState,
  worldState,
} from "../state";
import dynamic from "next/dynamic";
import { useWeb3 } from "../hooks/useWeb3";
import { usePixels } from "../hooks/usePixels";
import { Pixel, WorldStateType } from "../interfaces";
import BlockDetailPanel from "../components/BlockDetailPanel";

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const HomePage = () => {
  const { loading, web3Contract } = useWeb3();
  const { checkout, update } = usePixels(web3Contract);
  const [world, setWorld] = useRecoilState(worldState);
  const setSelectedPixels = useSetRecoilState(selectedPixelsState);
  const selectedBlock = useRecoilValue(selectedBlockState);
  const pixels = useRecoilValue(pixelsState);

  const handleCheckout = async (selected: Pixel[]) => {
    try {
      await checkout(selected);
      setSelectedPixels([]);
      setWorld(WorldStateType.view);
    } catch (e) {
      console.error(e);
    }
  };

  const refresh = () => {
    update();
  };

  return (
    <Layout title="Crypto Canvas">
      <div className="nav-bar">
        <h5
          style={{
            padding: "8px",
            marginBottom: "0px",
          }}
        >
          Crypto Canvas
        </h5>
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
              {world !== WorldStateType.create && selectedBlock && (
                <BlockDetailPanel
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
