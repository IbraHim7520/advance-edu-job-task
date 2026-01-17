import { Router } from "express";
import { orderController } from "./order.controller.js";
import verifyToken from '../../Middlewers/verifyToken.js'

const orderRoute = Router();

// Authenticated order routes
orderRoute.post('/create-order', verifyToken, orderController.createOrder);
orderRoute.post('/:orderId/payment/payment-intent', verifyToken, orderController.handlePayment);

export default orderRoute;
