const express = require("express");
const {
  updateProduct,
} = require("../controllers/productControllers/updateProductController");
const {
  getAllProducts,
} = require("../controllers/productControllers/getProductController");
const {
  createProduct,
} = require("../controllers/productControllers/createProductController");
const {
  deleteProduct,
} = require("../controllers/productControllers/deleteProductController");

const router = express.Router();

// Router
router.get("/", getAllProducts);

router.post(
  "/create-product-by-admin-who-not-admin-cannot-access-it",
  createProduct
);
router.put(
  "/update-product-by-admin-who-not-admin-cannot-access-it/:_id",
  updateProduct
);

router.delete(
  "/delete-product-by-admin-who-not-admin-cannot-access-it/:_id",
  deleteProduct
);

// export Router
module.exports = router;
