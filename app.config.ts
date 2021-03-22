enum WalletId {
  euth = 1,
  rin = 4,
  local = 1337,
}

export const config = {
  contractAddress: "0x89dC4BeF0fa502bC0Fb0CAD2B05a42d2a33fd556",
  infuraProviderUri:
    "https://rinkeby.infura.io/v3/566baaea6f1246d8b5e3762f833bc321",
  chainId: WalletId.rin.valueOf(),
};
