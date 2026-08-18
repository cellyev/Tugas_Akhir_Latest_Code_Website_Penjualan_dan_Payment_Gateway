const jwt = require("jsonwebtoken");

exports.generateTokenAndSetCookie = (res, userId, username) => {
  const token = jwt.sign(
    {
      userId,
      username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  // httpOnly: true — JavaScript di browser tidak bisa membaca cookie ini,
  // mencegah pencurian token via serangan XSS.
  // Cookie tetap dikirim otomatis oleh browser pada setiap request ke API.
  res.cookie("Authorization", token, {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
};
