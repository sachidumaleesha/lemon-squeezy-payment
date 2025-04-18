"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

type PurchaseButtonProps = {
  name: string;
  productId: string;
  variantId: string;
};

export default function PaymentButton({
  name,
  productId,
  variantId,
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/checkout`, {
        productId,
        variantId,
      });
      console.log(response);
      window.location.assign(response.data.data.attributes.url);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong! Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button onClick={onClick} size="sm" disabled={isLoading}>
      {name}
    </Button>
  );
}
