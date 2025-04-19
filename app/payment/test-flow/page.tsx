import axios from "axios";
import PaymentButton from "./payment-button";

export default async function TestPayment() {
  const productDetails = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/lemon-squeezy/products`
  );

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex items-center gap-4">
        {productDetails.data.map((item: any, index: any) => {
          return (
            <PaymentButton
              key={index}
              name={item.name}
              productId={item.id}
              variantId={item.variantId}
            />
          );
        })}
      </div>
    </div>
  );
}
