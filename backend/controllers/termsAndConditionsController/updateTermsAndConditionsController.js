const {
  updateTermsAndConditionsValidator,
} = require("../../middlewares/termsAndConditionsValidators/updateTermsAndConditionsValidator");
const TermsAndConditions = require("../../models/termsAndConditionsSchema");
const mongoose = require("mongoose");

exports.updateTermsAndConditions = async (req, res) => {
  const { _id } = req.params;
  const { title, text, no } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid ID format!",
        data: null,
      });
    }

    // Cari data berdasarkan ID
    const existingTermsAndConditions = await TermsAndConditions.findById(_id);
    if (!existingTermsAndConditions) {
      return res.status(404).json({
        success: false,
        message: "Terms and Conditions not found!",
        data: null,
      });
    }

    // Validasi input
    const { error } = updateTermsAndConditionsValidator.validate({
      title,
      text,
      no,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message),
        data: {},
      });
    }

    // Cek apakah title sudah ada di database selain dokumen yang sedang diperbarui
    const existingTitle = await TermsAndConditions.findOne({ title });
    if (existingTitle && existingTitle._id.toString() !== _id) {
      return res.status(400).json({
        success: false,
        message: "Title already exists!",
        data: {},
      });
    }

    // Cek apakah no sudah ada di database selain dokumen yang sedang diperbarui
    const existingNo = await TermsAndConditions.findOne({ no });
    if (existingNo && existingNo._id.toString() !== _id) {
      return res.status(400).json({
        success: false,
        message: "Terms and Conditions number already exists!",
        data: {},
      });
    }

    // Update data
    existingTermsAndConditions.title = title;
    existingTermsAndConditions.text = text;
    existingTermsAndConditions.no = no;
    const result = await existingTermsAndConditions.save();

    return res.status(200).json({
      success: true,
      message: "Terms and Conditions updated successfully!",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
      data: null,
    });
  }
};
