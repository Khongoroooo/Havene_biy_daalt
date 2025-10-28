
import VerifyClient from "./VerifyClient";

export default function Page({ params }: { params: { token: string } }) {
  return <VerifyClient token={params.token} />;
}
