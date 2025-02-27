const jwt = require("jsonwebtoken");

exports.generateTokenAndSetCookie = (res, userId, username) => {
  const token = jwt.sign(
    {
      userId,
      username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  // Jika sudah production
  res.cookie("Authorization", token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Jika masih development
  // res.cookie("Authorization", token, {
  //   path: "/",
  //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
  //   httpOnly: false, // Jangan httpOnly di mode development agar bisa diakses dari frontend
  //   secure: false, // Jangan secure di mode development agar bisa berjalan di http (bukan https)
  //   sameSite: "lax", // Agar cookie bisa digunakan dengan frontend berbeda origin
  // });
};
