import Stripe from "stripe";
import ProductModel from "../../DbModels/products.model.js";
import { orderService } from "./order.service.js";
import { ObjectId } from "mongodb";
import envConfig from "../../Configs/envConfig.js";

const stripe = new Stripe(envConfig.stripe_secret_key);
let paymentID = '';

// Create Order
const createOrder = async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid product or quantity!" });
    }

    const user = req.user;
    const product = await ProductModel.findById(new ObjectId(productId)).select("price");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    const totalPrice = Number(quantity) * Number(product.price);

    const orderData = {
      productId,
      userId: user._id,
      quantity: Number(quantity),
      totalPrice,
      paymentMethod: paymentMethod || "card",
    };

    const createdOrder = await orderService.createOrderService(orderData);

    return res.status(201).json({
      success: true,
      message: "Order created successfully!",
      result: createdOrder,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Order controller error!" });
  }
};

// Initiate Payment
const handlePayment = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) return res.status(400).json({ success: false, message: "Order id required!" });

    const orderData = await orderService.paymentHandleService(orderId);

    if (orderData.paymentStatus === "success") {
      return res.status(400).json({ success: false, message: "Order already paid!" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.totalPrice * 100),
      currency: "usd",
      metadata: {
        orderId: orderData._id.toString(),
        userId: orderData.userId.toString(),
      },
      automatic_payment_methods: { enabled: true },
    });

    paymentID = paymentIntent.id;

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Payment initiation failed!" });
  }
};

// Webhook Controller (Dev + Prod Ready)
const webhookController = async (req, res) => {
  try {
    let event;

    if (envConfig.node_env === "development") {
      const rawBody = req.body.toString("utf8");
      event = JSON.parse(rawBody);
    } else {
      const sig = req.headers["stripe-signature"];
      if (!sig) return res.status(400).json({ success: false, message: "Missing stripe-signature header" });
      event = stripe.webhooks.constructEvent(req.body, sig, envConfig.stripe_webhook);
    }

    if (!paymentID) return res.status(202).json({ success: false, message: "Create a payment first to confirm payment" });

    event.id = paymentID;

    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log("Payment succeeded:", event.id);
        const orderId = event.metadata.orderId;
        await orderService.updateOrderStatus(orderId, "paid");
        break;
      }
      case "payment_intent.payment_failed": {
        console.log("Payment failed:", event.id);
        const orderId = event.metadata.orderId;
        await orderService.updateOrderStatus(orderId, "failed");
        break;
      }
      default:
        console.log("Unhandled event type:", event.type || event);
    }

    paymentID = '';
    return res.status(200).json({ success: true, received: true });

  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(500).json({ success: false, message: `Webhook handler error: ${err.message}` });
  }
};

export const orderController = {
  createOrder,
  handlePayment,
  webhookController,
};
