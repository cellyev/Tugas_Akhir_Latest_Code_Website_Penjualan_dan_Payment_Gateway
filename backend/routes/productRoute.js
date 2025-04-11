const express = require("express");
const {
  updateProduct,
} = require("../controllers/productControllers/updateProductController");
const {
  getAllProducts,
  getAllProductsForAdmin,
} = require("../controllers/productControllers/getProductController");
const {
  createProduct,
} = require("../controllers/productControllers/createProductController");
const {
  deleteProduct,
} = require("../controllers/productControllers/deleteProductController");
const { verifyToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/isAdmin");
const { upload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// Router
router.get("/", getAllProducts);
router.get("/all-admin", getAllProductsForAdmin);

// router.post(
//   "/create-product-by-admin-who-not-admin-cannot-access-it",
//   createProduct
// );
// router.put(
//   "/update-product-by-admin-who-not-admin-cannot-access-it/:_id",
//   updateProduct
// );

// router.delete(
//   "/delete-product-by-admin-who-not-admin-cannot-access-it/:_id",
//   deleteProduct
// );

router.post(
  "/create",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createProduct
);

router.put(
  "/update/:_id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  updateProduct
);

router.delete("/delete/:_id", verifyToken, isAdmin, deleteProduct);

// export Router
module.exports = router;
