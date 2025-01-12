import { useParams } from "react-router-dom"

function OrdersByRoom() {
    const params = useParams();

    console.log(params);
    
  return (
    <div>OrdersByRoom</div>
  )
}

export default OrdersByRoom