exports.signOut = async (req, res) => {
  res.clearCookie("Authorization").status(200).json({
    success: true,
    message: "User logged out successfully!",
    data: {},
  });
};
