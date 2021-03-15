import { List, ListItem } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Bid } from "../interfaces";
import { ETH_SYMBOL } from "../utils/helpers";


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
               bids && setHighestBids(bids.map((bid: any) => ({
                   from: bid.fromAddress,
                   amount: parseFloat(web3Contract.web3.utils.fromWei(bid.amount))
               } as Bid)))
            })()
        }
    }, [web3Contract, exhibitId])

    return (
        <List>
        {highestBids && highestBids.map((bid, i) => (
            <ListItem key={i}>
                {`${ETH_SYMBOL}${bid.amount}`}
            </ListItem>
        ))}
        </List>
    )
}

export default BidHistoryList;