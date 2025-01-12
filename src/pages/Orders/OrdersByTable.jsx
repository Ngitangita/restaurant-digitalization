import { useParams } from "react-router-dom";

function OrdersByTable() {
    const params = useParams();

    console.log(params);
  return (
    <div>OrdersByTable</div>
  )
}

export default OrdersByTable