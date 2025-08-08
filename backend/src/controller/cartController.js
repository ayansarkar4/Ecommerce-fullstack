import { User } from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//add products to user cart
const addToCart = asyncHandler(async (req, res) => {
  const { itemId, size } = req.body;
  const userId = req.userId;

  const userData = await User.findById(userId);
  const cartData = await userData.cartdata;

  if (cartData[itemId]) {
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1; // increment existing
    } else {
      cartData[itemId][size] = 1; // add new size
    }
  } else {
    cartData[itemId] = { [size]: 1 }; // create new item with size 1
  }

  await User.findByIdAndUpdate(userId, { cartdata: cartData });

  return res
    .status(200)
    .json(new ApiResponse(200, { cartData }, "Product added to the cart"));
});

//update user cart
const updateCart = asyncHandler(async (req, res) => {
  const { itemId, size, quantity } = req.body;
  const userId = req.userId;

  const userData = await User.findById(userId);
  const cartData = await userData.cartdata;

  cartData[itemId][size] = quantity;

  await User.findByIdAndUpdate(userId, { cartdata: cartData });

  return res
    .status(200)
    .json(new ApiResponse(200, "Product updated in the cart"));
});

//get user cart data
const getUserCart = asyncHandler(async (req, res) => {
  // ✅ Use req.userId directly
  const userId = req.userId;

  const userData = await User.findById(userId);
  const cartData = userData?.cartdata || {};

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { cartData },
        "Product data fetched from the user's cart"
      )
    );
});

export { addToCart, updateCart, getUserCart };
