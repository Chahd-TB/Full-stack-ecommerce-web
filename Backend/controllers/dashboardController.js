import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const getDashboardStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();

        const totalUsers = await User.countDocuments();

        const lowStockProducts = await Product.countDocuments({
            stock: {
                $gt: 0,
                $lte: 10
            }
        });

        const outOfStockProducts = await Product.countDocuments({
            stock: 0
        });

        const adminCount = await User.countDocuments({
            role: "admin"
        });

        const userCount = await User.countDocuments({
            role: "user"
        });

        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);

        res.json({
            totalProducts,
            totalUsers,
            lowStockProducts,
            outOfStockProducts,
            adminCount,
            userCount,
            recentProducts,
            categoryStats
        });
    } catch (error) {
        next(error);
    }
};

export {
    getDashboardStats
};