import { redirect } from "next/navigation";

export default function PaymentSuccessRedirect() {
  redirect("/order-success");
}
