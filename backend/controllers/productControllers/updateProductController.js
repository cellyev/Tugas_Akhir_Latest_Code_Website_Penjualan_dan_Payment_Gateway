const {
  updateProductValidator,
} = require("../../middlewares/productValidators/updateProductValidator");
const mongoose = require("mongoose");
const {
  uploadToS3,
  deleteFromS3,
  extractS3KeyFromUrl,
} = require("../../controllers/awsS3Controllers/setUp");
const Products = require("../../models/productSchema");

exports.updateProduct = async (req, res) => {
  try {
    const { _id } = req.params;

    // Validasi ID produk
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    // Cari produk yang sudah ada
    const existingProduct = await Products.findById(_id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    // Parsing dan trimming input
    const name = req.body.name?.trim();
    const description = req.body.description?.trim();
    const stock = Number(req.body.stock);
    const price = Number(req.body.price);

    // Validasi input
    const { error } = updateProductValidator.validate({
      name,
      description,
      stock,
      price,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join(", "),
        data: null,
      });
    }

    // Cek duplikat nama
    if (name && name !== existingProduct.name) {
      const duplicateName = await Products.findOne({ name });
      if (duplicateName) {
        return res.status(400).json({
          success: false,
          message: "Product name already exists!",
          data: null,
        });
      }
    }

    let finalImageUrl = existingProduct.image;

    // Jika ada file gambar baru yang diupload
    if (req.file) {
      const newImageUrl = await uploadToS3(req.file);

      // Cek jika image sudah digunakan di produk lain
      const duplicateImage = await Products.findOne({
        image: newImageUrl,
        _id: { $ne: _id }, // Exclude current product
      });

      if (duplicateImage) {
        // Hapus gambar yang baru diupload karena tidak digunakan
        const keyToDelete = extractS3KeyFromUrl(newImageUrl);
        await deleteFromS3(keyToDelete);

        return res.status(400).json({
          success: false,
          message: "Image already used by another product!",
          data: null,
        });
      }

      // Hapus gambar lama jika berasal dari S3
      if (
        existingProduct.image &&
        existingProduct.image.includes("amazonaws.com")
      ) {
        const keyToDelete = extractS3KeyFromUrl(existingProduct.image);
        await deleteFromS3(keyToDelete).catch((err) =>
          console.error("Failed to delete old image:", err)
        );
      }

      finalImageUrl = newImageUrl;
    }

    // Update produk
    const updatedProduct = await Products.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        stock,
        price,
        image: finalImageUrl,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An internal server error occurred!",
      data: null,
    });
  }
};
