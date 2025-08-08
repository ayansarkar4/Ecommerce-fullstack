import asyncHandler from "../utils/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import Stripe from "stripe";

//global variables
const currency = "USD";
const deliveryCharge = 10;

//geteway initialize

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing orders using COD
const placeOrderCOD = asyncHandler(async (req, res) => {
  const { items, amount, address } = req.body;
  const userId = req.userId;

  const orderData = {
    userId,
    items,
    address,
    amount,
    paymentMethod: "COD",
    payment: false,
    date: new Date(),
  };
  const newOrder = new Order(orderData);
  await newOrder.save();
  await User.findByIdAndUpdate(userId, { cartdata: {} });
  return res
    .status(200)
    .json(new ApiResponse(200, "successfully placed your order"));
});

//placing orders using stripe
const placeOrderStripe = asyncHandler(async (req, res) => {
  const { items, amount, address } = req.body;
  const userId = req.userId;
  const { origin } = req.headers;

  const orderData = {
    userId,
    items,
    address,
    amount,
    paymentMethod: "Stripe",
    payment: false,
    date: new Date(),
  };
  const newOrder = new Order(orderData);
  await newOrder.save();

  // Create line items for Stripe
  const line_items = items.map((item) => ({
    price_data: {
      currency: currency,
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // item price in cents
    },
    quantity: item.quantity,
  }));

  // Add delivery charge as a separate line item
  line_items.push({
    price_data: {
      currency: currency,
      product_data: {
        name: "Delivery Charges",
      },
      unit_amount: deliveryCharge * 100,
    },
    quantity: 1,
  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { url: session.url }, "Stripe session created"));
});

//verify stripe

const verifyStripe = asyncHandler(async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.userId;
  if (success === "true") {
    await Order.findByIdAndUpdate(orderId, { payment: true });
    await Order.findByIdAndUpdate(userId, { cartdata: {} });
    return res.status(200).json(new ApiResponse(200, "payment done"));
  } else {
    await Order.findByIdAndDelete(orderId);
  }
});

//all orders data for admin panel

const allOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, { orders }, "successfully fetched your orders"));
});

//user order data for frontend
const userOrders = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const orders = await Order.find({ userId });
  return res
    .status(200)
    .json(new ApiResponse(200, { orders }, "successfully fetched your orders"));
});

//update order status from admin
const updateStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  await Order.findByIdAndUpdate(orderId, { status: status });
  return res
    .status(200)
    .json(new ApiResponse(200, "successfully updated your order"));
});

export {
  verifyStripe,
  placeOrderCOD,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
};
