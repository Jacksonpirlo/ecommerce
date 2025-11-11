import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    type: String,
    price: Number,
    image: String,
    description: String,
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
