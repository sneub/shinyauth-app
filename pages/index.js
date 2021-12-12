import { shinyauthClient } from "../lib/shinyauth";

export default function Home() {
  const handleLogin = async () => {
    shinyauthClient.login();
  };

  return (
    <div>
      <button onClick={handleLogin}>Log in</button>
      <a href="/protected">protected page</a>
    </div>
  );
}
