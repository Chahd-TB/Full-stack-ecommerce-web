import { useState, useRef, useEffect } from "react";

function StockBadge({ stock }) {
    if (stock === 0)
        return (
            <span className="text-red-600 font-medium bg-red-100 rounded-full px-3 py-1 text-sm">
                Out of stock
            </span>
        );

    if (stock <= 10)
        return (
            <span className="text-orange-500 font-medium bg-orange-100 rounded-full px-3 py-1 text-sm">
                {stock}
            </span>
        );

    return (
        <span className="text-gray-700 font-medium">
            {stock}
        </span>
    );
}

function RowMenu({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1 transition"
            >
                ⋯
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

/* =========================
   ADMIN PRODUCT ROW
========================= */

function ProductRow({
    product,
    onEdit,
    onDelete
}) {
    return (
        <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors">

            {/* Product */}
            <td className="py-4 px-4">
                <div className="flex items-center gap-4">

                    {product.image ? (
                        <img
                            src={`http://localhost:3000${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            No image
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-gray-800">
                            {product.name}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            {product.category}
                        </p>
                    </div>

                </div>
            </td>

            {/* Category */}
            <td className="py-4 px-4 text-gray-600">
                {product.category}
            </td>

            {/* Price */}
            <td className="py-4 px-4 font-medium text-gray-800">
                ${product.price}
            </td>

            {/* Stock */}
            <td className="py-4 px-4">
                <StockBadge stock={product.stock} />
            </td>

            {/* Actions */}
            <td className="py-4 px-4">
                {onEdit && onDelete && (
                    <RowMenu
                        onEdit={() => onEdit(product)}
                        onDelete={() =>
                            onDelete(product._id)
                        }
                    />
                )}
            </td>

        </tr>
    );
}

/* =========================
   USER PRODUCT CARD
========================= */

function ProductCard({
    product,
    onAddToCart
}) {
    const [isAdded, setIsAdded] = useState(false);

    const handleCartClick = () => {
        setIsAdded((prev) => !prev);

        onAddToCart(product);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">

            {/* Image */}
            <div className="h-60 bg-gray-50 overflow-hidden">

                {product.image ? (
                    <img
                        src={`http://localhost:3000${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                    </div>
                )}

            </div>

            {/* Product information */}
            <div className="p-5">

                <p className="text-xs font-medium text-[#1f6f6b] uppercase tracking-wide">
                    {product.category}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-2">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between mt-4">

                    <p className="text-xl font-semibold text-gray-900">
                        ${product.price}
                    </p>

                </div>

                {/* Add / Remove from cart */}
                <button
                    onClick={handleCartClick}
                    disabled={product.stock === 0}
                    className={`w-full mt-5 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                        product.stock === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : isAdded
                            ? "bg-[#b7c360] hover:bg-[#54592b]"
                            : "bg-[#1f6f6b] hover:bg-[#185b58]"
                    }`}
                >
                    <span>
                        {isAdded ? "✓" : "🛒"}
                    </span>

                    {product.stock === 0
                        ? "Out of stock"
                        : isAdded
                        ? "Added to cart"
                        : "Add to cart"}
                </button>

            </div>
        </div>
    );
}
/* =========================
   PRODUCT TABLE
========================= */

function ProductTable({
    products,
    onEdit,
    onDelete,
    onAddToCart
}) {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const isAdmin = user?.role === "admin";

    /* =========================
       NORMAL USER DESIGN
    ========================= */

    if (!isAdmin) {
        return (
            <div className="px-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={onAddToCart}
                        />
                    ))}

                </div>

            </div>
        );
    }

    /* =========================
       ADMIN DESIGN
    ========================= */

    return (
        <div className="mx-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <table className="w-full text-base">

                <thead>
                    <tr className="text-left text-sm text-gray-500 bg-gray-50 border-b border-gray-200">

                        <th className="py-4 px-4 font-medium">
                            Product
                        </th>

                        <th className="py-4 px-4 font-medium">
                            Category
                        </th>

                        <th className="py-4 px-4 font-medium">
                            Price
                        </th>

                        <th className="py-4 px-4 font-medium">
                            Stock
                        </th>

                        <th className="py-4 px-4"></th>

                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <ProductRow
                            key={product._id}
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default ProductTable;