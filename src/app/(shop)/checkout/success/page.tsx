import { redirect } from "next/navigation";

/** Legacy success route — handled by /order-success */
export default function CheckoutSuccessPage() {
  redirect("/order-success");
}
