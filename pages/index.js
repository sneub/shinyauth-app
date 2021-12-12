import Link from "next/link";
import { shinyauthClient } from "../lib/shinyauth";

export default function Home() {
  const handleLogin = async () => {
    shinyauthClient.login();
  };

  return (
    <div>
      <button onClick={handleLogin}>Log in</button>
      <Link href="/protected">protected page</Link>
    </div>
  );
}
