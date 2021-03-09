import { Table } from "reactstrap";
import { Bid } from "../interfaces";
import { useRouter } from "next/router";

interface Props {
  allBids: Bid[];
}

const BidsList = ({ allBids }: Props) => {
  const router = useRouter();
  return (
    <Table>
      <thead>
        <tr>
          <th>Exhibit Id</th>
          <th>Highest Bidder</th>
          <th>Amount (Eth)</th>
        </tr>
      </thead>
      <tbody>
        {allBids &&
          allBids.map((b, i) => (
            <tr key={i}>
              <th scope="row">{b.exhibitId}</th>
              <td>{b.from}</td>
              <td>{b.amount}</td>
              <td>
                <div
                  className="button"
                  onClick={() => router.push(`/?exhibit=${b.exhibitId}`)}
                >
                  View on Canvas
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default BidsList;
