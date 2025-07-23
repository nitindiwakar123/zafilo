import usersData from "../usersDB.json" with {type: "json"};

function checkAuth(req, res, next) {
    const { uid } = req.cookies;
    const isUser = usersData.find((currUser) => currUser.id === uid);
    if (!uid || !isUser) return res.status(401).json({ error: "User not authenticated!" });
    next();
}

export default checkAuth;