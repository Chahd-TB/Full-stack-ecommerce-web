import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import crypto from "crypto";

const createPayment = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to pay for this order"
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Order is already paid"
            });
        }

        const transactionId = `TEST-${crypto.randomUUID()}`;

        const payment = await Payment.create({
            order: order._id,
            user: req.user.userId,
            amount: order.totalPrice,
            method: order.paymentMethod,
            status: "pending",
            transactionId
        });

        res.status(201).json(payment);

    } catch (error) {
        next(error);
    }
};

const processPayment = async (req, res, next) => {
    try {
        const {
            paymentId,
            cardNumber
        } = req.body;

        const payment =
            await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        // Make sure the payment belongs
        // to the logged-in user
        if (
            payment.user.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You are not allowed to process this payment"
            });
        }

        // Don't process an already completed payment
        if (payment.status === "paid") {
            return res.status(400).json({
                message:
                    "Payment is already paid"
            });
        }

        // =========================
        // SIMULATED PAYMENT
        // =========================

        if (
            cardNumber !==
            "4242424242424242"
        ) {
            payment.status = "failed";

            await payment.save();

            return res.status(400).json({
                message:
                    "Payment failed"
            });
        }

        // =========================
        // PAYMENT SUCCESS
        // =========================

        payment.status = "paid";

        await payment.save();

        // Find the related order
        const order =
            await Order.findById(
                payment.order
            );

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found"
            });
        }

        // Update order payment status
        order.paymentStatus = "paid";

        // Confirm the order
        order.orderStatus = "confirmed";

        await order.save();

        res.status(200).json({
            message:
                "Payment successful",

            payment,

            order
        });

    } catch (error) {
        next(error);
    }
};

export { createPayment, processPayment };