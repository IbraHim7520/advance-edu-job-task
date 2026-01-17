import { Router } from "express";
import verifyToken from '../../Middlewers/verifyToken.js';
import { productController } from "./product.controller.js";

const productRouter = Router();

productRouter.post('/create', verifyToken, productController.uploadProduct);
productRouter.get('/get-products', productController.getAllProducts);
productRouter.get('/my-products', verifyToken, productController.getMyProducts);
productRouter.get('/:productId/one', productController.getOneProductController);
productRouter.delete('/:productId/delete', verifyToken, productController.deleteProduct);

export default productRouter;
