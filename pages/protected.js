import { shinyauthClient, shinyauthAdmin } from "../lib/shinyauth";
import cookie from "cookie";

export default function Protected({ user }) {
  const handleLogout = () => {
    shinyauthClient.logout();
    window.location.reload();
  };
  return (
    <div>
      <h1>secret area!</h1>
      <p>you're logged in as email: {user.email}</p>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  // If no cookies are sent at all
  if (!Object.keys(context.req.headers).includes("cookie")) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  const cookies = cookie.parse(context.req.headers.cookie);

  if (!cookies["access_token"]) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  const accessToken = cookies["access_token"];
  const user = await shinyauthAdmin.verify(accessToken);

  return { props: { user } };
}
