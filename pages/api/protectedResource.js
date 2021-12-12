import { shinyauthAdmin } from "../../lib/shinyauth";

export default async function handler(req, res) {
  const { accessToken } = req.headers;

  try {
    const user = await shinyauthAdmin.verify(accessToken);
    res.json({ secret: "this is top secret, dont tell anyone" });
  } catch (e) {
    res.statusCode = 403;
    res.json("Unauthorized");
  }
}
