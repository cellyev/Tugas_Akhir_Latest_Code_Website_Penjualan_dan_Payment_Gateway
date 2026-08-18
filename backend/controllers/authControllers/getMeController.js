const User = require("../../models/userSchema");

/**
 * GET /api/v1/auth/me
 * Mengembalikan data user yang sedang login berdasarkan JWT di cookie.
 * Hanya bisa diakses jika token valid (sudah melalui verifyToken middleware).
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authenticated.",
      data: user,
    });
  } catch (error) {
    console.error("Error in getMe:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
    });
  }
};
