const {
  updateProductValidator,
} = require("../../middlewares/productValidators/updateProductValidator");
const {
  findProductByName,
  findProductByImage,
  findProductById,
} = require("../../utils/FindProduct");
const mongoose = require("mongoose");

exports.updateProduct = async (req, res) => {
  const { name, description, stock, price, image } = req.body;
  const { _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    const existingProduct = await findProductById(_id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    const { error, value } = updateProductValidator.validate({
      name,
      description,
      stock,
      price,
      image,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    const verifiedName = await findProductByName(name);
    if (verifiedName && verifiedName._id != _id) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists!",
        data: null,
      });
    }

    const verifiedImage = await findProductByImage(image);
    if (verifiedImage && verifiedImage._id != _id) {
      return res.status(400).json({
        success: false,
        message: "Product with this image already exists!",
        data: null,
      });
    }

    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.stock = stock;
    existingProduct.price = price;
    existingProduct.image = image;

    const result = await existingProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product updated successfully!",
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
