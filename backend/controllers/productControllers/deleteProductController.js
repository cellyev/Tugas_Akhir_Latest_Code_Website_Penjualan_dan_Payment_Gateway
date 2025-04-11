const mongoose = require("mongoose");
const Products = require("../../models/productSchema");

const { deleteFromS3 } = require("../../utils/deleteFromS3");

exports.deleteProduct = async (req, res) => {
  const { _id } = req.params;

  try {
    // Cek validitas ID
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid product ID!",
        data: null,
      });
    }

    // Cari produk berdasarkan ID
    const existingProduct = await Products.findById(_id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    if (existingProduct.image) {
      await deleteFromS3(existingProduct.image);
    }

    await Products.deleteOne({ _id });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: null,
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
