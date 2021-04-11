enum WalletId {
  euth = 1,
  rin = 4,
  local = 1337,
}

export const config = {
  contractAddress: "0x4EeeFE3A82E7e706E4c4304ED368A4a3b3249E78",
  infuraProviderUri:
    "https://rinkeby.infura.io/v3/566baaea6f1246d8b5e3762f833bc321",
  chainId: WalletId.rin.valueOf(),
  baseUri: "https://deart.vercel.app/",
  openSeaBaseUri: "https://testnets.opensea.io/",
  tokenName: "decentralizedart-v3",
  signMsg: "Killer Klowns From Outerspace 1989 nonce:",
};
