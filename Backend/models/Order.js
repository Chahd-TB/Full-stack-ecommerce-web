import mongoose from "mongoose";

const orderModel = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },

        customerInfo: {
            fullName: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            wilaya: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            enum: [
                "cash_on_delivery",
                "cib_edahabia"
            ],
            required: true
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed"
            ],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderModel);

export default Order;
