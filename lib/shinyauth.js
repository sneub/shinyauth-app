import fetch from "isomorphic-unfetch";
import { ethers } from "ethers";
import cookies from "js-cookie";

const AUTH_ENDPOINT =
  "https://us-central1-shinyauth-1bbd3.cloudfunctions.net/auth";

// server side only config
const CLIENT_ID = "abc";
const CLIENT_SECRET = "123";

const signMessage = async ({ message }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signature = await signer.signMessage(message);
  const address = await signer.getAddress();

  return { address, message, signature };
};

// client-side stuff
export const shinyauthClient = {
  login: async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("no metamask");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.length > 0) {
      console.log(accounts);

      const randomString =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      const sig = await signMessage({ message: randomString });

      const response = await fetch(`${AUTH_ENDPOINT}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sig),
      }).then(async (r) => ({
        ok: r.ok,
        json: await r.json(),
      }));

      if (response.ok) {
        cookies.set("access_token", response.json.accessToken);
        cookies.set("refresh_token", response.json.refreshToken);
      } else {
        console.log(response);
        throw new Error("Failed to login");
      }
    } else {
      console.log("something went wrong -- no wallet");
    }
  },

  // TODO: build this
  refresh: async () => {},

  logout: async () => {
    cookies.remove("access_token");
    cookies.remove("refresh_token");
  },
};

// This would be server-side
export const shinyauthAdmin = {
  verify: async (accessToken) => {
    const response = await fetch(`${AUTH_ENDPOINT}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        accessToken,
      }),
    }).then(async (r) => ({
      ok: r.ok,
      json: await r.json(),
    }));

    console.log(response);
    if (response.ok) {
      return response.json.data;
    } else {
      console.log(response);
      throw new Error("Could not verify");
    }
  },
};
