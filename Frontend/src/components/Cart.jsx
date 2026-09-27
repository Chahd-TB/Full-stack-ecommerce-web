const API_URL = import.meta.env.VITE_API_URL;

function Cart({ cartItems, onRemove, onQuantityChange, onCheckout }) {
    const total = cartItems.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    return (
        <div className="px-2 sm:px-4">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                    Your Cart
                </h2>

                <p className="text-gray-500 mt-1">
                    Review the products you added
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <div className="text-5xl mb-4">
                        🛒
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800">
                        Your cart is empty
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Add some products to your cart.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">

                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5"
                            >

                                {/* Image */}
                                {item.image ? (
                                    <img
                                        src={`${API_URL}${item.image}`}
                                        alt={item.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}

                                {/* Information */}
                                <div className="flex-1">

                                    <p className="text-xs uppercase tracking-wide text-[#1f6f6b] font-medium">
                                        {item.category}
                                    </p>

                                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                                        {item.name}
                                    </h3>

                                    <p className="text-gray-700 font-medium mt-2">
                                        ${item.price}
                                    </p>

                                </div>

                                {/* Quantity */}
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden self-start sm:self-auto">

                                    <button
                                        onClick={() =>
                                            onQuantityChange(
                                                item._id,
                                                item.quantity - 1
                                            )
                                        }
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        −
                                    </button>

                                    <span className="px-4 font-medium">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            onQuantityChange(
                                                item._id,
                                                item.quantity + 1
                                            )
                                        }
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        +
                                    </button>

                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() =>
                                        onRemove(item._id)
                                    }
                                    className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition self-start sm:self-auto"
                                >
                                    Remove
                                </button>

                            </div>
                        ))}

                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">

                        <h3 className="text-xl font-semibold text-gray-900">
                            Order Summary
                        </h3>

                        <div className="flex justify-between mt-6 text-gray-600">
                            <span>
                                Items
                            </span>

                            <span>
                                {cartItems.reduce(
                                    (sum, item) =>
                                        sum + item.quantity,
                                    0
                                )}
                            </span>
                        </div>

                        <div className="border-t border-gray-200 my-5" />

                        <div className="flex justify-between">

                            <span className="text-lg font-semibold">
                                Total
                            </span>

                            <span className="text-xl font-semibold text-[#1f6f6b]">
                                ${total.toFixed(2)}
                            </span>

                        </div>

                        <button
                            onClick={onCheckout}
                            className="w-full mt-6 bg-[#1f6f6b] hover:bg-[#185b58] text-white py-3 rounded-xl font-medium transition"
                        >
                            Checkout
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Cart;