const {
  createTermsAndConditionsValidator,
} = require("../../middlewares/termsAndConditionsValidators/createTermsAndConditionsValidator");
const TermsAndConditions = require("../../models/termsAndConditionsSchema");

exports.createTermsAndConditions = async (req, res) => {
  const { title, text, no } = req.body;

  try {
    const { error } = createTermsAndConditionsValidator.validate({
      title,
      text,
      no,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessages,
        data: {},
      });
    }

    const existingTermsAndConsitions = await TermsAndConditions.findOne({
      title,
    });
    if (existingTermsAndConsitions) {
      return res.status(400).json({
        success: false,
        message: "Terms and Conditions already exists!",
        data: {},
      });
    }

    const existingNo = await TermsAndConditions.findOne({
      no,
    });
    if (existingNo) {
      return res.status(400).json({
        success: false,
        message: "Terms and Conditions number already exists!",
        data: {},
      });
    }

    const newTermsAndConditions = new TermsAndConditions({
      title,
      text,
      no,
    });

    const result = await newTermsAndConditions.save();

    return res.status(201).json({
      success: true,
      message: "Terms and Conditions created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
      data: null,
    });
  }
};
