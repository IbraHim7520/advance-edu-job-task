import ProductModel from "../../DbModels/products.model.js";
import { ObjectId } from "mongodb";

const postProduct = async (productData) => {
  return await ProductModel.create(productData);
};

const getAllProductsService = async () => {
  return await ProductModel.find();
};

const getMyProductsService = async (userId) => {
  return await ProductModel.find({ userId: new ObjectId(userId) });
};

const getOneProduct = async (productId) => {
  return await ProductModel.findOne({ _id: new ObjectId(productId) });
};

const deleteOneProduct = async (userId, productId) => {
  return await ProductModel.deleteOne({
    _id: new ObjectId(productId),
    userId: new ObjectId(userId),
  });
};

export const productService = {
  postProduct,
  getAllProductsService,
  getMyProductsService,
  getOneProduct,
  deleteOneProduct,
};
