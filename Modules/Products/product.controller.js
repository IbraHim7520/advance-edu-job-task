import { productService } from "./product.service.js";

const uploadProduct = async (req, res) => {
  try {
    const user = req.user;
    const { name, description, price, quantity, image, inStock } = req.body;
    if (!name || !description || !price || !image) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    const productData = {
      userId: user._id,
      name,
      description: description || "",
      price,
      quantity: quantity ?? 0,
      inStock: inStock ?? true,
      image,
    };

    const productCreateResponse = await productService.postProduct(productData);

    return res.status(201).json({ success: true, result: productCreateResponse });

  } catch (error) {
    return res.status(500).json({ success: false, result: error.message || "Internal error on product controller!" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProductsService();
    return res.status(200).json({ success: true, result: products || [] });
  } catch (error) {
    return res.status(500).json({ success: false, result: error.message || "Internal error on product controller!" });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const user = req.user;
    const products = await productService.getMyProductsService(user._id);
    return res.status(200).json({ success: true, result: products || [] });
  } catch (error) {
    return res.status(500).json({ success: false, result: error.message || "Internal error on product controller!" });
  }
};

const getOneProductController = async (req, res) => {
  const productID = req.params.productId;
  if (!productID) return res.status(400).json({ success: false, message: "Product ID required!" });

  try {
    const product = await productService.getOneProduct(productID);
    if (!product) return res.status(404).json({ success: false, message: "No product found!" });

    return res.status(200).json({ success: true, result: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal error!" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const user = req.user;
    const productIdToDelete = req.params.productId;

    const DeleteResponse = await productService.deleteOneProduct(user._id, productIdToDelete);
    if (DeleteResponse.deletedCount >= 1) {
      return res.status(200).json({ success: true, result: "Product deleted." });
    } else {
      return res.status(404).json({ success: false, result: "Failed to delete product or already deleted!" });
    }

  } catch (error) {
    return res.status(500).json({ success: false, result: error.message || "Internal error on product controller!" });
  }
};

export const productController = {
  uploadProduct,
  getAllProducts,
  getMyProducts,
  getOneProductController,
  deleteProduct,
};
