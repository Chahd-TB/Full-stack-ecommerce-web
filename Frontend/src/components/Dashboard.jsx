import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/axios";

import StatCard from "./StatCard";

function StockRow({
    label,
    value,
    color
}) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">

            <div className="flex items-center gap-3">

                <span
                    className={`w-2.5 h-2.5 rounded-full ${color}`}
                />

                <span className="text-gray-600">
                    {label}
                </span>

            </div>

            <span className="text-xl font-semibold text-gray-900">
                {value}
            </span>

        </div>
    );
}

function CategoryRow({
    name,
    value,
    total
}) {
    const percentage =
        total > 0
            ? Math.round((value / total) * 100)
            : 0;

    return (
        <div className="mb-5 last:mb-0">

            <div className="flex justify-between items-center mb-2">

                <span className="text-gray-600">
                    {name}
                </span>

                <span className="font-medium text-gray-900">
                    {value}
                </span>

            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                <div
                    className="h-full bg-[#1f6f6b] rounded-full"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

        </div>
    );
}

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response =
                    await getDashboardStats();

                setStats(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch dashboard stats:",
                    error
                );

                setError(
                    "Failed to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="px-4 pt-2">

                <h2 className="text-4xl font-semibold text-gray-900">
                    Dashboard
                </h2>

                <p className="text-gray-500 mt-2">
                    Loading dashboard data...
                </p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 pt-2">

                <h2 className="text-4xl font-semibold text-gray-900">
                    Dashboard
                </h2>

                <p className="text-red-600 mt-2">
                    {error}
                </p>

            </div>
        );
    }

    const inStockProducts =
        stats.totalProducts -
        stats.lowStockProducts -
        stats.outOfStockProducts;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="px-4 pt-2">

                <h2 className="text-4xl font-semibold text-gray-900">
                    Dashboard
                </h2>

                <p className="text-gray-500 mt-2">
                    Overview of your products, users, and inventory
                </p>

            </div>

            {/* Main stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4">

                <StatCard
                    value={stats.totalProducts}
                    label="Total products"
                />

                <StatCard
                    value={stats.totalUsers}
                    label="Total users"
                />

                <StatCard
                    value={stats.lowStockProducts}
                    label="Low-stock products"
                    variant="warning"
                />

                <StatCard
                    value={stats.outOfStockProducts}
                    label="Out-of-stock products"
                    variant="danger"
                />

            </div>

            {/* User stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">

                <StatCard
                    value={stats.adminCount}
                    label="Admins"
                />

                <StatCard
                    value={stats.userCount}
                    label="Regular users"
                    variant="purple"
                />

            </div>

            {/* Bottom sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-4">

                {/* Recent products */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                    <div className="mb-6">

                        <h3 className="text-2xl font-semibold text-gray-900">
                            Recent products
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Recently added products
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="text-left text-gray-500 border-b border-gray-200">

                                    <th className="py-3 pr-4 font-medium">
                                        Product
                                    </th>

                                    <th className="py-3 px-4 font-medium">
                                        Category
                                    </th>

                                    <th className="py-3 pl-4 font-medium text-right">
                                        Stock
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {stats.recentProducts?.map(
                                    (product) => (
                                        <tr
                                            key={product._id}
                                            className="border-b border-gray-100 last:border-b-0"
                                        >

                                            <td className="py-4 pr-4 font-medium text-gray-900">
                                                {product.name}
                                            </td>

                                            <td className="py-4 px-4 text-gray-500">
                                                {product.category}
                                            </td>

                                            <td
                                                className={`py-4 pl-4 text-right ${
                                                    product.stock === 0
                                                        ? "text-red-600 font-medium"
                                                        : product.stock <= 10
                                                        ? "text-yellow-700 font-medium"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {product.stock}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* Stock overview */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                    <div className="mb-6">

                        <h3 className="text-2xl font-semibold text-gray-900">
                            Stock overview
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Current inventory status
                        </p>

                    </div>

                    <div>

                        <StockRow
                            label="In stock"
                            value={inStockProducts}
                            color="bg-[#1f6f6b]"
                        />

                        <StockRow
                            label="Low stock"
                            value={
                                stats.lowStockProducts
                            }
                            color="bg-yellow-500"
                        />

                        <StockRow
                            label="Out of stock"
                            value={
                                stats.outOfStockProducts
                            }
                            color="bg-red-500"
                        />

                    </div>

                    {/* Categories */}
                    <div className="mt-8 pt-6 border-t border-gray-200">

                        <h3 className="text-xl font-semibold text-gray-900 mb-5">
                            Categories
                        </h3>

                        {stats.categoryStats?.map(
                            (category) => (
                                <CategoryRow
                                    key={category._id}
                                    name={category._id}
                                    value={category.count}
                                    total={
                                        stats.totalProducts
                                    }
                                />
                            )
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;