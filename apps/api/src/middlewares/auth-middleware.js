import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            req.user = jwt.verify(token, process.env.SECRET_KEY);
            next();
        } catch (error) {
            res.status(401).send("Invalid token");
        }
    } else {
        res.status(401).send("You are not authenticated");
    }
};

export default authMiddleware;
