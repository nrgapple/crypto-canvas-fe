import { ListItem } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Bid } from "../interfaces";


interface Props {
    exhibitId: number
}

const BidHistoryList = ({exhibitId}: Props) => {
    const [highestBids, setHighestBids] = useState<Bid[] | undefined>()
    const {web3Contract} = useWeb3()

    useEffect(() => {
        
        if (web3Contract && exhibitId !== undefined) {
            ;(async () => {
               const bids = await web3Contract.contract.methods.getBidHistoryForExhibit(exhibitId).call();
               console.log(bids)
               bids && setHighestBids(bids.map((bid: any) => ({
                   from: bid.fromAddress,
                   amount: parseFloat(web3Contract.web3.utils.fromWei(bid.amount))
               } as Bid)))
            })()
        }
    }, [web3Contract, exhibitId])

    return (
        <>
        {highestBids && highestBids.map((bid, i) => (
            <ListItem>
                {bid.amount}
            </ListItem>
        ))}
        </>
    )
}

export default BidHistoryList;