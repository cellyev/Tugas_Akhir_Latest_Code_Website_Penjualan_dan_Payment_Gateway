const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.Authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided!",
      data: {},
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token!",
        data: {},
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verify token: ", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
      data: {},
    });
  }
};
