import usersData from "../usersDB.json" with {type: "json"};

function checkAuth(req, res, next) {
    const { uid } = req.cookies;
    const user = usersData.find((currUser) => currUser.id === uid);
    if (!uid || !user) return res.status(401).json({ error: "User not authenticated!" });
    req.user = user;
    next();
}

export default checkAuth;