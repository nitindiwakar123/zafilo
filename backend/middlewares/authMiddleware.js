import redisClient from "../config/redisConfig.js";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;

  if (!sid) {
    res.clearCookie("sid", {
      httpOnly: true,
    });
    return res.status(401).json({ success: false, error: "Not logged in!" });
  }

  const session = await redisClient.hGetAll(`session:${sid}`);
  // console.log({session});

  if (!session) {
    res.clearCookie("sid", {
      httpOnly: true,
    });
    return res.status(401).json({ success: false, error: "Not logged in!" });
  }

  req.user = {_id: session.userId, rootDirId: session.rootDirId, role: session.role};
  next();
}
