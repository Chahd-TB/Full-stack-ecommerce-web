import mongoose from "mongoose";

export const CATEGORIES = ["Electronics", "Clothing", "Books", "Shoes", "Bags",
                           "Accessories", "Skincare"];

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: CATEGORIES,
            message: "{VALUE} is not a valid category",
        },
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    image:{
        type: String,
        default:"",
    }
});

const Product = mongoose.model("Product", productSchema);

export default Product;