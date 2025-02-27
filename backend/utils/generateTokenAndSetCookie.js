const jwt = require("jsonwebtoken");

exports.generateTokenAndSetCookie = (res, userId, username) => {
  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("Authorization", token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true, // Untuk keamanan, hanya bisa diakses oleh server
    secure: process.env.NODE_ENV === "production", // Aktif di production (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" jika frontend & backend beda origin
  });
};
