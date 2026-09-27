import Order from "../models/Order.js";

const createOrder = async (req, res, next) => {
    try {
        const {
            products,
            totalPrice,
            customerInfo,
            paymentMethod
        } = req.body;

        const order = await Order.create({
            user: req.user.userId,
            products,
            totalPrice,
            customerInfo,
            paymentMethod
        });

        res.status(201).json(order);

    } catch (error) {
        next(error);
    }
};

export { createOrder };