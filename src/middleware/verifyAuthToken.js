const jwt = require("jsonwebtoken");

const verifyAuthToken = async (req, res, next) => {
   const bearerToken = req.headers["authorization"];
   if (!bearerToken) {
      return res.status(401).json({error: "Invalid access token"});
   }
   const token = bearerToken.split(" ")[1];
   try {
      const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userid = user.userid;
      req.username = user.username;
      next();
   } catch (error) {
      return res.status(401).json({error: "Invalid access token"});
   }
};

module.exports = {verifyAuthToken};
