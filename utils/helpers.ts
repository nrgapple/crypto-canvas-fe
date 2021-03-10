export const checkEmptyAddress = (address: string) => /^0x0+$/.test(address);

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
