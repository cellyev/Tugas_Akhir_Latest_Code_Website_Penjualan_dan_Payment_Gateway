const jwt = require("jsonwebtoken");

exports.generateTokenAndSetCookie = (res, userId, username) => {
  const expiresIn = 7 * 24 * 60 * 60; // 7 hari dalam detik

  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET_KEY, {
    expiresIn,
    algorithm: "HS256", // Menentukan algoritma eksplisit
  });

  res.cookie("Authorization", token, {
    maxAge: expiresIn * 1000, // 7 hari dalam milidetik
    httpOnly: true, // Melindungi dari XSS
    secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
    sameSite: "strict", // Lebih aman untuk mencegah CSRF
  });

  return token; // Mengembalikan token jika dibutuhkan
};
