export default async function checkRole(req, res, next) {
    const user = req.user;
    // console.log({user});
    if (user.role !== 'user') return next();
    return res.status(403).json({ success: false, message: "Route did not exists!", error: "not accessible" });
}