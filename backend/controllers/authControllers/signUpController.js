const { signUpValidator } = require("../../middlewares/authValidator");
const User = require("../../models/userSchema");
const { doHash } = require("../../utils/hashing");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { error } = signUpValidator.validate({
      username,
      password,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessages,
        data: null,
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
        data: null,
      });
    }

    const hashedPassword = await doHash(password, 12);
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const result = await newUser.save();
    newUser.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occured!",
      data: null,
    });
  }
};
