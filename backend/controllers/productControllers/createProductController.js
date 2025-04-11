const {
  createProductValidator,
} = require("../../middlewares/productValidators/createProductValidator");
const Products = require("../../models/productSchema");
const {
  findProductByName,
  findProductByImage,
} = require("../../utils/FindProduct");
const { uploadToS3 } = require("../../controllers/awsS3Controllers/setUp");

exports.createProduct = async (req, res) => {
  try {
    console.log("[DEBUG] Request received:", {
      body: req.body,
      file: req.file
        ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : null,
      headers: req.headers,
    });

    const { name, description, stock, price } = req.body;

    // Validate input data
    const { error } = createProductValidator.validate({
      name,
      description,
      stock: Number(stock),
      price: Number(price),
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      console.error("[DEBUG] Validation errors:", errorMessages);
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    if (!req.file) {
      console.error("[DEBUG] No file uploaded");
      return res.status(400).json({
        success: false,
        message: "Image file is required!",
      });
    }

    console.log("[DEBUG] Uploading file to S3...");
    const imageUrl = await uploadToS3(req.file);
    console.log("[DEBUG] File uploaded to:", imageUrl);

    // Check for duplicate product name
    console.log("[DEBUG] Checking for duplicate product name...");
    const existingProductByName = await findProductByName(name);
    if (existingProductByName) {
      console.error("[DEBUG] Duplicate product found:", existingProductByName);
      return res.status(400).json({
        success: false,
        message: "Product already exists!",
        data: existingProductByName,
      });
    }

    // Check for duplicate image
    console.log("[DEBUG] Checking for duplicate image...");
    const existingProductByImage = await findProductByImage(imageUrl);
    if (existingProductByImage) {
      console.error("[DEBUG] Duplicate image found:", existingProductByImage);
      return res.status(400).json({
        success: false,
        message: "Product image already exists!",
        data: existingProductByImage,
      });
    }

    // Create new product
    console.log("[DEBUG] Creating new product document...");
    const product = new Products({
      name,
      description,
      stock: Number(stock),
      price: Number(price),
      image: imageUrl,
    });

    const result = await product.save();
    console.log("[DEBUG] Product created successfully:", result);

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    console.error("[DEBUG] Error in createProduct:", {
      message: error.message,
      stack: error.stack,
      ...(error.response && {
        response: {
          status: error.response.status,
          data: error.response.data,
        },
      }),
    });
    res.status(500).json({
      success: false,
      message: error.message || "An internal server error occurred!",
      data: null,
    });
  }
};
