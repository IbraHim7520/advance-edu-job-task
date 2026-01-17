import OrderModel from "../../DbModels/orders.model.js";
import { ObjectId } from "mongodb";

const createOrderService = async (orderData) => {
  const isOrdered = await OrderModel.findOne({
    productId: new ObjectId(orderData.productId),
    userId: new ObjectId(orderData.userId),
    status: "pending",
  });

  if (isOrdered) {
    throw new Error("This product is already pending in your orders!");
  }

  return await OrderModel.create(orderData);
};

const paymentHandleService = async (orderId) => {
  const orderData = await OrderModel.findOne({ _id: new ObjectId(orderId) });
  if (!orderData) throw new Error("Order not found!");
  return orderData;
};

// Update paymentStatus and paymentIntentId
const updateOrderStatus = async (orderId, paymentStatus, paymentIntentId = null) => {
  const updateObj = { paymentStatus };
  if (paymentIntentId) updateObj.paymentIntentId = paymentIntentId;

  return await OrderModel.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: updateObj }
  );
};

export const orderService = {
  createOrderService,
  paymentHandleService,
  updateOrderStatus,
};
