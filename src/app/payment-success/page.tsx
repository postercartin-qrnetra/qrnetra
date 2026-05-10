import { redirect } from "next/navigation";

export default function PaymentSuccessRedirect() {
  redirect("/checkout/success");
}
