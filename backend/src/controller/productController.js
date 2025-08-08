import asyncHandler from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/productModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Add product

const addProduct = asyncHandler(async (req, res) => {
  console.log("Files:", req.files); // Debug

  const { name, price, description, category, sizes, bestseller, subCategory } =
    req.body;

  const image1 = req.files.image1 && req.files?.image1?.[0];
  const image2 = req.files.image2 && req.files?.image2?.[0];
  const image3 = req.files.image3 && req.files?.image3?.[0];
  const image4 = req.files.image4 && req.files?.image4?.[0];
  const images = [image1, image2, image3, image4].filter(
    (item) => item !== undefined
  );
  let imagesUrls = await Promise.all(
    images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      return result.secure_url;
    })
  );

  const product = new Product({
    name,
    price: Number(price),
    description,
    category,
    sizes: JSON.parse(sizes),
    images: imagesUrls,
    subCategory,
    date: new Date().toISOString(),
    bestseller: bestseller === "true",
  });

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product added successfully"));
});

const listProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, "Products fetched successfully"));
});
const removeProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product removed successfully"));
});
const singleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError("Product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

export { addProduct, listProduct, removeProduct, singleProduct };
