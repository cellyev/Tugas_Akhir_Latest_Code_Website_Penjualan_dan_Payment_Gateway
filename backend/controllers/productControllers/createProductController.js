const {
  createProductValidator,
} = require("../../middlewares/productValidators/createProductValidator");
const Products = require("../../models/productSchema");
const {
  findProductByName,
  findProductByImage,
} = require("../../utils/FindProduct");

exports.createProduct = async (req, res) => {
  const { name, description, stock, price, image } = req.body;

  try {
    const { error } = createProductValidator.validate({
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

    // Validate product name cannot be same
    const existingProductByName = await findProductByName(name);
    if (existingProductByName) {
      return res.status(400).json({
        success: false,
        message: "Product already exists!",
        data: existingProductByName,
      });
    }
    // Validate product image cannot be same
    const existingProductByImage = await findProductByImage(image);
    if (existingProductByImage) {
      return res.status(400).json({
        success: false,
        message: "Product image already exists!",
        data: existingProductByImage,
      });
    }

    const product = new Products({
      name,
      description,
      stock,
      price,
      image,
    });

    const result = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
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
